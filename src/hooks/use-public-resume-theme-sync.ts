import { useEffect, useRef } from 'react'
import { updateResumeTheme, isResumeApiError } from '@/lib/resume-api'
import { useResumeStore } from '@/stores/resume-store'
import type { ResumeThemeSettings } from '@/types/resume'

const PUBLIC_THEME_SYNC_DEBOUNCE_MS = 2500

interface UsePublicResumeThemeSyncOptions {
  id: string
  isOwner: boolean
  serverTheme?: ResumeThemeSettings | null
}

export function usePublicResumeThemeSync({
  id,
  isOwner,
  serverTheme,
}: UsePublicResumeThemeSyncOptions) {
  const resumeTheme = useResumeStore((state) => state.resumeDisplay.theme)
  const editSecret = useResumeStore((state) => state.editSecret)
  const setSyncStatus = useResumeStore((state) => state.setSyncStatus)

  const mountedRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSyncedKeyRef = useRef<string | null>(null)

  useEffect(() => {
    if (!isOwner) return

    if (!mountedRef.current) {
      mountedRef.current = true
      const serverKey = JSON.stringify(serverTheme ?? null)
      const nextKey = JSON.stringify(resumeTheme ?? null)
      lastSyncedKeyRef.current = serverKey
      if (nextKey === serverKey) {
        return
      }
    }

    const nextKey = JSON.stringify(resumeTheme ?? null)
    if (nextKey === lastSyncedKeyRef.current) return

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setSyncStatus('syncing')
    timeoutRef.current = setTimeout(async () => {
      try {
        await updateResumeTheme(id, resumeTheme, {
          editSecret: editSecret ?? undefined,
        })
        lastSyncedKeyRef.current = nextKey
        setSyncStatus('synced')
      } catch (error) {
        if (isResumeApiError(error) && error.status === 404) {
          useResumeStore.getState().unpublish()
          return
        }
        console.error('Public theme sync error:', error)
        setSyncStatus('error')
      }
    }, PUBLIC_THEME_SYNC_DEBOUNCE_MS)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [
    editSecret,
    id,
    isOwner,
    resumeTheme,
    serverTheme,
    setSyncStatus,
  ])
}
