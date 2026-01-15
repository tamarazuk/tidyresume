import { NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { eq } from 'drizzle-orm'
import { getDb } from '@/db'
import { resumes, authTokens } from '@/db/schema'
import { sendMagicLinkEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const { resumeId, email } = await request.json() as { resumeId: string; email: string }

    if (!resumeId || !email) {
      return NextResponse.json({ error: 'Missing resumeId or email' }, { status: 400 })
    }

    const { env } = await getCloudflareContext({ async: true })
    const db = getDb(env.DB)

    // Check if resume exists
    const resume = await db.query.resumes.findFirst({
      where: eq(resumes.id, resumeId),
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

    type BatchOp = Parameters<typeof db.batch>[0][number]
    const batch: BatchOp[] = []

    // Update resume email if not set
    if (!resume.userEmail) {
      batch.push(
        db.update(resumes)
          .set({ userEmail: email })
          .where(eq(resumes.id, resumeId))
      )
    }

    batch.push(
      db.insert(authTokens).values({
        id: crypto.randomUUID(),
        token: hashedToken,
        resumeId,
        email,
        expiresAt,
      })
    )

    await db.batch(batch as [BatchOp, ...BatchOp[]])

    // Send email
    // Determine base URL
    // Priority: Environment Variable -> Request Origin
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin
    const magicLink = `${baseUrl}/edit?token=${token}`

    await sendMagicLinkEmail(email, magicLink)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Generate token error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
