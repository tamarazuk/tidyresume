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
        id?: string | null
        markdown?: string | null
        resumeTitle?: string | null
        resumes?: Array<{
          id?: string | null
          markdown?: string | null
          resumeTitle?: string | null
        }>
      }
      id?: string | null
      markdown?: string | null
      resumeTitle?: string | null
      resumes?: Array<{
        id?: string | null
        markdown?: string | null
        resumeTitle?: string | null
      }>
    }
    const state = parsed.state ?? parsed

    const hasDraftData = (entry?: {
      id?: string | null
      markdown?: string | null
      resumeTitle?: string | null
    }) => {
      if (!entry) return false
      const hasTitle =
        typeof entry.resumeTitle === 'string' &&
        entry.resumeTitle.trim().length > 0 &&
        entry.resumeTitle !== DEFAULT_RESUME_TITLE
      const storedMarkdown =
        typeof entry.markdown === 'string' ? entry.markdown.trim() : ''
      const hasMarkdown =
        storedMarkdown.length > 0 && storedMarkdown !== DEFAULT_RESUME.trim()
      return Boolean(entry.id || hasTitle || hasMarkdown)
    }

    if (Array.isArray(state.resumes) && state.resumes.length > 0) {
      return state.resumes.some(hasDraftData)
    }

    return hasDraftData(state)
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
