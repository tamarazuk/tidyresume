'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useResumeStore } from '@/stores/resume-store'
import {
  publishResume as publishResumeRequest,
  deleteResume as deleteResumeRequest,
  isResumeApiError,
} from '@/lib/resume-api'
import { getResumeUrl } from '@/lib/utils'

export function usePublish() {
  const router = useRouter()
  const [isPublishing, setIsPublishing] = useState(false)
  const [isUnpublishing, setIsUnpublishing] = useState(false)
  const draft = useResumeStore((state) => state.getActiveDraft())
  const resumeId = draft.id
  const editSecret = draft.editSecret
  const resumeTitle = draft.resumeTitle
  const resumeContent = draft.markdown
  const resumeSlug = draft.slug
  const resumeTheme = draft.resumeDisplay.theme
  const setResumeId = useResumeStore((state) => state.setId)
  const setSlug = useResumeStore((state) => state.setSlug)
  const setSyncStatus = useResumeStore((state) => state.setSyncStatus)
  const setIsPublished = useResumeStore((state) => state.setIsPublished)
  const setEditSecret = useResumeStore((state) => state.setEditSecret)

  const resolvePublishErrorMessage = (error: unknown) => {
    if (!isResumeApiError(error)) {
      return 'Failed to publish resume'
    }
    if (error.status === 409) {
      return 'Custom link is already taken'
    }
    if (error.status === 401 || error.status === 403) {
      return 'You do not have permission to publish this resume'
    }
    if (error.status === 404) {
      return 'Resume not found. Try publishing again.'
    }
    return 'Failed to publish resume'
  }

  const resolveUnpublishErrorMessage = (error: unknown) => {
    if (!isResumeApiError(error)) {
      return 'Failed to unpublish resume'
    }
    if (error.status === 401 || error.status === 403) {
      return 'You do not have permission to unpublish this resume'
    }
    return 'Failed to unpublish resume'
  }

  const publishResume = async () => {
    setIsPublishing(true)
    setSyncStatus('syncing')
    try {
      const data = await publishResumeRequest(
        {
          title: resumeTitle,
          content: resumeContent,
          slug: resumeSlug,
          id: resumeId ?? undefined,
          theme: resumeTheme,
        },
        {
          editSecret: editSecret ?? undefined,
        }
      )

      setResumeId(data.id)
      setSlug(data.slug ?? null)
      if (data.editSecret) {
        setEditSecret(data.editSecret)
      }
      setIsPublished(true)
      setSyncStatus('synced')
      const resumeUrl = getResumeUrl(data.id, data.slug ?? resumeSlug)
      toast.success('Resume published', {
        action: {
          label: 'View resume',
          onClick: () => {
            router.push(resumeUrl)
          },
        },
      })
    } catch (error) {
      console.error(error)
      toast.error(resolvePublishErrorMessage(error))
    } finally {
      setIsPublishing(false)
    }
  }

  const unpublishResume = async () => {
    if (!resumeId) return
    if (
      !confirm('Are you sure? Your public link will stop working immediately.')
    )
      return

    setIsUnpublishing(true)
    try {
      let wasAlreadyUnpublished = false
      try {
        await deleteResumeRequest(resumeId, {
          editSecret: editSecret ?? undefined,
        })
      } catch (error) {
        if (isResumeApiError(error) && error.status === 404) {
          wasAlreadyUnpublished = true
        } else {
          throw error
        }
      }
      useResumeStore.getState().unpublish()
      toast.success(
        wasAlreadyUnpublished
          ? 'Resume was already unpublished'
          : 'Resume unpublished successfully'
      )
    } catch (error) {
      console.error(error)
      toast.error(resolveUnpublishErrorMessage(error))
    } finally {
      setIsUnpublishing(false)
    }
  }

  return { isPublishing, isUnpublishing, publishResume, unpublishResume }
}
