import { act, cleanup, renderHook } from '@testing-library/react'
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { useRemoteStatus } from '@/hooks/use-remote-status'
import { useResumeStore } from '@/stores/resume-store'

vi.mock('@/hooks/use-mounted', () => ({
  useMounted: () => true,
}))

describe('useRemoteStatus', () => {
  beforeEach(() => {
    useResumeStore.persist?.clearStorage?.()
    useResumeStore.getState().resetResume()
    const state = useResumeStore.getState()
    const draftIdsToDelete = state.draftOrder.filter(
      (draftId) => draftId !== state.activeDraftId
    )
    draftIdsToDelete.forEach((draftId) => {
      state.deleteDraft(draftId)
    })
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('marks sync status as error on passive 404 without unpublishing', async () => {
    const state = useResumeStore.getState()
    const draft = state.getActiveDraft()
    state.updateDraft(draft.draftId, {
      id: 'resume-123',
      isPublished: true,
      editSecret: 'secret-123',
      syncStatus: 'synced',
    })

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        status: 404,
      })
    )

    const { result } = renderHook(() => useRemoteStatus())

    await act(async () => {
      await result.current.checkStatus()
    })

    const updatedDraft = useResumeStore.getState().draftsById[draft.draftId]
    expect(updatedDraft.syncStatus).toBe('error')
    expect(updatedDraft.isPublished).toBe(true)
    expect(updatedDraft.id).toBe('resume-123')
    expect(updatedDraft.editSecret).toBe('secret-123')
  })

  it('applies passive status updates only to the targeted draft', async () => {
    const state = useResumeStore.getState()
    const firstDraftId = state.getActiveDraft().draftId
    state.updateDraft(firstDraftId, {
      id: 'resume-123',
      isPublished: true,
      editSecret: 'secret-123',
      syncStatus: 'synced',
    })

    const secondDraftId = state.createDraft()
    expect(secondDraftId).not.toBe(firstDraftId)
    state.updateDraft(secondDraftId, {
      id: 'resume-999',
      isPublished: true,
      editSecret: 'secret-999',
      syncStatus: 'synced',
    })

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        status: 404,
      })
    )

    const { result } = renderHook(() => useRemoteStatus(firstDraftId))

    await act(async () => {
      await result.current.checkStatus()
    })

    const nextState = useResumeStore.getState()
    expect(nextState.draftsById[firstDraftId]?.syncStatus).toBe('error')
    expect(nextState.draftsById[firstDraftId]?.isPublished).toBe(true)
    expect(nextState.draftsById[secondDraftId]?.syncStatus).toBe('synced')
    expect(nextState.draftsById[secondDraftId]?.id).toBe('resume-999')
  })
})
