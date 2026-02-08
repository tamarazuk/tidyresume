'use client'

import { useSyncExternalStore } from 'react'
import { DEFAULT_RESUME } from '@/components/editor/constants'
import { DEFAULT_RESUME_TITLE } from '@/lib/constants'

const RESUME_STORAGE_KEY = 'tidyresume-editor'

function subscribeToResumeDraft(callback: () => void) {
  if (typeof window === 'undefined') return () => {}
  const handleStorage = (event: StorageEvent) => {
    if (event.key === RESUME_STORAGE_KEY) {
      callback()
    }
  }
  window.addEventListener('storage', handleStorage)
  return () => window.removeEventListener('storage', handleStorage)
}

function getResumeDraftSnapshot() {
  if (typeof window === 'undefined') return false
  const stored = localStorage.getItem(RESUME_STORAGE_KEY)
  if (!stored) return false

  try {
    const parsed = JSON.parse(stored) as {
      state?: {
        draftsById?: Record<
          string,
          {
            id?: string | null
            markdown?: string | null
            resumeTitle?: string | null
          }
        >
        id?: string | null
        markdown?: string | null
        resumeTitle?: string | null
      }
      draftsById?: Record<
        string,
        {
          id?: string | null
          markdown?: string | null
          resumeTitle?: string | null
        }
      >
      id?: string | null
      markdown?: string | null
      resumeTitle?: string | null
    }
    const state = parsed.state ?? parsed
    const drafts = state.draftsById
      ? Object.values(state.draftsById)
      : [
          {
            id: state.id,
            markdown: state.markdown,
            resumeTitle: state.resumeTitle,
          },
        ]

    return drafts.some((draft) => {
      const hasTitle =
        typeof draft.resumeTitle === 'string' &&
        draft.resumeTitle.trim().length > 0 &&
        draft.resumeTitle !== DEFAULT_RESUME_TITLE
      const storedMarkdown =
        typeof draft.markdown === 'string' ? draft.markdown.trim() : ''
      const hasMarkdown =
        storedMarkdown.length > 0 && storedMarkdown !== DEFAULT_RESUME.trim()
      return Boolean(draft.id || hasTitle || hasMarkdown)
    })
  } catch {
    return false
  }
}

export const useResumeDraftStatus = () => {
  return useSyncExternalStore(
    subscribeToResumeDraft,
    getResumeDraftSnapshot,
    () => false
  )
}
