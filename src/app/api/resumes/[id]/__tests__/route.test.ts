import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DELETE } from '../route'
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
  deleteResume: vi.fn(),
}))

describe('DELETE /api/resumes/[id]', () => {
  const mockDb = {}

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getCloudflareContext).mockResolvedValue({ env: { DB: {} } } as any)
    vi.mocked(getDb).mockReturnValue(mockDb as any)
  })

  it('should return 401 if delete secret header is missing', async () => {
    vi.mocked(resumeService.getResume).mockResolvedValue({
      id: 'test-id',
      deleteSecret: 'secret-123',
    } as any)

    const request = new Request('http://localhost/api/resumes/test-id', {
      method: 'DELETE',
    })

    const response = await DELETE(request, { params: Promise.resolve({ id: 'test-id' }) })
    expect(response.status).toBe(401)
  })

  it('should return 401 if delete secret is incorrect', async () => {
    vi.mocked(resumeService.getResume).mockResolvedValue({
      id: 'test-id',
      deleteSecret: 'secret-123',
    } as any)

    const request = new Request('http://localhost/api/resumes/test-id', {
      method: 'DELETE',
      headers: {
        'X-Delete-Secret': 'wrong-secret',
      },
    })

    const response = await DELETE(request, { params: Promise.resolve({ id: 'test-id' }) })
    expect(response.status).toBe(401)
  })

  it('should delete if delete secret is correct', async () => {
    vi.mocked(resumeService.getResume).mockResolvedValue({
      id: 'test-id',
      deleteSecret: 'secret-123',
    } as any)

    const request = new Request('http://localhost/api/resumes/test-id', {
      method: 'DELETE',
      headers: {
        'X-Delete-Secret': 'secret-123',
      },
    })

    const response = await DELETE(request, { params: Promise.resolve({ id: 'test-id' }) })
    expect(response.status).toBe(200)
    expect(resumeService.deleteResume).toHaveBeenCalledWith(expect.anything(), 'test-id')
  })
})