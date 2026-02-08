'use client'

import {
  ArrowRightIcon,
  PencilSimpleIcon,
} from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useResumeDraftStatus } from '@/hooks/use-resume-draft-status'

export function StartButton() {
  const hasStoredDraft = useResumeDraftStatus()

  if (hasStoredDraft) {
    return (
      <Link
        href="/resumes"
        className={cn(buttonVariants({ size: 'lg' }), 'gap-2 px-8')}
      >
        <PencilSimpleIcon size={20} />
        Continue Editing
      </Link>
    )
  }

  return (
    <Link
      href="/resumes"
      className={cn(buttonVariants({ size: 'lg' }), 'gap-2 px-8')}
    >
      Start Writing Now
      <ArrowRightIcon size={20} />
    </Link>
  )
}
