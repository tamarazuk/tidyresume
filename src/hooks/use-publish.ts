'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useResumeStore } from '@/stores/resume-store'
import { publishResume as publishResumeRequest } from '@/lib/resume-api'
import { getResumeUrl } from '@/lib/utils'

export function usePublish() {
  const [isPublishing, setIsPublishing] = useState(false)
  const resumeTitle = useResumeStore((state) => state.resumeTitle)
  const resumeContent = useResumeStore((state) => state.markdown)
  const resumeSlug = useResumeStore((state) => state.slug)
  const setResumeId = useResumeStore((state) => state.setId)
  const setSyncStatus = useResumeStore((state) => state.setSyncStatus)
  const setDeleteSecret = useResumeStore((state) => state.setDeleteSecret)

  const publishResume = async () => {
    setIsPublishing(true)
    try {
      const data = await publishResumeRequest({
        title: resumeTitle,
        content: resumeContent,
      })
      setResumeId(data.id)
      if (data.deleteSecret) {
        setDeleteSecret(data.deleteSecret)
      }
      setSyncStatus('synced')
      const resumeUrl = getResumeUrl(data.id, data.slug ?? resumeSlug)
      toast.success('Resume published', {
        action: {
          label: 'View resume',
          onClick: () => {
            window.open(resumeUrl, '_blank', 'noopener,noreferrer')
          },
        },
      })
    } catch (error) {
      console.error(error)
      toast.error('Failed to publish resume')
    } finally {
      setIsPublishing(false)
    }
  }

  return { isPublishing, publishResume }
}
