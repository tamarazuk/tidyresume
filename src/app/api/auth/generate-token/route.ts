import { NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getDb } from '@/db'
import { sendMagicLinkEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const { resumeId, email } = await request.json() as { resumeId: string; email: string }

    if (!resumeId || !email) {
      return NextResponse.json({ error: 'Missing resumeId or email' }, { status: 400 })
    }

    const { env } = await getCloudflareContext({ async: true })
    const prisma = getDb(env.DB)

    // Check if resume exists
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
    })

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    // If resume has an owner, verify email matches
    if (resume.userEmail && resume.userEmail !== email) {
      return NextResponse.json({ error: 'Unauthorized: Resume belongs to another user' }, { status: 403 })
    }

    // Generate token
    const token = crypto.randomUUID()
    
    // Hash token
    const encoder = new TextEncoder()
    const data = encoder.encode(token)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashedToken = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    // Store in DB
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    const transactions = []

    // Update resume email if not set
    if (!resume.userEmail) {
      transactions.push(
        prisma.resume.update({
          where: { id: resumeId },
          data: { userEmail: email },
        })
      )
    }

    transactions.push(
      prisma.authToken.create({
        data: {
          token: hashedToken,
          resumeId,
          email,
          expiresAt,
        },
      })
    )

    await prisma.$transaction(transactions)

    // Send email
    // Use origin from request
    const origin = new URL(request.url).origin
    const magicLink = `${origin}/edit?token=${token}`

    await sendMagicLinkEmail(email, magicLink)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Generate token error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
