import { NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getDb } from '@/db'

export async function POST(request: Request) {
  try {
    const { token } = await request.json() as { token: string }

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 })
    }

    const { env } = await getCloudflareContext({ async: true })
    const prisma = getDb(env.DB)

    // Hash token to verify
    const encoder = new TextEncoder()
    const data = encoder.encode(token)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashedToken = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    const authToken = await prisma.authToken.findUnique({
      where: { token: hashedToken },
      include: { resume: true },
    })

    if (!authToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    if (authToken.usedAt) {
      return NextResponse.json({ error: 'Token already used' }, { status: 401 })
    }

    if (authToken.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 })
    }

    // Mark as used
    await prisma.authToken.update({
      where: { id: authToken.id },
      data: { usedAt: new Date() },
    })

    return NextResponse.json({ resume: authToken.resume })

  } catch (error) {
    console.error('Verify token error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
