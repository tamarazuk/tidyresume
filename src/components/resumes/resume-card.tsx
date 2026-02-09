'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowSquareOutIcon,
  ClockIcon,
  CopyIcon,
  FileTextIcon,
  GlobeIcon,
  PencilSimpleLineIcon,
  TagIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { LabelAssigner } from '@/components/labels/label-assigner'
import { LabelDot } from '@/components/labels/label-badge'
import { formatUpdatedAt } from '@/components/resumes/format-updated-at'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn, getResumeUrl } from '@/lib/utils'
import { useResumeStore, type ResumeDraft } from '@/stores/resume-store'

interface ResumeCardProps {
  draft: ResumeDraft
  onOpen: () => void
  onDuplicate: () => void
  onDelete: () => void
  onManageLabels?: () => void
}

export default function ResumeCard({
  draft,
  onOpen,
  onDuplicate,
  onDelete,
  onManageLabels,
}: ResumeCardProps) {
  const updatedAtLabel = useMemo(
    () => formatUpdatedAt(draft.updatedAt),
    [draft.updatedAt]
  )
  const labelsById = useResumeStore((s) => s.labelsById)
  const draftLabels = useMemo(
    () => draft.labelIds.map((id) => labelsById[id]).filter(Boolean),
    [draft.labelIds, labelsById]
  )

  return (
    <div className="border-border/60 bg-card group relative overflow-hidden rounded-xl border shadow-xs transition-all hover:shadow-md">
      {/* Colored status bar */}
      <div
        className={cn(
          'h-1',
          draft.isPublished
            ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
            : 'bg-gradient-to-r from-slate-300 to-slate-200 dark:from-slate-600 dark:to-slate-700'
        )}
      />

      <div className="p-4">
        {/* Top row: icon + status badge */}
        <div className="mb-3 flex items-start justify-between">
          <span
            className={cn(
              'flex size-9 items-center justify-center rounded-lg',
              draft.isPublished
                ? 'bg-emerald-500/10 text-emerald-600'
                : 'bg-muted text-muted-foreground'
            )}
          >
            <FileTextIcon size={18} weight="bold" />
          </span>

          <span
            className={cn(
              'flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold',
              draft.isPublished
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {draft.isPublished ? (
              <>
                <GlobeIcon size={10} weight="bold" />
                Live
              </>
            ) : (
              <>
                <PencilSimpleLineIcon size={10} weight="bold" />
                Local Draft
              </>
            )}
          </span>
        </div>

        {/* Title */}
        <button
          type="button"
          className="text-foreground mb-1 w-full cursor-pointer truncate text-left text-sm font-semibold"
          onClick={onOpen}
        >
          {draft.resumeTitle || 'Untitled Resume'}
        </button>

        {/* Timestamp */}
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          <ClockIcon size={11} />
          {updatedAtLabel}
        </div>

        {/* Slug */}
        {draft.slug ? (
          <p className="text-muted-foreground mt-1 truncate font-mono text-[11px]">
            /{draft.slug}
          </p>
        ) : null}

        {/* Labels */}
        {draftLabels.length > 0 ? (
          <div
            className="mt-3 flex items-center gap-1.5"
            title={draftLabels.map((l) => l.name).join(', ')}
          >
            {draftLabels.slice(0, 5).map((label) => (
              <LabelDot key={label.id} color={label.color} />
            ))}
            {draftLabels.length > 5 ? (
              <span className="text-muted-foreground text-[10px] font-medium">
                +{draftLabels.length - 5}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Action row */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex translate-y-2 items-center justify-center gap-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        {/* Gradient backdrop for contrast */}
        <div className="from-background/90 via-background/50 pointer-events-none absolute inset-0 bg-gradient-to-t to-transparent" />

        <LabelAssigner draftId={draft.draftId} onManageLabels={onManageLabels}>
          <Button
            variant="outline"
            size="icon"
            aria-label="Assign labels"
            className="border-border/50 bg-background hover:bg-background hover:text-primary relative size-10 rounded-full shadow-md transition-transform hover:scale-110"
          >
            <TagIcon size={18} />
          </Button>
        </LabelAssigner>
        <Button
          variant="outline"
          size="icon"
          onClick={onDuplicate}
          aria-label="Duplicate resume"
          className="border-border/50 bg-background hover:bg-background hover:text-primary relative size-10 rounded-full shadow-md transition-transform hover:scale-110"
        >
          <CopyIcon size={18} />
        </Button>
        {draft.id ? (
          <Link
            href={getResumeUrl(draft.id, draft.slug)}
            target="_blank"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'icon' }),
              'border-border/50 bg-background hover:bg-background hover:text-primary relative size-10 rounded-full shadow-md transition-transform hover:scale-110'
            )}
            aria-label="Public link"
          >
            <ArrowSquareOutIcon size={18} />
          </Link>
        ) : null}
        <Button
          variant="outline"
          size="icon"
          onClick={onDelete}
          aria-label="Delete resume"
          className="text-destructive hover:text-destructive border-border/50 bg-background hover:bg-background relative size-10 rounded-full shadow-md transition-transform hover:scale-110"
        >
          <TrashIcon size={18} />
        </Button>
      </div>
    </div>
  )
}
