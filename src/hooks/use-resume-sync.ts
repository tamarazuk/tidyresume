import { useEffect, useRef } from 'react'
import { publishResume, type PublishResumePayload } from '@/lib/resume-api'
import { useResumeStore } from '@/stores/resume-store'

const CLOUD_SYNC_DEBOUNCE_MS = 2500

export function useResumeSync() {
  const id = useResumeStore((state) => state.id)
  const title = useResumeStore((state) => state.resumeTitle)
  const content = useResumeStore((state) => state.markdown)
  const slug = useResumeStore((state) => state.slug)
  const setSyncStatus = useResumeStore((state) => state.setSyncStatus)

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

    // Only sync if we have an ID (already published)
    if (!id) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      return
    }

    const payload: PublishResumePayload = {
      id,
      title,
      content,
    }

    if (slug !== null) {
      payload.slug = slug
    }

    const payloadKey = JSON.stringify(payload)
    if (payloadKey === lastSyncedKeyRef.current) {
      return
    }

    pendingRef.current = { key: payloadKey, payload }
    setSyncStatus('syncing')

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(async () => {
      const pending = pendingRef.current
      if (!pending || pending.key === lastSyncedKeyRef.current) {
        return
      }

      abortControllerRef.current?.abort()
      const controller = new AbortController()
      abortControllerRef.current = controller

      try {
        await publishResume(pending.payload, { signal: controller.signal })

        lastSyncedKeyRef.current = pending.key
        setSyncStatus('synced')
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return
        }
        console.error('Auto-sync error:', error)
        setSyncStatus('error')
      }
    }, CLOUD_SYNC_DEBOUNCE_MS)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [id, title, content, slug, setSyncStatus])
}
