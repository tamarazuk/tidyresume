import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PATCH } from '../route'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import * as resumeService from '@/services/resume-service'
import { getDb } from '@/db'

vi.mock('@opennextjs/cloudflare', () => ({
  getCloudflareContext: vi.fn(),
}))

vi.mock('@/db', () => ({
  getDb: vi.fn(),
}))

vi.mock('@/services/resume-service', () => ({
  getResume: vi.fn(),
  updateResumeTheme: vi.fn(),
}))

describe('PATCH /api/resumes/[id]/theme', () => {
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

  it('should return 404 if resume is not found', async () => {
    vi.mocked(resumeService.getResume).mockResolvedValue(null)

    const request = new Request('http://localhost/api/resumes/test-id/theme', {
      method: 'PATCH',
      body: JSON.stringify({ theme: { accent: 'rose' } }),
    })

    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'test-id' }),
    })

    expect(response.status).toBe(404)
  })

  it('should return 401 if edit secret header is missing', async () => {
    vi.mocked(resumeService.getResume).mockResolvedValue({
      id: 'test-id',
      editSecret: 'secret-123',
    } as unknown as Awaited<ReturnType<typeof resumeService.getResume>>)

    const request = new Request('http://localhost/api/resumes/test-id/theme', {
      method: 'PATCH',
      body: JSON.stringify({ theme: { accent: 'rose' } }),
    })

    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'test-id' }),
    })

    expect(response.status).toBe(401)
  })

  it('should return 401 if edit secret is incorrect', async () => {
    vi.mocked(resumeService.getResume).mockResolvedValue({
      id: 'test-id',
      editSecret: 'secret-123',
    } as unknown as Awaited<ReturnType<typeof resumeService.getResume>>)

    const request = new Request('http://localhost/api/resumes/test-id/theme', {
      method: 'PATCH',
      headers: {
        'X-Edit-Secret': 'wrong-secret',
      },
      body: JSON.stringify({ theme: { accent: 'rose' } }),
    })

    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'test-id' }),
    })

    expect(response.status).toBe(401)
  })

  it('should update theme when edit secret is correct', async () => {
    vi.mocked(resumeService.getResume).mockResolvedValue({
      id: 'test-id',
      editSecret: 'secret-123',
    } as unknown as Awaited<ReturnType<typeof resumeService.getResume>>)
    vi.mocked(resumeService.updateResumeTheme).mockResolvedValue({
      id: 'test-id',
      theme: { accent: 'rose' },
    })

    const request = new Request('http://localhost/api/resumes/test-id/theme', {
      method: 'PATCH',
      headers: {
        'X-Edit-Secret': 'secret-123',
      },
      body: JSON.stringify({ theme: { accent: 'rose' } }),
    })

    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'test-id' }),
    })

    expect(response.status).toBe(200)
    expect(resumeService.updateResumeTheme).toHaveBeenCalledWith(
      expect.anything(),
      { id: 'test-id', theme: { accent: 'rose' } }
    )
    const data = (await response.json()) as { theme?: { accent?: string } }
    expect(data.theme?.accent).toBe('rose')
  })
})
