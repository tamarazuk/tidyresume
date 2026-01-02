'use client'

import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useResumeHydrated, useResumeStore } from '@/stores/resume-store'

export default function ResumeTitleInput() {
  const isHydrated = useResumeHydrated()
  const resumeTitleValue = useResumeStore((state) => state.resumeTitle)
  const setResumeTitleValue = useResumeStore((state) => state.setResumeTitle)

  if (!isHydrated) {
    return <Skeleton aria-hidden className="-ml-2 h-7.5 w-40 rounded-full" />
  }

  return (
    <Input
      value={resumeTitleValue}
      onChange={(event) => setResumeTitleValue(event.target.value)}
      onFocus={(event) => event.currentTarget.select()}
      aria-label="Resume title"
      className="text-muted-foreground placeholder:text-muted-foreground/70 focus-visible:border-border/70 focus-visible:bg-muted/20 focus-visible:ring-primary/25 -ml-2 h-auto w-56 border-transparent bg-transparent px-2 py-1 text-xs font-medium shadow-none transition focus-visible:ring-2 dark:bg-transparent"
    />
  )
}
