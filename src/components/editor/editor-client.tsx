'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'
import EditorLoading from '@/components/editor/editor-loading'
import { useResumeStore } from '@/stores/resume-store'
import type { ResumeThemeSettings } from '@/types/resume'

const MarkdownEditor = dynamic(() => import('@/components/editor/editor'), {
  ssr: false,
  loading: () => <EditorLoading />,
})

function TokenHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const loadResumeFromRemote = useResumeStore(
    (state) => state.loadResumeFromRemote
  )

  useEffect(() => {
    if (!token) return

    const verifyToken = async () => {
      const toastId = toast.loading('Verifying magic link...')
      try {
        const response = await fetch('/api/auth/verify-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        const data = (await response.json()) as {
          resume: {
            id: string
            slug: string | null
            title: string
            content: string
            editSecret?: string | null
            theme?: ResumeThemeSettings | null
          }
          error?: string
        }

        if (!response.ok) {
          throw new Error(data.error || 'Failed to verify token')
        }

        const { resume } = data

        loadResumeFromRemote(resume)

        toast.success('Resume loaded successfully', { id: toastId })
        router.replace('/edit')
      } catch (error) {
        toast.error('Invalid or expired link', {
          id: toastId,
          description:
            error instanceof Error ? error.message : 'Please try again',
        })
        router.replace('/edit')
      }
    }

    verifyToken()
  }, [
    token,
    router,
    loadResumeFromRemote,
  ])

  return null
}

export default function EditorClient() {
  const touchActiveResume = useResumeStore((state) => state.touchActiveResume)

  useEffect(() => {
    touchActiveResume()
  }, [touchActiveResume])

  return (
    <Suspense fallback={<EditorLoading />}>
      <TokenHandler />
      <MarkdownEditor />
    </Suspense>
  )
}
