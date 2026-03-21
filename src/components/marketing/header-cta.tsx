'use client'

import Link from 'next/link'
import { useResumeDraftStatus } from '@/hooks/use-resume-draft-status'
import { useNavigationLoading } from '@/providers/navigation-loading-provider'
import type { MouseEvent } from 'react'

export default function HeaderCta() {
  const hasStoredDraft = useResumeDraftStatus()
  const { navigateTo } = useNavigationLoading()
  const ctaLabel = hasStoredDraft ? 'Continue Writing' : 'Start Writing'
  const href = '/resumes'

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const isPlainLeftClick =
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.shiftKey

    if (!isPlainLeftClick) return

    event.preventDefault()
    navigateTo(href)
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 inline-flex h-10 cursor-pointer items-center justify-center rounded-md px-4 text-sm font-medium shadow-lg transition-colors"
    >
      {ctaLabel}
    </Link>
  )
}
