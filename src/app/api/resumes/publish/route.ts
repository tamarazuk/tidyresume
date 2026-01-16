import { NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getDb } from '@/db'
import * as resumeService from '@/services/resume-service'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      id?: string
      title: string
      content: string
      slug?: string | null
    }
    const { env } = await getCloudflareContext({ async: true })
    const db = getDb(env.DB)

    const result = await resumeService.publishResume(db, body)

    // Construct the view URL
    const url = result.slug ? `/r/${result.slug}` : `/r/${result.id}`

    return NextResponse.json({
      id: result.id,
      slug: result.slug,
      url,
      deleteSecret: result.deleteSecret,
    })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Slug already taken') {
      return NextResponse.json({ error: 'Slug already taken' }, { status: 409 })
    }
    console.error('Publish error:', error)
    return NextResponse.json(
      { error: 'Failed to publish resume' },
      { status: 500 }
    )
  }
}
