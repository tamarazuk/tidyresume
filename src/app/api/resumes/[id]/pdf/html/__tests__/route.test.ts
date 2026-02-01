import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '../route'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import * as resumeService from '@/services/resume-service'
import { getDb } from '@/db'
import { renderResumeHtml } from '@/lib/render-resume-html'

vi.mock('@opennextjs/cloudflare', () => ({
  getCloudflareContext: vi.fn(),
}))

vi.mock('@/db', () => ({
  getDb: vi.fn(),
}))

vi.mock('@/services/resume-service', () => ({
  getResume: vi.fn(),
}))

vi.mock('@/lib/render-resume-html', () => ({
  renderResumeHtml: vi.fn(
    () => '<!DOCTYPE html><html><body>Rendered HTML</body></html>'
  ),
}))

describe('GET /api/resumes/[id]/pdf/html (debug endpoint)', () => {
  const mockDb = {}

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(getCloudflareContext).mockResolvedValue({
      env: { DB: {} },
    } as unknown as Awaited<ReturnType<typeof getCloudflareContext>>)

    vi.mocked(getDb).mockReturnValue(
      mockDb as unknown as ReturnType<typeof getDb>
    )
  })

  it('should return 404 when resume is not found', async () => {
    vi.mocked(resumeService.getResume).mockResolvedValue(null)

    const request = new Request('http://localhost/api/resumes/test-id/pdf/html')
    const response = await GET(request, {
      params: Promise.resolve({ id: 'test-id' }),
    })

    expect(response.status).toBe(404)
    expect(await response.text()).toBe('Resume not found')
  })

  it('should return rendered HTML with correct content type', async () => {
    vi.mocked(resumeService.getResume).mockResolvedValue({
      id: 'test-id',
      content: '# Test Resume',
      title: 'Test Resume',
      theme: null,
    } as unknown as Awaited<ReturnType<typeof resumeService.getResume>>)

    const request = new Request('http://localhost/api/resumes/test-id/pdf/html')
    const response = await GET(request, {
      params: Promise.resolve({ id: 'test-id' }),
    })

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('text/html; charset=utf-8')
    expect(await response.text()).toBe(
      '<!DOCTYPE html><html><body>Rendered HTML</body></html>'
    )
  })

  it('should call renderResumeHtml with resume content', async () => {
    vi.mocked(resumeService.getResume).mockResolvedValue({
      id: 'test-id',
      content: '# My Resume\n\nSome content',
      title: 'Test Resume',
      theme: null,
    } as unknown as Awaited<ReturnType<typeof resumeService.getResume>>)

    const request = new Request('http://localhost/api/resumes/test-id/pdf/html')
    await GET(request, {
      params: Promise.resolve({ id: 'test-id' }),
    })

    expect(renderResumeHtml).toHaveBeenCalledWith(
      '# My Resume\n\nSome content',
      expect.any(Object)
    )
  })

  it('should pass theme options to renderResumeHtml', async () => {
    vi.mocked(resumeService.getResume).mockResolvedValue({
      id: 'test-id',
      content: '# Test',
      title: 'Test',
      theme: {
        accent: 'blue',
        typography: {
          heading: 'ibm-plex-serif',
          body: 'ibm-plex-sans',
          headingSize: 'xl',
          bodySize: '16',
          bodyLineHeight: '1.8',
          bodyLetterSpacing: '0.025em',
        },
      },
    } as unknown as Awaited<ReturnType<typeof resumeService.getResume>>)

    const request = new Request('http://localhost/api/resumes/test-id/pdf/html')
    await GET(request, {
      params: Promise.resolve({ id: 'test-id' }),
    })

    expect(renderResumeHtml).toHaveBeenCalledWith(
      '# Test',
      expect.objectContaining({
        accentColor: 'blue',
        headingFont: 'ibm-plex-serif',
        bodyFont: 'ibm-plex-sans',
        headingScale: '1.16',
        bodySize: '1rem',
        bodyLeading: '1.8',
      })
    )
  })

  it('should handle missing theme gracefully', async () => {
    vi.mocked(resumeService.getResume).mockResolvedValue({
      id: 'test-id',
      content: '# Test',
      title: 'Test',
      theme: null,
    } as unknown as Awaited<ReturnType<typeof resumeService.getResume>>)

    const request = new Request('http://localhost/api/resumes/test-id/pdf/html')
    const response = await GET(request, {
      params: Promise.resolve({ id: 'test-id' }),
    })

    expect(response.status).toBe(200)
    expect(renderResumeHtml).toHaveBeenCalledWith(
      '# Test',
      expect.objectContaining({
        accentColor: undefined,
        headingFont: undefined,
        bodyFont: undefined,
      })
    )
  })

  it('should handle partial theme gracefully', async () => {
    vi.mocked(resumeService.getResume).mockResolvedValue({
      id: 'test-id',
      content: '# Test',
      title: 'Test',
      theme: {
        accent: 'rose',
        // typography is undefined
      },
    } as unknown as Awaited<ReturnType<typeof resumeService.getResume>>)

    const request = new Request('http://localhost/api/resumes/test-id/pdf/html')
    const response = await GET(request, {
      params: Promise.resolve({ id: 'test-id' }),
    })

    expect(response.status).toBe(200)
    expect(renderResumeHtml).toHaveBeenCalledWith(
      '# Test',
      expect.objectContaining({
        accentColor: 'rose',
        headingFont: undefined,
        bodyFont: undefined,
      })
    )
  })

  it('should return 500 on unexpected errors', async () => {
    vi.mocked(resumeService.getResume).mockRejectedValue(
      new Error('Database error')
    )

    const request = new Request('http://localhost/api/resumes/test-id/pdf/html')
    const response = await GET(request, {
      params: Promise.resolve({ id: 'test-id' }),
    })

    expect(response.status).toBe(500)
    expect(await response.text()).toBe('Failed to render HTML')
  })

  it('should return 500 when renderResumeHtml throws', async () => {
    vi.mocked(resumeService.getResume).mockResolvedValue({
      id: 'test-id',
      content: '# Test',
      title: 'Test',
      theme: null,
    } as unknown as Awaited<ReturnType<typeof resumeService.getResume>>)

    vi.mocked(renderResumeHtml).mockImplementation(() => {
      throw new Error('Render error')
    })

    const request = new Request('http://localhost/api/resumes/test-id/pdf/html')
    const response = await GET(request, {
      params: Promise.resolve({ id: 'test-id' }),
    })

    expect(response.status).toBe(500)
    expect(await response.text()).toBe('Failed to render HTML')
  })
})
