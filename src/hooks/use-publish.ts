'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useResumeStore } from '@/stores/resume-store'
import { publishResume as publishResumeRequest, deleteResume as deleteResumeRequest } from '@/lib/resume-api'
import { getResumeUrl } from '@/lib/utils'

export function usePublish() {
  const [isPublishing, setIsPublishing] = useState(false)
  const [isUnpublishing, setIsUnpublishing] = useState(false)
  const resumeId = useResumeStore((state) => state.id)
  const deleteSecret = useResumeStore((state) => state.deleteSecret)
  const resumeTitle = useResumeStore((state) => state.resumeTitle)
  const resumeContent = useResumeStore((state) => state.markdown)
  const resumeSlug = useResumeStore((state) => state.slug)
  const setResumeId = useResumeStore((state) => state.setId)
  const setSyncStatus = useResumeStore((state) => state.setSyncStatus)
  const setIsPublished = useResumeStore((state) => state.setIsPublished)
  const setDeleteSecret = useResumeStore((state) => state.setDeleteSecret)
// ...
      if (data.deleteSecret) {
        setDeleteSecret(data.deleteSecret)
      }
      setIsPublished(true)
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

  const unpublishResume = async () => {
    if (!resumeId) return
    if (!confirm('Are you sure? Your public link will stop working immediately.')) return

    setIsUnpublishing(true)
    try {
      await deleteResumeRequest(resumeId, { deleteSecret: deleteSecret ?? undefined })
      useResumeStore.getState().unpublish()
      toast.success('Resume unpublished successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to unpublish resume')
    } finally {
      setIsUnpublishing(false)
    }
  }

  return { isPublishing, isUnpublishing, publishResume, unpublishResume }
}
