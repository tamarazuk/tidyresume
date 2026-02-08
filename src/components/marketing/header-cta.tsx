'use client'

import ButtonLink from '@/components/ui/button-link'
import { useResumeDraftStatus } from '@/hooks/use-resume-draft-status'

export default function HeaderCta() {
  const hasStoredDraft = useResumeDraftStatus()
  const ctaLabel = hasStoredDraft ? 'Continue Writing' : 'Start Writing'

  return (
    <ButtonLink
      href="/resumes"
      className="shadow-primary/20 h-10 px-4 shadow-lg"
    >
      {ctaLabel}
    </ButtonLink>
  )
}
