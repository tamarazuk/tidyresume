import { NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getDb } from '@/db'
import * as resumeService from '@/services/resume-service'
import type { ResumeThemeSettings } from '@/types/resume'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { theme } = (await request.json()) as {
      theme?: ResumeThemeSettings | null
    }
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

    const result = await resumeService.updateResumeTheme(db, { id, theme })

    return NextResponse.json({
      id: result.id,
      theme: result.theme ?? null,
    })
  } catch (error: unknown) {
    console.error('Theme update error:', error)
    return NextResponse.json(
      { error: 'Failed to update theme' },
      { status: 500 }
    )
  }
}
