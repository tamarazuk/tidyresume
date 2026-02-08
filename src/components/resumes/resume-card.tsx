'use client'

import { useMemo } from 'react'
import { CopyIcon, FileTextIcon, TrashIcon } from '@phosphor-icons/react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatUpdatedAt } from '@/components/resumes/format-updated-at'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ResumeDraft } from '@/stores/resume-store'

interface ResumeCardProps {
  draft: ResumeDraft
  onOpen: () => void
  onDuplicate: () => void
  onDelete: () => void
}

export default function ResumeCard({
  draft,
  onOpen,
  onDuplicate,
  onDelete,
}: ResumeCardProps) {
  const updatedAtLabel = useMemo(
    () => formatUpdatedAt(draft.updatedAt),
    [draft.updatedAt]
  )
  const statusLabel = draft.isPublished ? 'Published' : 'Draft'
  const statusClassName = draft.isPublished
    ? 'bg-emerald-500/10 text-emerald-600'
    : 'bg-slate-500/10 text-slate-600'

  return (
    <Card className="border-border/60 bg-background/80 flex h-full flex-col">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="bg-primary/10 text-primary mt-0.5 inline-flex size-9 items-center justify-center rounded-lg">
            <FileTextIcon size={18} weight="bold" />
          </span>
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">
              {draft.resumeTitle || 'Untitled Resume'}
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Updated {updatedAtLabel}
            </p>
          </div>
        </div>
        <span
          className={cn(
            'rounded-full px-2.5 py-1 text-xs font-semibold',
            statusClassName
          )}
        >
          {statusLabel}
        </span>
      </CardHeader>
      <CardContent className="text-muted-foreground flex-1 text-sm">
        {draft.isPublished
          ? 'Live link published and syncing to the cloud.'
          : 'Private draft stored only in this browser.'}
      </CardContent>
      <CardFooter className="mt-auto flex flex-wrap gap-2">
        <Button onClick={onOpen} className="flex-1" aria-label="Open resume">
          Open
        </Button>
        <Button
          variant="secondary"
          onClick={onDuplicate}
          aria-label="Duplicate resume"
        >
          <CopyIcon size={16} />
        </Button>
        <Button
          variant="destructive"
          onClick={onDelete}
          aria-label="Delete resume"
        >
          <TrashIcon size={16} />
        </Button>
      </CardFooter>
    </Card>
  )
}
