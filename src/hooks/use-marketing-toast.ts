import { useEffect, useRef } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

const TOAST_MESSAGES = {
  'resume-deleted': 'Resume deleted.',
} as const

export function useMarketingToast() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const hasShown = useRef(false)
  const toastKey = searchParams.get('toast')

  useEffect(() => {
    if (!toastKey || hasShown.current) return

    const message = TOAST_MESSAGES[toastKey as keyof typeof TOAST_MESSAGES]
    if (!message) return

    hasShown.current = true
    toast.success(message)

    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.delete('toast')
    const nextQuery = nextParams.toString()
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname)
  }, [toastKey, pathname, router, searchParams])
}
