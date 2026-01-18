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
  updateResumeSlug: vi.fn(),
}))

describe('PATCH /api/resumes/[id]/slug', () => {
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

    const request = new Request('http://localhost/api/resumes/test-id/slug', {
      method: 'PATCH',
      body: JSON.stringify({ slug: 'new-slug' }),
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

    const request = new Request('http://localhost/api/resumes/test-id/slug', {
      method: 'PATCH',
      body: JSON.stringify({ slug: 'new-slug' }),
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

    const request = new Request('http://localhost/api/resumes/test-id/slug', {
      method: 'PATCH',
      headers: {
        'X-Edit-Secret': 'wrong-secret',
      },
      body: JSON.stringify({ slug: 'new-slug' }),
    })

    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'test-id' }),
    })

    expect(response.status).toBe(401)
  })

  it('should update slug when edit secret is correct', async () => {
    vi.mocked(resumeService.getResume).mockResolvedValue({
      id: 'test-id',
      editSecret: 'secret-123',
    } as unknown as Awaited<ReturnType<typeof resumeService.getResume>>)
    vi.mocked(resumeService.updateResumeSlug).mockResolvedValue({
      id: 'test-id',
      slug: 'new-slug',
    })

    const request = new Request('http://localhost/api/resumes/test-id/slug', {
      method: 'PATCH',
      headers: {
        'X-Edit-Secret': 'secret-123',
      },
      body: JSON.stringify({ slug: 'new-slug' }),
    })

    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'test-id' }),
    })

    expect(response.status).toBe(200)
    expect(resumeService.updateResumeSlug).toHaveBeenCalledWith(
      expect.anything(),
      { id: 'test-id', slug: 'new-slug' }
    )
    const data = (await response.json()) as { url?: string }
    expect(data.url).toBe('/r/new-slug')
  })

  it('should return 409 if slug is already taken', async () => {
    vi.mocked(resumeService.getResume).mockResolvedValue({
      id: 'test-id',
      editSecret: 'secret-123',
    } as unknown as Awaited<ReturnType<typeof resumeService.getResume>>)
    vi.mocked(resumeService.updateResumeSlug).mockRejectedValue(
      new Error('Slug already taken')
    )

    const request = new Request('http://localhost/api/resumes/test-id/slug', {
      method: 'PATCH',
      headers: {
        'X-Edit-Secret': 'secret-123',
      },
      body: JSON.stringify({ slug: 'new-slug' }),
    })

    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'test-id' }),
    })

    expect(response.status).toBe(409)
  })
})
