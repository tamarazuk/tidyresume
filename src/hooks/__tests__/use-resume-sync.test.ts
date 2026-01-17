import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useResumeSync } from '../use-resume-sync'
import { publishResume } from '@/lib/resume-api'

// Mock dependencies
vi.mock('@/lib/resume-api', () => ({
  publishResume: vi.fn(),
  isResumeApiError: vi.fn((err) => 'status' in err),
}))

const setSyncStatus = vi.fn()
let storeState = {
  id: 'test-id',
  resumeTitle: 'Title',
  markdown: 'Content',
  slug: 'slug',
  isPublished: true,
  setSyncStatus,
}

vi.mock('@/stores/resume-store', () => ({
  useResumeStore: <T>(selector: (state: typeof storeState) => T) => selector(storeState),
}))

describe('useResumeSync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    storeState = {
      id: 'test-id',
      resumeTitle: 'Title',
      markdown: 'Content',
      slug: 'slug',
      isPublished: true,
      setSyncStatus,
    }
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should retry publishResume on failure', async () => {
    const error = new Error('Network error')
    vi.mocked(publishResume)
      .mockRejectedValueOnce(error) // 1st attempt fails
      .mockRejectedValueOnce(error) // 2nd attempt fails
      .mockResolvedValueOnce({ id: 'test-id', slug: 'slug' }) // 3rd attempt succeeds

    const { rerender } = renderHook(() => useResumeSync())

    // First render sets mounted=true.
    // We need to trigger the effect.
    // Change state to trigger re-render and effect
    storeState = { ...storeState, markdown: 'Updated Content' }
    rerender()

    // Fast-forward debounce time (2500ms)
    await vi.advanceTimersByTimeAsync(2500)

    // Expect first call
    expect(publishResume).toHaveBeenCalledTimes(1)
    
    // Fast-forward retry delay (e.g. 1000ms - generic assumption, implementation will define it)
    await vi.advanceTimersByTimeAsync(2000)
    expect(publishResume).toHaveBeenCalledTimes(2)

    await vi.advanceTimersByTimeAsync(4000)
    expect(publishResume).toHaveBeenCalledTimes(3)

    // Should be synced now
    expect(setSyncStatus).toHaveBeenLastCalledWith('synced')
  })
})