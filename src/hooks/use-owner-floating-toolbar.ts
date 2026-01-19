import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useOwnerCheck } from '@/hooks/use-owner-check'
import { useResumeStore } from '@/stores/resume-store'

interface UseOwnerFloatingToolbarOptions {
  id: string
}

export function useOwnerFloatingToolbar({ id }: UseOwnerFloatingToolbarOptions) {
  const ownsResume = useOwnerCheck(id)
  const isActiveOwner = useResumeStore((state) => state.id === id)
  const isOwner = ownsResume && isActiveOwner
  const router = useRouter()
  const slug = useResumeStore((state) => state.slug)

  const getShareUrl = () => {
    const shareId = slug || id
    return `${window.location.origin}/r/${shareId}`
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareUrl()).then(() => {
      toast.success('Link copied to clipboard')
    })
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
    handleShare,
    handleUrlUpdated,
  }
}
