'use client'

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
import { LabelBadge } from '@/components/labels/label-badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn, getResumeUrl } from '@/lib/utils'
import { useResumeStore, type ResumeDraft } from '@/stores/resume-store'
import { formatUpdatedAt } from './format-updated-at'

interface ShelfRowProps {
  draft: ResumeDraft
  onOpen: () => void
  onDuplicate: () => void
  onDelete: () => void
}

export default function ShelfRow({
  draft,
  onOpen,
  onDuplicate,
  onDelete,
}: ShelfRowProps) {
  const labelsById = useResumeStore((s) => s.labelsById)
  const draftLabels = draft.labelIds.map((id) => labelsById[id]).filter(Boolean)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen()
        }
      }}
      className="border-border/60 bg-card group relative flex cursor-pointer items-center gap-4 rounded-xl border p-3 shadow-xs transition-all hover:shadow-md"
    >
      {/* Icon Box */}
      <div
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-lg',
          draft.isPublished
            ? 'bg-emerald-500/10 text-emerald-600'
            : 'bg-muted text-muted-foreground'
        )}
      >
        <FileTextIcon size={20} weight="bold" />
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-foreground truncate text-sm font-semibold">
            {draft.resumeTitle || 'Untitled Resume'}
          </span>

          {/* Status Badge */}
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
              draft.isPublished
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {draft.isPublished ? (
              <>
                <GlobeIcon size={10} weight="bold" />
                Published
              </>
            ) : (
              <>
                <PencilSimpleLineIcon size={10} weight="bold" />
                Local Draft
              </>
            )}
          </span>
        </div>

        <div className="text-muted-foreground flex items-center gap-3 text-xs">
          {draft.slug ? (
            <span className="font-mono text-[10px]">/{draft.slug}</span>
          ) : null}
          <span className="flex items-center gap-1">
            <ClockIcon size={11} />
            {formatUpdatedAt(draft.updatedAt)}
          </span>
        </div>
      </div>

      {/* Labels - Full Badges */}
      {draftLabels.length > 0 ? (
        <div className="hidden items-center gap-1.5 md:flex">
          {draftLabels.map((label) => (
            <LabelBadge key={label.id} name={label.name} color={label.color} />
          ))}
        </div>
      ) : null}

      {/* Actions Overlay */}
      <div
        className="absolute inset-y-0 right-0 z-10 flex items-center gap-2 p-2 pr-4 opacity-0 transition-all duration-300 group-hover:opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient backdrop */}
        <div className="from-background via-background/80 pointer-events-none absolute inset-0 bg-gradient-to-l to-transparent" />

        <LabelAssigner draftId={draft.draftId}>
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
          aria-label="Duplicate resume"
          onClick={onDuplicate}
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
          aria-label="Delete resume"
          className="text-destructive hover:text-destructive border-border/50 bg-background hover:bg-background relative size-10 rounded-full shadow-md transition-transform hover:scale-110"
          onClick={onDelete}
        >
          <TrashIcon size={18} />
        </Button>
      </div>
    </div>
  )
}
