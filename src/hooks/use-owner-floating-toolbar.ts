import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useOwnerCheck } from '@/hooks/use-owner-check'
import { deleteResume } from '@/lib/resume-api'
import { useResumeStore } from '@/stores/resume-store'

interface UseOwnerFloatingToolbarOptions {
  id: string
}

export function useOwnerFloatingToolbar({ id }: UseOwnerFloatingToolbarOptions) {
  const isOwner = useOwnerCheck(id)
  const router = useRouter()
  const resetResume = useResumeStore((state) => state.resetResume)
  const slug = useResumeStore((state) => state.slug)
  const deleteSecret = useResumeStore((state) => state.deleteSecret)
  const [isDeleting, setIsDeleting] = useState(false)

  const getShareUrl = () => {
    const shareId = slug || id
    return `${window.location.origin}/r/${shareId}`
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareUrl()).then(() => {
      toast.success('Link copied to clipboard')
    })
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this resume?')) return

    setIsDeleting(true)
    let didRedirect = false
    try {
      await deleteResume(id, { deleteSecret })
      resetResume()
      didRedirect = true
      router.push('/?toast=resume-deleted')
    } catch (error) {
      console.error(`An error occured while deleting the resume: ${error}`)
      toast.error('Failed to delete resume')
    } finally {
      if (!didRedirect) {
        setIsDeleting(false)
      }
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Resume',
          url: getShareUrl(),
        })
      } catch (err) {
        console.error('Share failed', err)
      }
    } else {
      handleCopyLink()
    }
  }

  const handleUrlUpdated = (url: string) => {
    router.replace(url)
  }

  return {
    isOwner,
    isDeleting,
    handleDelete,
    handleShare,
    handleUrlUpdated,
  }
}
