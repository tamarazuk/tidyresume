import { useEffect, useRef, useState } from 'react'
import {
  publishResume,
  type PublishResumePayload,
} from '@/lib/resume-api'
import { useResumeStore } from '@/stores/resume-store'

const CLOUD_SYNC_DEBOUNCE_MS = 2500

export function useResumeSync() {
  const draft = useResumeStore((state) => state.getActiveDraft())
  const id = draft.id
  const title = draft.resumeTitle
  const content = draft.markdown
  const slug = draft.slug
  const theme = draft.resumeDisplay.theme
  const isPublished = draft.isPublished
  const editSecret = draft.editSecret
  const setResumeId = useResumeStore((state) => state.setId)
  const setResumeSlug = useResumeStore((state) => state.setSlug)
  const setEditSecret = useResumeStore((state) => state.setEditSecret)
  const setSyncStatus = useResumeStore((state) => state.setSyncStatus)
  const [retryTrigger, setRetryTrigger] = useState(0)

  const mounted = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pendingRef = useRef<{
    key: string
    payload: PublishResumePayload
  } | null>(null)
  const lastSyncedKeyRef = useRef<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    // Skip first render/hydration
    if (!mounted.current) {
      mounted.current = true
      return
    }

    // Only sync if we have an ID AND it is currently published
    if (!id || !isPublished) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      return
    }

    const payload: PublishResumePayload = {
      id,
      title,
      content,
      theme,
    }

    if (slug !== null) {
      payload.slug = slug
    }

    const payloadKey = JSON.stringify(payload)
    // If retry triggered, ignore the key check to force retry
    if (payloadKey === lastSyncedKeyRef.current && retryTrigger === 0) {
      return
    }

    pendingRef.current = { key: payloadKey, payload }
    setSyncStatus('syncing')

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(async () => {
      const pending = pendingRef.current
      if (!pending) {
        return
      }

      // If NOT a manual retry (retryTrigger > 0), check if we already synced this key
      if (retryTrigger === 0 && pending.key === lastSyncedKeyRef.current) {
        return
      }

      abortControllerRef.current?.abort()
      const controller = new AbortController()
      abortControllerRef.current = controller

      const maxRetries = 3
      let attempt = 0
      let success = false

      while (attempt < maxRetries && !success) {
        if (controller.signal.aborted) return

        try {
          const response = await publishResume(pending.payload, {
            signal: controller.signal,
            editSecret: editSecret ?? undefined,
          })
          if (response.id !== id) {
            setResumeId(response.id)
          }
          if (response.slug !== slug) {
            setResumeSlug(response.slug ?? null)
          }
          if (response.editSecret) {
            setEditSecret(response.editSecret)
          }

          const syncedPayload: PublishResumePayload = {
            ...pending.payload,
            id: response.id,
          }
          if (response.slug !== null) {
            syncedPayload.slug = response.slug
          } else {
            delete syncedPayload.slug
          }
          pendingRef.current = {
            key: JSON.stringify(syncedPayload),
            payload: syncedPayload,
          }
          success = true
        } catch (error) {
          if ((error as Error).name === 'AbortError') return

          attempt++
          if (attempt >= maxRetries) {
            console.error('Auto-sync error:', error)
            setSyncStatus('error')
            return
          }

          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, attempt - 1) * 1000
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }

      if (success) {
        lastSyncedKeyRef.current = pending.key
        setSyncStatus('synced')
      }
    }, CLOUD_SYNC_DEBOUNCE_MS)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [
    id,
    title,
    content,
    slug,
    theme,
    isPublished,
    editSecret,
    setEditSecret,
    setResumeId,
    setResumeSlug,
    setSyncStatus,
    retryTrigger,
  ])

  return { retry: () => setRetryTrigger((prev) => prev + 1) }
}
