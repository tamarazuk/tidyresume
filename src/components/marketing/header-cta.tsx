'use client'

import { useSyncExternalStore } from 'react'
import ButtonLink from '@/components/ui/button-link'

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
  return Boolean(localStorage.getItem(RESUME_STORAGE_KEY))
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
