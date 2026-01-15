import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { toast } from 'sonner'

import { publishResume } from '@/lib/resume-api'
import { RESUME_TITLE_MAX_LENGTH } from '@/lib/constants'
import { useOwnerCheck } from '@/hooks/use-owner-check'
import { useResumeStore } from '@/stores/resume-store'

interface UseEditableResumeTitleOptions {
  id: string
  title: string
  content: string
}

export function useEditableResumeTitle({
  id,
  title,
  content,
}: UseEditableResumeTitleOptions) {
  const isOwner = useOwnerCheck(id)
  const setResumeTitle = useResumeStore((state) => state.setResumeTitle)
  const [currentTitle, setCurrentTitle] = useState(title)
  const [draftTitle, setDraftTitle] = useState(title)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isEditingRef = useRef(isEditing)

  useEffect(() => {
    isEditingRef.current = isEditing
  }, [isEditing])

  useEffect(() => {
    if (isEditingRef.current) return
    setCurrentTitle(title)
    setDraftTitle(title)
  }, [title])

  useEffect(() => {
    if (!isEditing) return
    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    })
    return () => cancelAnimationFrame(frame)
  }, [isEditing])

  const handleSave = async () => {
    const trimmedTitle = draftTitle.trim()
    const nextTitle = (trimmedTitle || 'Untitled Resume').slice(
      0,
      RESUME_TITLE_MAX_LENGTH
    )
    if (nextTitle === currentTitle) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    try {
      await publishResume({
        id,
        title: nextTitle,
        content,
      })

      setCurrentTitle(nextTitle)
      setDraftTitle(nextTitle)
      setResumeTitle(nextTitle)
    } catch (error) {
      console.error('Title update failed', error)
      toast.error('Failed to update title')
      setDraftTitle(currentTitle)
    } finally {
      setIsSaving(false)
      setIsEditing(false)
    }
  }

  const handleBlur = () => {
    void handleSave()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      void handleSave()
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      setDraftTitle(currentTitle)
      setIsEditing(false)
    }
  }

  const startEditing = () => setIsEditing(true)

  return {
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
  }
}
