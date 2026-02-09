'use client'

import { useResumeDraftStatus } from '@/hooks/use-resume-draft-status'
import { useNavigationLoading } from '@/providers/navigation-loading-provider'

export default function HeaderCta() {
  const hasStoredDraft = useResumeDraftStatus()
  const { navigateTo } = useNavigationLoading()
  const ctaLabel = hasStoredDraft ? 'Continue Writing' : 'Start Writing'

  return (
    <button
      type="button"
      onClick={() => navigateTo('/resumes')}
      className="bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 inline-flex h-10 cursor-pointer items-center justify-center rounded-md px-4 text-sm font-medium shadow-lg transition-colors"
    >
      {ctaLabel}
    </button>
  )
}
