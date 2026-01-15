'use client'

import { useSyncExternalStore } from 'react'
import ButtonLink from '@/components/ui/button-link'

const RESUME_STORAGE_KEY = 'tidyresume-editor'
const DEFAULT_RESUME_TITLE = 'Untitled Resume'

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
      }
      id?: string | null
      markdown?: string | null
      resumeTitle?: string | null
    }
    const state = parsed.state ?? parsed
    const hasTitle =
      typeof state.resumeTitle === 'string' &&
      state.resumeTitle.trim().length > 0 &&
      state.resumeTitle !== DEFAULT_RESUME_TITLE
    const hasMarkdown =
      typeof state.markdown === 'string' && state.markdown.trim().length > 0

    return Boolean(state.id || hasTitle || hasMarkdown)
  } catch {
    return false
  }
}

export default function HeaderCta() {
  const hasStoredDraft = useSyncExternalStore(
    subscribeToResumeDraft,
    getResumeDraftSnapshot,
    () => false
  )
  const ctaLabel = hasStoredDraft ? 'Continue Writing' : 'Start Writing'

  return (
    <ButtonLink href="/edit" className="shadow-primary/20 h-10 px-4 shadow-lg">
      {ctaLabel}
    </ButtonLink>
  )
}
