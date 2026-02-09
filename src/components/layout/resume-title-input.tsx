'use client'

import { useEffect, useRef, useState } from 'react'
import { PencilSimpleIcon } from '@phosphor-icons/react'

import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useResumeHydrated, useResumeStore } from '@/stores/resume-store'
import { RESUME_TITLE_MAX_LENGTH, FOCUS_TITLE_EVENT } from '@/lib/constants'

export default function ResumeTitleInput() {
  const isHydrated = useResumeHydrated()
  const resumeTitleValue = useResumeStore(
    (state) => state.getActiveDraft().resumeTitle
  )
  const setResumeTitleValue = useResumeStore((state) => state.setResumeTitle)
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const baseTitleClassName =
    'text-muted-foreground text-base font-medium leading-tight text-left'
  const titleInputWidthClassName = 'min-w-56 w-[min(70vw,32rem)]'
  const titleDisplayMaxWidthClassName = 'max-w-[min(70vw,32rem)]'

  useEffect(() => {
    const handleFocus = () => setIsEditing(true)
    window.addEventListener(FOCUS_TITLE_EVENT, handleFocus)
    return () => window.removeEventListener(FOCUS_TITLE_EVENT, handleFocus)
  }, [])

  useEffect(() => {
    if (!isEditing) return
    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    })
    return () => cancelAnimationFrame(frame)
  }, [isEditing])

  if (!isHydrated) {
    return <Skeleton aria-hidden className="-ml-2 h-7.5 w-40 rounded-full" />
  }

  return (
    <div className="text-muted-foreground flex items-center">
      {isEditing ? (
        <Input
          ref={inputRef}
          value={resumeTitleValue}
          onChange={(event) =>
            setResumeTitleValue(
              event.target.value.slice(0, RESUME_TITLE_MAX_LENGTH)
            )
          }
          onBlur={() => setIsEditing(false)}
          onFocus={(event) => event.currentTarget.select()}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === 'Escape') {
              event.preventDefault()
              setIsEditing(false)
            }
          }}
          maxLength={RESUME_TITLE_MAX_LENGTH}
          aria-label="Resume title"
          className={`${baseTitleClassName} ${titleInputWidthClassName} placeholder:text-muted-foreground/70 focus-visible:border-border/70 focus-visible:bg-muted/20 focus-visible:ring-primary/25 -ml-2 h-auto min-w-0 border-transparent bg-transparent px-2 py-1 shadow-none transition focus-visible:ring-2 dark:bg-transparent`}
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className={`${baseTitleClassName} -ml-2 inline-flex cursor-text items-center gap-1.5 px-2 py-1`}
          aria-label="Edit resume title"
        >
          <span
            className={`${titleDisplayMaxWidthClassName} inline-block truncate`}
          >
            {resumeTitleValue}
          </span>
          <PencilSimpleIcon
            size={12}
            className="text-muted-foreground/70"
            aria-hidden
          />
        </button>
      )}
    </div>
  )
}
