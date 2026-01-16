import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../route'
import { getCloudflareContext } from '@opennextjs/cloudflare'

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
  const mockEnv = {
    DB: {},
    RATE_LIMITER: {
      limit: vi.fn(),
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getCloudflareContext).mockResolvedValue({ env: mockEnv } as any)
  })

  it('should return 429 when rate limit is exceeded', async () => {
    // Simulate rate limit exceeded
    mockEnv.RATE_LIMITER.limit.mockResolvedValue({ success: false })

    const request = new Request('http://localhost/api/auth/generate-token', {
      method: 'POST',
      body: JSON.stringify({ resumeId: 'test-id', email: 'test@example.com' }),
    })

    const response = await POST(request)
    
    // This will fail initially because the route doesn't implement rate limiting yet
    expect(response.status).toBe(429)
    const data = await response.json()
    expect(data.error).toBe('Too many requests')
  })
})
