import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useOwnerCheck } from '@/hooks/use-owner-check'
import { useResumeStore } from '@/stores/resume-store'

describe('useOwnerCheck', () => {
  beforeEach(() => {
    useResumeStore.persist?.clearStorage?.()
    useResumeStore.getState().resetResume()
  })

  it('returns owner for matching published draft with edit secret', () => {
    const state = useResumeStore.getState()
    const draft = state.getActiveDraft()
    state.updateDraft(draft.draftId, {
      id: 'resume-123',
      isPublished: true,
      editSecret: 'secret-123',
    })

    const { result } = renderHook(() => useOwnerCheck('resume-123'))

    expect(result.current.isOwner).toBe(true)
    expect(result.current.draftId).toBe(draft.draftId)
  })

  it('returns visitor when matching draft is missing edit secret', () => {
    const state = useResumeStore.getState()
    const draft = state.getActiveDraft()
    state.updateDraft(draft.draftId, {
      id: 'resume-123',
      isPublished: true,
      editSecret: null,
    })

    const { result } = renderHook(() => useOwnerCheck('resume-123'))

    expect(result.current.isOwner).toBe(false)
    expect(result.current.draftId).toBeUndefined()
  })

  it('prefers the best matching draft when duplicates exist', () => {
    const state = useResumeStore.getState()
    const olderDraft = state.getActiveDraft()
    state.updateDraft(olderDraft.draftId, {
      id: 'resume-123',
      isPublished: true,
      editSecret: null,
      updatedAt: Date.now() - 1_000,
    })

    const preferredDraftId = state.createDraft()
    state.updateDraft(preferredDraftId, {
      id: 'resume-123',
      isPublished: true,
      editSecret: 'secret-123',
      updatedAt: Date.now(),
    })

    const { result } = renderHook(() => useOwnerCheck('resume-123'))

    expect(result.current.isOwner).toBe(true)
    expect(result.current.draftId).toBe(preferredDraftId)
  })
})
