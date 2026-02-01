import { NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getDb } from '@/db'
import * as resumeService from '@/services/resume-service'
import { renderResumeHtml } from '@/lib/render-resume-html'

const HEADING_SIZE_SCALE: Record<string, string> = {
  xs: '0.9',
  sm: '0.95',
  md: '1',
  lg: '1.08',
  xl: '1.16',
}

const BODY_SIZE_REM: Record<string, string> = {
  '10': '0.625rem',
  '11': '0.6875rem',
  '12': '0.75rem',
  '13': '0.8125rem',
  '14': '0.875rem',
  '15': '0.9375rem',
  '16': '1rem',
}

// Debug endpoint to view the HTML that gets rendered to PDF
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { env } = await getCloudflareContext({ async: true })
    const db = getDb(env.DB)

    const resume = await resumeService.getResume(db, id)

    if (!resume) {
      return new NextResponse('Resume not found', { status: 404 })
    }

    const theme = resume.theme
    const renderOptions = {
      accentColor: theme?.accent,
      headingFont: theme?.typography?.heading,
      bodyFont: theme?.typography?.body,
      bodySize: theme?.typography?.bodySize
        ? BODY_SIZE_REM[theme.typography.bodySize]
        : undefined,
      headingScale: theme?.typography?.headingSize
        ? HEADING_SIZE_SCALE[theme.typography.headingSize]
        : undefined,
      bodyLeading: theme?.typography?.bodyLineHeight,
      // Note: bodyTracking intentionally omitted - letter-spacing is hardcoded
      // to 'normal' in renderResumeHtml for ATS-safe text extraction
    }

    const html = renderResumeHtml(resume.content, renderOptions)

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('HTML render error:', error)
    return new NextResponse('Failed to render HTML', { status: 500 })
  }
}
