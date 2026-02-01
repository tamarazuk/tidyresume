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

    // Check for required environment variables
    const accountId = (env as unknown as Record<string, string>)
      .CLOUDFLARE_ACCOUNT_ID
    const apiToken = (env as unknown as Record<string, string>)
      .CLOUDFLARE_BROWSER_RENDERING_API_TOKEN

    if (!accountId || !apiToken) {
      return new NextResponse(
        'PDF generation not configured. Please use browser print (Ctrl/Cmd+P) instead.',
        { status: 503 }
      )
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
      bodyTracking: theme?.typography?.bodyLetterSpacing,
    }

    const html = renderResumeHtml(resume.content, renderOptions)

    // Use Cloudflare Browser Rendering REST API
    const pdfResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/browser-rendering/pdf`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html,
          gotoOptions: {
            waitUntil: 'networkidle0',
          },
          pdfOptions: {
            format: 'letter',
            printBackground: true,
            margin: {
              top: '0.5in',
              bottom: '0.5in',
              left: '0.5in',
              right: '0.5in',
            },
          },
        }),
      }
    )

    if (!pdfResponse.ok) {
      const errorText = await pdfResponse.text()
      console.error('Browser Rendering API error:', errorText)
      return new NextResponse('Failed to generate PDF', { status: 500 })
    }

    const pdfBuffer = await pdfResponse.arrayBuffer()

    const filename = resume.title
      ? `${resume.title.replace(/[^a-zA-Z0-9-_ ]/g, '')}.pdf`
      : 'resume.pdf'

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return new NextResponse('Failed to generate PDF', { status: 500 })
  }
}
