'use client'

import { PencilSimpleIcon } from '@phosphor-icons/react'

import { Input } from '@/components/ui/input'
import { RESUME_TITLE_MAX_LENGTH } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useEditableResumeTitle } from '@/hooks/use-editable-resume-title'
import { usePublicViewStore } from '@/stores/public-view-store'

interface EditableResumeTitleProps {
  id: string
  title: string
  content: string
  className?: string
}

export function EditableResumeTitle({
  id,
  title,
  content,
  className,
}: EditableResumeTitleProps) {
  const {
    isOwner,
    currentTitle,
    draftTitle,
    setDraftTitle,
    isEditing,
    isSaving,
    inputRef,
    startEditing,
    handleBlur,
    handleKeyDown,
  } = useEditableResumeTitle({ id, title, content })
  const isPreviewMode = usePublicViewStore(
    (state) => state.publicViewState.isPreviewMode
  )

  const baseClassName =
    'text-center text-lg font-semibold tracking-[-0.015em] text-foreground break-words sm:text-xl md:text-xl'
  const titleWidthClassName = 'min-w-72 w-[min(90vw,40rem)]'

  if (!isOwner || isPreviewMode) {
    return (
      <div
        className={cn(baseClassName, titleWidthClassName, 'mx-auto', className)}
        aria-label={`Resume title: ${currentTitle}`}
      >
        {currentTitle}
      </div>
    )
  }

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={draftTitle}
        onChange={(event) => setDraftTitle(event.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        maxLength={RESUME_TITLE_MAX_LENGTH}
        aria-label="Resume title"
        disabled={isSaving}
        className={cn(
          'focus-visible:border-border/70 focus-visible:bg-muted/30 focus-visible:ring-primary/25 h-auto border-transparent bg-transparent px-1 py-0 shadow-none',
          baseClassName,
          titleWidthClassName,
          'mx-auto',
          className
        )}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={startEditing}
      className={cn(
        'cursor-text',
        baseClassName,
        titleWidthClassName,
        'mx-auto',
        className
      )}
      aria-label="Edit resume title"
    >
      <span className="inline-flex min-w-0 flex-wrap items-center justify-center gap-2">
        <span className="min-w-0 wrap-break-word">{currentTitle}</span>
        <PencilSimpleIcon
          size={14}
          className="text-muted-foreground/70"
          aria-hidden
        />
      </span>
    </button>
  )
}
