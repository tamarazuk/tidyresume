'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useResumeStore, type ResumeDraftId } from '@/stores/resume-store'
import { useMounted } from '@/hooks/use-mounted'

export function useRemoteStatus(draftId?: ResumeDraftId) {
  const draft = useResumeStore((state) => {
    if (draftId && state.draftsById[draftId]) {
      return state.draftsById[draftId]
    }
    return state.getActiveDraft()
  })
  const id = draft.id
  const isPublished = draft.isPublished
  const targetDraftId = draftId ?? draft.draftId
  const updateDraft = useResumeStore((state) => state.updateDraft)
  const isMounted = useMounted()
  const lastCheckedId = useRef<string | null>(null)

  const checkStatus = useCallback(async () => {
    if (!id || !isPublished) return

    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: 'GET',
        // Cache: 'no-store' to ensure we get fresh status
        cache: 'no-store',
      })

      if (response.status === 404) {
        // Never auto-unpublish from passive checks.
        // Mark the draft as needing user attention instead.
        updateDraft(targetDraftId, { syncStatus: 'error' })
        return
      }
    } catch (error) {
      console.error('Failed to check remote status:', error)
    }
  }, [id, isPublished, targetDraftId, updateDraft])

  useEffect(() => {
    if (!isMounted) return
    if (!id || !isPublished) {
      lastCheckedId.current = null
      return
    }

    // Check on initial mount or when ID changes
    if (lastCheckedId.current !== id) {
      lastCheckedId.current = id
      checkStatus()
    }

    // Check on window focus
    const handleFocus = () => {
      checkStatus()
    }
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkStatus()
      }
    }

    window.addEventListener('focus', handleFocus)
    // Also check on visibility change (more robust for some browsers)
    window.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [id, isPublished, isMounted, checkStatus])

  return { checkStatus }
}
