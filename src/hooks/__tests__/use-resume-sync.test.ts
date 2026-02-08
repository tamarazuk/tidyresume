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
const setResumeId = vi.fn()
const setResumeSlug = vi.fn()
const setEditSecret = vi.fn()
let storeState = {
  getActiveDraft: () => ({
    id: 'test-id',
    resumeTitle: 'Title',
    markdown: 'Content',
    slug: 'slug',
    resumeDisplay: {
      theme: {
        accent: 'indigo',
        typography: {
          heading: 'geologica',
          body: 'noto-sans',
          headingSize: 'md',
          bodySize: '15',
        },
      },
    },
    isPublished: true,
    editSecret: null,
  }),
  setId: setResumeId,
  setSlug: setResumeSlug,
  setEditSecret,
  setSyncStatus,
}

vi.mock('@/stores/resume-store', () => ({
  useResumeStore: <T>(selector: (state: typeof storeState) => T) => selector(storeState),
}))

describe('useResumeSync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    setResumeId.mockClear()
    setResumeSlug.mockClear()
    setEditSecret.mockClear()
    storeState = {
      getActiveDraft: () => ({
        id: 'test-id',
        resumeTitle: 'Title',
        markdown: 'Content',
        slug: 'slug',
        resumeDisplay: {
          theme: {
            accent: 'indigo',
            typography: {
              heading: 'geologica',
              body: 'noto-sans',
              headingSize: 'md',
              bodySize: '15',
            },
          },
        },
        isPublished: true,
        editSecret: null,
      }),
      setId: setResumeId,
      setSlug: setResumeSlug,
      setEditSecret,
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
      .mockResolvedValueOnce({
        id: 'test-id',
        slug: 'slug',
        created: false,
      }) // 3rd attempt succeeds

    const { rerender } = renderHook(() => useResumeSync())

    // First render sets mounted=true.
    // We need to trigger the effect.
    // Change state to trigger re-render and effect
    storeState = {
      ...storeState,
      getActiveDraft: () => ({
        id: 'test-id',
        resumeTitle: 'Title',
        markdown: 'Updated Content',
        slug: 'slug',
        resumeDisplay: {
          theme: {
            accent: 'indigo',
            typography: {
              heading: 'geologica',
              body: 'noto-sans',
              headingSize: 'md',
              bodySize: '15',
            },
          },
        },
        isPublished: true,
        editSecret: null,
      }),
    }
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

  it('should include theme settings in payload', async () => {
    vi.mocked(publishResume).mockResolvedValue({
      id: 'test-id',
      slug: 'slug',
      created: false,
    })

    const { rerender } = renderHook(() => useResumeSync())

    storeState = {
      ...storeState,
      getActiveDraft: () => ({
        id: 'test-id',
        resumeTitle: 'Title',
        markdown: 'Updated Content',
        slug: 'slug',
        resumeDisplay: {
          theme: {
            accent: 'teal',
            typography: {
              heading: 'ibm-plex-serif',
              body: 'ibm-plex-sans',
              headingSize: 'lg',
              bodySize: '16',
            },
          },
        },
        isPublished: true,
        editSecret: null,
      }),
    }
    rerender()

    await vi.advanceTimersByTimeAsync(2500)

    expect(publishResume).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: {
          accent: 'teal',
          typography: {
            heading: 'ibm-plex-serif',
            body: 'ibm-plex-sans',
            headingSize: 'lg',
            bodySize: '16',
          },
        },
      }),
      expect.anything()
    )
  })

  it('rotates local remote identifiers when publish returns a new id', async () => {
    vi.mocked(publishResume).mockResolvedValue({
      id: 'new-id',
      slug: 'new-slug',
      editSecret: 'new-secret',
      created: true,
    })

    const { rerender } = renderHook(() => useResumeSync())

    storeState = {
      ...storeState,
      getActiveDraft: () => ({
        id: 'stale-id',
        resumeTitle: 'Title',
        markdown: 'Updated Content',
        slug: 'stale-slug',
        resumeDisplay: {
          theme: {
            accent: 'indigo',
            typography: {
              heading: 'geologica',
              body: 'noto-sans',
              headingSize: 'md',
              bodySize: '15',
            },
          },
        },
        isPublished: true,
        editSecret: 'old-secret',
      }),
    }
    rerender()

    await vi.advanceTimersByTimeAsync(2500)

    expect(setResumeId).toHaveBeenCalledWith('new-id')
    expect(setResumeSlug).toHaveBeenCalledWith('new-slug')
    expect(setEditSecret).toHaveBeenCalledWith('new-secret')
  })
})
