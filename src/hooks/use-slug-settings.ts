import { useState } from 'react'
import { isResumeApiError, updateResumeSlug } from '@/lib/resume-api'
import { useResumeStore, type ResumeDraftId } from '@/stores/resume-store'

interface UseSlugSettingsOptions {
  draftId?: ResumeDraftId
  onUrlUpdated?: (url: string) => void
}

export function useSlugSettings(options: UseSlugSettingsOptions = {}) {
  const draft = useResumeStore((state) =>
    options.draftId
      ? state.draftsById[options.draftId] ?? null
      : state.getActiveDraft()
  )
  const id = draft?.id ?? null
  const slug = draft?.slug ?? null
  const draftId = draft?.draftId ?? null
  const setSlug = useResumeStore((state) => state.setSlug)
  const setDraftSlug = useResumeStore((state) => state.setDraftSlug)
  const setSyncStatus = useResumeStore((state) => state.setSyncStatus)
  const setDraftSyncStatus = useResumeStore((state) => state.setDraftSyncStatus)
  const editSecret = draft?.editSecret ?? null

  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState<string>(slug ?? id ?? '')
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>(
    'idle'
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleOpenChange = (nextOpen: boolean) => {
    setIsOpen(nextOpen)
    if (!nextOpen) return
    setInputValue(slug ?? id ?? '')
    setStatus('idle')
    setErrorMessage(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    const cleanedSlug = inputValue
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')

    if (cleanedSlug === slug || (slug === null && cleanedSlug === id)) {
      setIsOpen(false)
      return
    }

    setStatus('saving')
    setErrorMessage(null)

    try {
      if (!id) {
        throw new Error('Missing resume id')
      }
      const data = await updateResumeSlug(
        id,
        cleanedSlug === '' ? null : cleanedSlug,
        {
          editSecret: editSecret ?? undefined,
        }
      )
      if (draftId) {
        setDraftSlug(draftId, data.slug)
        setDraftSyncStatus(draftId, 'synced')
      } else {
        setSlug(data.slug)
        setSyncStatus('synced')
      }
      setStatus('success')
      if (data.url) {
        options.onUrlUpdated?.(data.url)
      }

      setTimeout(() => setIsOpen(false), 1000)
    } catch (error) {
      console.error(error)
      if (isResumeApiError(error)) {
        if (error.status === 409 || error.message === 'Slug already taken') {
          setStatus('error')
          setErrorMessage('Slug already taken')
          return
        }
        if (error.status === 401 || error.status === 403) {
          setStatus('error')
          setErrorMessage('You do not have permission to edit this slug')
          return
        }
        if (error.status === 404) {
          setStatus('error')
          setErrorMessage('Resume not found. Publish again and retry.')
          return
        }
        if (error.status >= 500) {
          setStatus('error')
          setErrorMessage('Server error while saving link')
          return
        }
      }
      setStatus('error')
      setErrorMessage('Something went wrong')
    }
  }

  const copyLink = () => {
    const url = `${window.location.origin}/r/${slug ?? id ?? ''}`
    navigator.clipboard.writeText(url)
  }

  return {
    id,
    slug,
    isOpen,
    setIsOpen: handleOpenChange,
    inputValue,
    setInputValue,
    status,
    errorMessage,
    handleSave,
    copyLink,
  }
}
