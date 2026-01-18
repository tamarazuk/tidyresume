import { NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getDb } from '@/db'
import * as resumeService from '@/services/resume-service'
import type { ResumeThemeSettings } from '@/types/resume'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      id?: string
      title: string
      content: string
      slug?: string | null
      theme?: ResumeThemeSettings | null
    }
    const { env } = await getCloudflareContext({ async: true })
    const db = getDb(env.DB)

    // Security Check: If updating an existing resume, verify the edit secret
    if (body.id) {
      const existingResume = await resumeService.getResume(db, body.id)
      if (existingResume) {
        const secretHeader = request.headers.get('X-Edit-Secret')
        if (
          !existingResume.editSecret ||
          secretHeader !== existingResume.editSecret
        ) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
      }
    }

    const result = await resumeService.publishResume(db, body)

    // Construct the view URL
    const url = result.slug ? `/r/${result.slug}` : `/r/${result.id}`

    return NextResponse.json({
      id: result.id,
      slug: result.slug,
      url,
      editSecret: result.editSecret,
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
