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
  renderResumeHtml: vi.fn(() => '<html><body>Test HTML</body></html>'),
}))

describe('GET /api/resumes/[id]/pdf', () => {
  const mockDb = {}
  let mockFetch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock fetch for Cloudflare Browser Rendering API
    mockFetch = vi.fn()
    global.fetch = mockFetch

    vi.mocked(getDb).mockReturnValue(
      mockDb as unknown as ReturnType<typeof getDb>
    )
  })

  it('should return 404 when resume is not found', async () => {
    vi.mocked(getCloudflareContext).mockResolvedValue({
      env: {
        DB: {},
        CLOUDFLARE_ACCOUNT_ID: 'test-account',
        CLOUDFLARE_BROWSER_RENDERING_API_TOKEN: 'test-token',
      },
    } as unknown as Awaited<ReturnType<typeof getCloudflareContext>>)

    vi.mocked(resumeService.getResume).mockResolvedValue(null)

    const request = new Request('http://localhost/api/resumes/test-id/pdf')
    const response = await GET(request, {
      params: Promise.resolve({ id: 'test-id' }),
    })

    expect(response.status).toBe(404)
    expect(await response.text()).toBe('Resume not found')
  })

  it('should return 503 when Cloudflare credentials are missing', async () => {
    vi.mocked(getCloudflareContext).mockResolvedValue({
      env: { DB: {} },
    } as unknown as Awaited<ReturnType<typeof getCloudflareContext>>)

    vi.mocked(resumeService.getResume).mockResolvedValue({
      id: 'test-id',
      content: '# Test Resume',
      title: 'Test Resume',
      theme: null,
    } as unknown as Awaited<ReturnType<typeof resumeService.getResume>>)

    const request = new Request('http://localhost/api/resumes/test-id/pdf')
    const response = await GET(request, {
      params: Promise.resolve({ id: 'test-id' }),
    })

    expect(response.status).toBe(503)
    expect(await response.text()).toContain('PDF generation not configured')
  })

  it('should return 503 when only account ID is provided', async () => {
    vi.mocked(getCloudflareContext).mockResolvedValue({
      env: {
        DB: {},
        CLOUDFLARE_ACCOUNT_ID: 'test-account',
      },
    } as unknown as Awaited<ReturnType<typeof getCloudflareContext>>)

    vi.mocked(resumeService.getResume).mockResolvedValue({
      id: 'test-id',
      content: '# Test Resume',
      title: 'Test Resume',
      theme: null,
    } as unknown as Awaited<ReturnType<typeof resumeService.getResume>>)

    const request = new Request('http://localhost/api/resumes/test-id/pdf')
    const response = await GET(request, {
      params: Promise.resolve({ id: 'test-id' }),
    })

    expect(response.status).toBe(503)
  })

  it('should call renderResumeHtml with resume content and theme options', async () => {
    vi.mocked(getCloudflareContext).mockResolvedValue({
      env: {
        DB: {},
        CLOUDFLARE_ACCOUNT_ID: 'test-account',
        CLOUDFLARE_BROWSER_RENDERING_API_TOKEN: 'test-token',
      },
    } as unknown as Awaited<ReturnType<typeof getCloudflareContext>>)

    vi.mocked(resumeService.getResume).mockResolvedValue({
      id: 'test-id',
      content: '# My Resume',
      title: 'My Resume',
      theme: {
        accent: 'teal',
        typography: {
          heading: 'geologica',
          body: 'noto-sans',
          headingSize: 'lg',
          bodySize: '14',
          bodyLineHeight: '1.5',
          bodyLetterSpacing: '0',
        },
      },
    } as unknown as Awaited<ReturnType<typeof resumeService.getResume>>)

    mockFetch.mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(10)),
    })

    const request = new Request('http://localhost/api/resumes/test-id/pdf')
    await GET(request, {
      params: Promise.resolve({ id: 'test-id' }),
    })

    expect(renderResumeHtml).toHaveBeenCalledWith(
      '# My Resume',
      expect.objectContaining({
        accentColor: 'teal',
        headingFont: 'geologica',
        headingScale: '1.08',
        bodySize: '0.875rem',
        bodyLeading: '1.5',
      })
    )
  })

  it('should call Cloudflare Browser Rendering API with correct parameters', async () => {
    vi.mocked(getCloudflareContext).mockResolvedValue({
      env: {
        DB: {},
        CLOUDFLARE_ACCOUNT_ID: 'my-account-id',
        CLOUDFLARE_BROWSER_RENDERING_API_TOKEN: 'my-api-token',
      },
    } as unknown as Awaited<ReturnType<typeof getCloudflareContext>>)

    vi.mocked(resumeService.getResume).mockResolvedValue({
      id: 'test-id',
      content: '# Test',
      title: 'Test',
      theme: null,
    } as unknown as Awaited<ReturnType<typeof resumeService.getResume>>)

    mockFetch.mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(10)),
    })

    const request = new Request('http://localhost/api/resumes/test-id/pdf')
    await GET(request, {
      params: Promise.resolve({ id: 'test-id' }),
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.cloudflare.com/client/v4/accounts/my-account-id/browser-rendering/pdf',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer my-api-token',
          'Content-Type': 'application/json',
        }),
      })
    )

    // Verify body content
    const callArgs = mockFetch.mock.calls[0]
    const body = JSON.parse(callArgs[1].body)
    expect(body).toMatchObject({
      html: expect.any(String),
      gotoOptions: { waitUntil: 'networkidle0' },
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
    })
  })

  it('should return PDF with correct headers on success', async () => {
    vi.mocked(getCloudflareContext).mockResolvedValue({
      env: {
        DB: {},
        CLOUDFLARE_ACCOUNT_ID: 'test-account',
        CLOUDFLARE_BROWSER_RENDERING_API_TOKEN: 'test-token',
      },
    } as unknown as Awaited<ReturnType<typeof getCloudflareContext>>)

    vi.mocked(resumeService.getResume).mockResolvedValue({
      id: 'test-id',
      content: '# Test',
      title: 'My Resume',
      theme: null,
    } as unknown as Awaited<ReturnType<typeof resumeService.getResume>>)

    const pdfContent = new Uint8Array([0x25, 0x50, 0x44, 0x46]) // %PDF
    mockFetch.mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(pdfContent.buffer),
    })

    const request = new Request('http://localhost/api/resumes/test-id/pdf')
    const response = await GET(request, {
      params: Promise.resolve({ id: 'test-id' }),
    })

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('application/pdf')
    expect(response.headers.get('Content-Disposition')).toBe(
      'attachment; filename="My Resume.pdf"'
    )
    expect(response.headers.get('Cache-Control')).toBe('no-store')
  })

  it('should sanitize filename to remove special characters', async () => {
    vi.mocked(getCloudflareContext).mockResolvedValue({
      env: {
        DB: {},
        CLOUDFLARE_ACCOUNT_ID: 'test-account',
        CLOUDFLARE_BROWSER_RENDERING_API_TOKEN: 'test-token',
      },
    } as unknown as Awaited<ReturnType<typeof getCloudflareContext>>)

    vi.mocked(resumeService.getResume).mockResolvedValue({
      id: 'test-id',
      content: '# Test',
      title: 'John\'s Resume <2024>',
      theme: null,
    } as unknown as Awaited<ReturnType<typeof resumeService.getResume>>)

    mockFetch.mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(10)),
    })

    const request = new Request('http://localhost/api/resumes/test-id/pdf')
    const response = await GET(request, {
      params: Promise.resolve({ id: 'test-id' }),
    })

    // Apostrophes are preserved, angle brackets are removed
    expect(response.headers.get('Content-Disposition')).toBe(
      'attachment; filename="John\'s Resume 2024.pdf"'
    )
  })

  it('should use default filename when title is empty', async () => {
    vi.mocked(getCloudflareContext).mockResolvedValue({
      env: {
        DB: {},
        CLOUDFLARE_ACCOUNT_ID: 'test-account',
        CLOUDFLARE_BROWSER_RENDERING_API_TOKEN: 'test-token',
      },
    } as unknown as Awaited<ReturnType<typeof getCloudflareContext>>)

    vi.mocked(resumeService.getResume).mockResolvedValue({
      id: 'test-id',
      content: '# Test',
      title: '',
      theme: null,
    } as unknown as Awaited<ReturnType<typeof resumeService.getResume>>)

    mockFetch.mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(10)),
    })

    const request = new Request('http://localhost/api/resumes/test-id/pdf')
    const response = await GET(request, {
      params: Promise.resolve({ id: 'test-id' }),
    })

    expect(response.headers.get('Content-Disposition')).toBe(
      'attachment; filename="resume.pdf"'
    )
  })

  it('should return 500 when Browser Rendering API fails', async () => {
    vi.mocked(getCloudflareContext).mockResolvedValue({
      env: {
        DB: {},
        CLOUDFLARE_ACCOUNT_ID: 'test-account',
        CLOUDFLARE_BROWSER_RENDERING_API_TOKEN: 'test-token',
      },
    } as unknown as Awaited<ReturnType<typeof getCloudflareContext>>)

    vi.mocked(resumeService.getResume).mockResolvedValue({
      id: 'test-id',
      content: '# Test',
      title: 'Test',
      theme: null,
    } as unknown as Awaited<ReturnType<typeof resumeService.getResume>>)

    mockFetch.mockResolvedValue({
      ok: false,
      text: () => Promise.resolve('API Error'),
    })

    const request = new Request('http://localhost/api/resumes/test-id/pdf')
    const response = await GET(request, {
      params: Promise.resolve({ id: 'test-id' }),
    })

    expect(response.status).toBe(500)
    expect(await response.text()).toBe('Failed to generate PDF')
  })

  it('should return 500 on unexpected errors', async () => {
    vi.mocked(getCloudflareContext).mockRejectedValue(new Error('Unexpected'))

    const request = new Request('http://localhost/api/resumes/test-id/pdf')
    const response = await GET(request, {
      params: Promise.resolve({ id: 'test-id' }),
    })

    expect(response.status).toBe(500)
    expect(await response.text()).toBe('Failed to generate PDF')
  })
})
