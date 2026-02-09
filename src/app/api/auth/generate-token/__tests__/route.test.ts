import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getDb } from '@/db'
import { sendMagicLinkEmail } from '@/lib/email'
import { POST } from '../route'

vi.mock('@opennextjs/cloudflare', () => ({
  getCloudflareContext: vi.fn(),
}))

vi.mock('@/db', () => ({
  getDb: vi.fn(),
}))

vi.mock('@/lib/email', () => ({
  sendMagicLinkEmail: vi.fn(),
}))

describe('POST /api/auth/generate-token', () => {
  const mockDb = {
    query: {
      resumes: {
        findFirst: vi.fn(),
      },
    },
    update: vi.fn(),
    insert: vi.fn(),
    batch: vi.fn(),
  }

  const mockEnv = {
    DB: {},
    RATE_LIMITER: {
      limit: vi.fn(),
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockEnv.RATE_LIMITER.limit.mockResolvedValue({ success: true })
    vi.mocked(getCloudflareContext).mockResolvedValue({
      env: mockEnv,
    } as unknown as Awaited<ReturnType<typeof getCloudflareContext>>)
    vi.mocked(getDb).mockReturnValue(
      mockDb as unknown as ReturnType<typeof getDb>
    )
    mockDb.query.resumes.findFirst.mockResolvedValue({
      id: 'test-id',
      editSecret: 'owner-secret',
      userEmail: null,
    })
    mockDb.update.mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({ type: 'update-email' }),
      }),
    })
    mockDb.insert.mockReturnValue({
      values: vi.fn().mockReturnValue({ type: 'insert-token' }),
    })
    mockDb.batch.mockResolvedValue([])
    vi.mocked(sendMagicLinkEmail).mockResolvedValue(undefined)
  })

  it('returns 429 when rate limit is exceeded', async () => {
    mockEnv.RATE_LIMITER.limit.mockResolvedValue({ success: false })

    const request = new Request('http://localhost/api/auth/generate-token', {
      method: 'POST',
      body: JSON.stringify({ resumeId: 'test-id', email: 'test@example.com' }),
    })

    const response = await POST(request)
    const data = (await response.json()) as { error?: string }

    expect(response.status).toBe(429)
    expect(data.error).toBe('Too many requests')
    expect(mockDb.query.resumes.findFirst).not.toHaveBeenCalled()
  })

  it('returns 401 when edit secret is missing', async () => {
    const request = new Request('http://localhost/api/auth/generate-token', {
      method: 'POST',
      body: JSON.stringify({ resumeId: 'test-id', email: 'test@example.com' }),
    })

    const response = await POST(request)
    const data = (await response.json()) as { error?: string }

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
    expect(mockDb.batch).not.toHaveBeenCalled()
    expect(sendMagicLinkEmail).not.toHaveBeenCalled()
  })

  it('returns 401 when edit secret is invalid', async () => {
    const request = new Request('http://localhost/api/auth/generate-token', {
      method: 'POST',
      headers: {
        'X-Edit-Secret': 'wrong-secret',
      },
      body: JSON.stringify({ resumeId: 'test-id', email: 'test@example.com' }),
    })

    const response = await POST(request)
    const data = (await response.json()) as { error?: string }

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
    expect(mockDb.batch).not.toHaveBeenCalled()
    expect(sendMagicLinkEmail).not.toHaveBeenCalled()
  })

  it('returns 200 and sends email when edit secret is valid', async () => {
    const request = new Request('http://localhost/api/auth/generate-token', {
      method: 'POST',
      headers: {
        'X-Edit-Secret': 'owner-secret',
      },
      body: JSON.stringify({ resumeId: 'test-id', email: 'test@example.com' }),
    })

    const response = await POST(request)
    const data = (await response.json()) as { success?: boolean }

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(mockDb.batch).toHaveBeenCalledTimes(1)
    expect(sendMagicLinkEmail).toHaveBeenCalledWith(
      'test@example.com',
      expect.stringContaining('/edit?token=')
    )
  })
})
