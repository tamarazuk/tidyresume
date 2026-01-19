'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useResumeStore } from '@/stores/resume-store'
import { useMounted } from '@/hooks/use-mounted'

interface UseRemoteStatusOptions {
  resumeId?: string | null
  enabled?: boolean
}

export function useRemoteStatus(options: UseRemoteStatusOptions = {}) {
  const { resumeId, enabled = true } = options
  const activeId = useResumeStore((state) => state.id)
  const activeIsPublished = useResumeStore((state) => state.isPublished)
  const isPublished = useResumeStore((state) => {
    if (!resumeId) return activeIsPublished
    return (
      state.resumes.find((resume) => resume.id === resumeId)
        ?.isPublished ?? false
    )
  })
  const unpublish = useResumeStore((state) => state.unpublish)
  const unpublishById = useResumeStore((state) => state.unpublishById)
  const isMounted = useMounted()
  const lastCheckedId = useRef<string | null>(null)
  const targetId = resumeId ?? activeId
  const isEnabled = enabled

  const checkStatus = useCallback(async () => {
    if (!isEnabled || !targetId || !isPublished) return

    try {
      const response = await fetch(`/api/resumes/${targetId}`, {
        method: 'GET',
        // Cache: 'no-store' to ensure we get fresh status
        cache: 'no-store',
      })

      if (response.status === 404) {
        // Resume was deleted/unpublished from another device
        if (resumeId) {
          unpublishById(targetId)
        } else {
          unpublish()
        }
      }
    } catch (error) {
      console.error('Failed to check remote status:', error)
    }
  }, [
    isEnabled,
    targetId,
    isPublished,
    resumeId,
    unpublish,
    unpublishById,
  ])

  useEffect(() => {
    if (!isMounted || !isEnabled) return
    if (!targetId || !isPublished) {
      lastCheckedId.current = null
      return
    }

    // Check on initial mount or when ID changes
    if (lastCheckedId.current !== targetId) {
      lastCheckedId.current = targetId
      checkStatus()
    }

    // Check on window focus
    const handleFocus = () => {
      checkStatus()
    }

    window.addEventListener('focus', handleFocus)
    // Also check on visibility change (more robust for some browsers)
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkStatus()
      }
    })

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('visibilitychange', handleFocus)
    }
  }, [targetId, isPublished, isMounted, isEnabled, checkStatus])

  return { checkStatus }
}
