import { useEffect, useRef } from 'react'
import { updateResumeTheme } from '@/lib/resume-api'
import { useResumeStore, type ResumeDraftId } from '@/stores/resume-store'
import type { ResumeThemeSettings } from '@/types/resume'

const PUBLIC_THEME_SYNC_DEBOUNCE_MS = 2500

interface UsePublicResumeThemeSyncOptions {
  id: string
  isOwner: boolean
  draftId?: ResumeDraftId
  serverTheme?: ResumeThemeSettings | null
}

export function usePublicResumeThemeSync({
  id,
  isOwner,
  draftId,
  serverTheme,
}: UsePublicResumeThemeSyncOptions) {
  const resumeTheme = useResumeStore((state) =>
    draftId ? state.draftsById[draftId]?.resumeDisplay.theme : undefined
  )
  const editSecret = useResumeStore((state) =>
    draftId ? state.draftsById[draftId]?.editSecret ?? null : null
  )
  const setDraftSyncStatus = useResumeStore((state) => state.setDraftSyncStatus)

  const mountedRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSyncedKeyRef = useRef<string | null>(null)

  useEffect(() => {
    if (!isOwner || !draftId || !resumeTheme) return

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

    setDraftSyncStatus(draftId, 'syncing')
    timeoutRef.current = setTimeout(async () => {
      try {
        await updateResumeTheme(id, resumeTheme, {
          editSecret: editSecret ?? undefined,
        })
        lastSyncedKeyRef.current = nextKey
        setDraftSyncStatus(draftId, 'synced')
      } catch (error) {
        console.error('Public theme sync error:', error)
        setDraftSyncStatus(draftId, 'error')
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
    draftId,
    resumeTheme,
    serverTheme,
    setDraftSyncStatus,
  ])
}
