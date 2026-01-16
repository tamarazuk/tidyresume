'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useResumeStore } from '@/stores/resume-store'
import { useMounted } from '@/hooks/use-mounted'

export function useRemoteStatus() {
  const id = useResumeStore((state) => state.id)
  const isPublished = useResumeStore((state) => state.isPublished)
  const unpublish = useResumeStore((state) => state.unpublish)
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
        // Resume was deleted/unpublished from another device
        unpublish()
      }
    } catch (error) {
      console.error('Failed to check remote status:', error)
    }
  }, [id, isPublished, unpublish])

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
  }, [id, isPublished, isMounted, checkStatus])

  return { checkStatus }
}
