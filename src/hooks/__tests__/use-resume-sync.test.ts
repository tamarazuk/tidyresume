import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useResumeSync } from '../use-resume-sync'
import { publishResume } from '@/lib/resume-api'

// Mock dependencies
vi.mock('@/lib/resume-api', () => ({
  publishResume: vi.fn(),
  isResumeApiError: vi.fn((err) => 'status' in err),
}))

const setDraftSyncStatus = vi.fn()
const updateDraft = vi.fn()
let storeState = {
  getActiveDraft: () => ({
    draftId: 'draft-1',
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
    editSecret: null as string | null,
  }),
  updateDraft,
  setDraftSyncStatus,
}

vi.mock('@/stores/resume-store', () => ({
  useResumeStore: <T>(selector: (state: typeof storeState) => T) =>
    selector(storeState),
}))

describe('useResumeSync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    storeState = {
      getActiveDraft: () => ({
        draftId: 'draft-1',
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
      updateDraft,
      setDraftSyncStatus,
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
        draftId: 'draft-1',
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

    // Should be synced now - now uses setDraftSyncStatus with draftId
    expect(setDraftSyncStatus).toHaveBeenLastCalledWith('draft-1', 'synced')
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
        draftId: 'draft-1',
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
        draftId: 'draft-1',
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

    // Now uses updateDraft with draftId to update specific draft
    expect(updateDraft).toHaveBeenCalledWith('draft-1', { id: 'new-id' })
    expect(updateDraft).toHaveBeenCalledWith('draft-1', { slug: 'new-slug' })
    expect(updateDraft).toHaveBeenCalledWith('draft-1', {
      editSecret: 'new-secret',
    })
  })
})
