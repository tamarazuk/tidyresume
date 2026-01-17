import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../route'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import * as resumeService from '@/services/resume-service'
import { getDb } from '@/db'
import { resumes } from '@/db/schema'

vi.mock('@opennextjs/cloudflare', () => ({
  getCloudflareContext: vi.fn(),
}))

vi.mock('@/db', () => ({
  getDb: vi.fn(),
}))

vi.mock('@/services/resume-service', () => ({
  getResume: vi.fn(),
  publishResume: vi.fn(),
}))

describe('POST /api/resumes/publish', () => {
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

  it('should allow publishing a new resume (no ID)', async () => {
    vi.mocked(resumeService.publishResume).mockResolvedValue({
      id: 'new-uuid',
      slug: null,
      editSecret: 'new-secret',
    })

    const request = new Request('http://localhost/api/resumes/publish', {
      method: 'POST',
      body: JSON.stringify({ title: 'New', content: 'Content' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.id).toBe('new-uuid')
  })

  it('should return 401 if updating existing resume without secret', async () => {
    vi.mocked(resumeService.getResume).mockResolvedValue({
      id: 'existing-id',
      editSecret: 'correct-secret',
    } as unknown as typeof resumes.$inferSelect)

    const request = new Request('http://localhost/api/resumes/publish', {
      method: 'POST',
      body: JSON.stringify({
        id: 'existing-id',
        title: 'Update',
        content: 'Content',
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(401)
  })

  it('should allow updating existing resume with correct secret', async () => {
    vi.mocked(resumeService.getResume).mockResolvedValue({
      id: 'existing-id',
      editSecret: 'correct-secret',
    } as unknown as typeof resumes.$inferSelect)
    vi.mocked(resumeService.publishResume).mockResolvedValue({
      id: 'existing-id',
      slug: null,
      editSecret: 'correct-secret',
    })

    const request = new Request('http://localhost/api/resumes/publish', {
      method: 'POST',
      headers: {
        'X-Edit-Secret': 'correct-secret',
      },
      body: JSON.stringify({
        id: 'existing-id',
        title: 'Update',
        content: 'Content',
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
    expect(resumeService.publishResume).toHaveBeenCalled()
  })

  it('should allow publishing with an ID if it does not exist in DB (Republish scenario)', async () => {
    // getResume returns undefined (doesn't exist in DB)
    vi.mocked(resumeService.getResume).mockResolvedValue(undefined)
    vi.mocked(resumeService.publishResume).mockResolvedValue({
      id: 'unpublished-id',
      slug: null,
      editSecret: 'new-secret',
    })

    const request = new Request('http://localhost/api/resumes/publish', {
      method: 'POST',
      body: JSON.stringify({
        id: 'unpublished-id',
        title: 'Republish',
        content: 'Content',
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
    expect(resumeService.publishResume).toHaveBeenCalled()
  })
})
