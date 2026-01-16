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
  const unpublish = useResumeStore((state) => state.unpublish)
  const slug = useResumeStore((state) => state.slug)
  const deleteSecret = useResumeStore((state) => state.deleteSecret)
  const [isUnpublishing, setIsUnpublishing] = useState(false)

  const getShareUrl = () => {
    const shareId = slug || id
    return `${window.location.origin}/r/${shareId}`
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareUrl()).then(() => {
      toast.success('Link copied to clipboard')
    })
  }

  const handleUnpublish = async () => {
    if (!confirm('Are you sure? Your public link will stop working immediately.')) return

    setIsUnpublishing(true)
    try {
      await deleteResume(id, { deleteSecret })
      unpublish()
      toast.success('Resume unpublished successfully')
      router.push('/edit')
    } catch (error) {
      console.error(`An error occured while unpublishing the resume: ${error}`)
      toast.error('Failed to unpublish resume')
    } finally {
      setIsUnpublishing(false)
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
    isUnpublishing,
    handleUnpublish,
    handleShare,
    handleUrlUpdated,
  }
}
