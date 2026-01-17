import { NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { eq } from 'drizzle-orm'
import { getDb } from '@/db'
import { authTokens } from '@/db/schema'

export async function POST(request: Request) {
  try {
    const { token } = await request.json() as { token: string }

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 })
    }

    const { env } = await getCloudflareContext({ async: true })
    const db = getDb(env.DB)

    // Hash token to verify
    const encoder = new TextEncoder()
    const data = encoder.encode(token)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashedToken = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    const authToken = await db.query.authTokens.findFirst({
      where: eq(authTokens.token, hashedToken),
      with: { resume: true },
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
    await db.update(authTokens)
      .set({ usedAt: new Date() })
      .where(eq(authTokens.id, authToken.id))

    return NextResponse.json({ resume: authToken.resume })

  } catch (error) {
    console.error('Verify token error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
