import { useState } from 'react'
import { isResumeApiError, publishResume } from '@/lib/resume-api'
import { useResumeStore } from '@/stores/resume-store'

interface UseSlugSettingsOptions {
  onUrlUpdated?: (url: string) => void
}

export function useSlugSettings(options: UseSlugSettingsOptions = {}) {
  const id = useResumeStore((state) => state.id)
  const title = useResumeStore((state) => state.resumeTitle)
  const content = useResumeStore((state) => state.markdown)
  const slug = useResumeStore((state) => state.slug)
  const setSlug = useResumeStore((state) => state.setSlug)
  const setSyncStatus = useResumeStore((state) => state.setSyncStatus)

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
      const payload = {
        title,
        content,
        slug: cleanedSlug === '' ? null : cleanedSlug,
      }
      const data = await publishResume(id ? { ...payload, id } : payload)
      setSlug(data.slug)
      setSyncStatus('synced')
      setStatus('success')
      if (data.url) {
        options.onUrlUpdated?.(data.url)
      }

      setTimeout(() => setIsOpen(false), 1000)
    } catch (error) {
      console.error(error)
      if (isResumeApiError(error) && error.status === 409) {
        setStatus('error')
        setErrorMessage('Slug already taken')
        return
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
