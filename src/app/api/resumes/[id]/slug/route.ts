import { NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getDb } from '@/db'
import * as resumeService from '@/services/resume-service'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { slug } = (await request.json()) as { slug?: string | null }
    const { env } = await getCloudflareContext({ async: true })
    const db = getDb(env.DB)

    const resume = await resumeService.getResume(db, id)

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    const secretHeader = request.headers.get('X-Edit-Secret')

    if (!resume.editSecret || secretHeader !== resume.editSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await resumeService.updateResumeSlug(db, { id, slug })

    const url = result.slug ? `/r/${result.slug}` : `/r/${result.id}`

    return NextResponse.json({
      id: result.id,
      slug: result.slug,
      url,
    })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Slug already taken') {
      return NextResponse.json({ error: 'Slug already taken' }, { status: 409 })
    }
    console.error('Slug update error:', error)
    return NextResponse.json(
      { error: 'Failed to update slug' },
      { status: 500 }
    )
  }
}
