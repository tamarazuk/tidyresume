import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useOwnerCheck } from '@/hooks/use-owner-check'
import { useResumeStore } from '@/stores/resume-store'

interface UseOwnerFloatingToolbarOptions {
  id: string
}

export function useOwnerFloatingToolbar({ id }: UseOwnerFloatingToolbarOptions) {
  const { isOwner, draftId } = useOwnerCheck(id)
  const router = useRouter()
  const slug = useResumeStore((state) =>
    draftId ? state.draftsById[draftId]?.slug ?? null : null
  )
  const editSecret = useResumeStore((state) =>
    draftId ? state.draftsById[draftId]?.editSecret ?? null : null
  )
  const setActiveDraft = useResumeStore((state) => state.setActiveDraft)

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

  const handleEdit = () => {
    if (draftId) {
      setActiveDraft(draftId)
    }
  }

  const editHref = draftId ? `/edit/${draftId}` : '/edit'

  return {
    isOwner,
    draftId,
    editSecret,
    editHref,
    handleShare,
    handleUrlUpdated,
    handleEdit,
  }
}
