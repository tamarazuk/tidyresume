'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'
import EditorLoading from '@/components/editor/editor-loading'
import { useResumeStore } from '@/stores/resume-store'

const MarkdownEditor = dynamic(() => import('@/components/editor/editor'), {
  ssr: false,
  loading: () => <EditorLoading />,
})

function TokenHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const setMarkdown = useResumeStore((state) => state.setMarkdown)
  const setResumeTitle = useResumeStore((state) => state.setResumeTitle)
  const setId = useResumeStore((state) => state.setId)
  const setSlug = useResumeStore((state) => state.setSlug)
  const setDeleteSecret = useResumeStore((state) => state.setDeleteSecret)

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
            deleteSecret?: string | null
          }
          error?: string
        }

        if (!response.ok) {
          throw new Error(data.error || 'Failed to verify token')
        }

        const { resume } = data

        setId(resume.id)
        setSlug(resume.slug)
        setResumeTitle(resume.title)
        setMarkdown(resume.content)
        if (resume.deleteSecret) {
          setDeleteSecret(resume.deleteSecret)
        }

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
  }, [token, router, setId, setSlug, setResumeTitle, setMarkdown])

  return null
}

export default function EditorClient() {
  return (
    <Suspense fallback={<EditorLoading />}>
      <TokenHandler />
      <MarkdownEditor />
    </Suspense>
  )
}
