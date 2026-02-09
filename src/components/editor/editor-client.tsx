'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'
import EditorLoading from '@/components/editor/editor-loading'
import { useResumeHydrated, useResumeStore } from '@/stores/resume-store'

const MarkdownEditor = dynamic(() => import('@/components/editor/editor'), {
  ssr: false,
  loading: () => <EditorLoading />,
})

function TokenHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const createDraft = useResumeStore((state) => state.createDraft)
  const setActiveDraft = useResumeStore((state) => state.setActiveDraft)
  const updateDraft = useResumeStore((state) => state.updateDraft)
  const getDraftByRemoteId = useResumeStore(
    (state) => state.getDraftByRemoteId
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
          }
          error?: string
        }

        if (!response.ok) {
          throw new Error(data.error || 'Failed to verify token')
        }

        const { resume } = data
        const existingDraft = getDraftByRemoteId(resume.id)
        const draftId = existingDraft?.draftId ?? createDraft()

        updateDraft(draftId, {
          id: resume.id,
          slug: resume.slug,
          resumeTitle: resume.title,
          markdown: resume.content,
          editSecret: resume.editSecret ?? null,
          isPublished: true,
          syncStatus: 'synced',
        })
        setActiveDraft(draftId)

        toast.success('Resume loaded successfully', { id: toastId })
        router.replace(`/edit/${draftId}`)
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
    createDraft,
    setActiveDraft,
    updateDraft,
    getDraftByRemoteId,
  ])

  return null
}

interface RouteSyncProps {
  routeDraftId?: string
  gateway?: boolean
}

function RouteSync({ routeDraftId, gateway = false }: RouteSyncProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isHydrated = useResumeHydrated()
  const activeDraftId = useResumeStore((state) => state.activeDraftId)
  const draftsById = useResumeStore((state) => state.draftsById)
  const setActiveDraft = useResumeStore((state) => state.setActiveDraft)
  const createDraft = useResumeStore((state) => state.createDraft)

  useEffect(() => {
    if (!isHydrated) return
    if (searchParams.get('token')) return

    if (routeDraftId) {
      if (draftsById[routeDraftId]) {
        if (activeDraftId !== routeDraftId) {
          setActiveDraft(routeDraftId)
        }
        return
      }

      const fallbackDraftId =
        activeDraftId && draftsById[activeDraftId]
          ? activeDraftId
          : createDraft()
      router.replace(`/edit/${fallbackDraftId}`)
      return
    }

    if (!gateway) return

    const targetDraftId =
      activeDraftId && draftsById[activeDraftId]
        ? activeDraftId
        : createDraft()
    router.replace(`/edit/${targetDraftId}`)
  }, [
    activeDraftId,
    createDraft,
    draftsById,
    gateway,
    isHydrated,
    routeDraftId,
    router,
    searchParams,
    setActiveDraft,
  ])

  return null
}

interface EditorClientProps {
  routeDraftId?: string
  gateway?: boolean
}

export default function EditorClient({
  routeDraftId,
  gateway = false,
}: EditorClientProps) {
  if (gateway) {
    return (
      <Suspense fallback={<EditorLoading />}>
        <TokenHandler />
        <RouteSync gateway />
        <EditorLoading />
      </Suspense>
    )
  }

  return (
    <Suspense fallback={<EditorLoading />}>
      <TokenHandler />
      <RouteSync routeDraftId={routeDraftId} />
      <MarkdownEditor />
    </Suspense>
  )
}
