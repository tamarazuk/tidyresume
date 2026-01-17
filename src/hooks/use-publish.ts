'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useResumeStore } from '@/stores/resume-store'
import {
  publishResume as publishResumeRequest,
  deleteResume as deleteResumeRequest,
} from '@/lib/resume-api'
import { getResumeUrl } from '@/lib/utils'

export function usePublish() {
  const router = useRouter()
  const [isPublishing, setIsPublishing] = useState(false)
  const [isUnpublishing, setIsUnpublishing] = useState(false)
  const resumeId = useResumeStore((state) => state.id)
  const editSecret = useResumeStore((state) => state.editSecret)
  const resumeTitle = useResumeStore((state) => state.resumeTitle)
  const resumeContent = useResumeStore((state) => state.markdown)
  const resumeSlug = useResumeStore((state) => state.slug)
  const setResumeId = useResumeStore((state) => state.setId)
  const setSyncStatus = useResumeStore((state) => state.setSyncStatus)
  const setIsPublished = useResumeStore((state) => state.setIsPublished)
  const setEditSecret = useResumeStore((state) => state.setEditSecret)

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
        },
        {
          editSecret: editSecret ?? undefined,
        }
      )

      if (data.id) {
        setResumeId(data.id)
      }
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
      toast.error('Failed to publish resume')
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
      await deleteResumeRequest(resumeId, {
        editSecret: editSecret ?? undefined,
      })
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
