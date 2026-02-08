'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { PlusIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'
import AppIcon from '@/icons/app-icon'
import ResumeCard from '@/components/resumes/resume-card'
import { Button } from '@/components/ui/button'
import { deleteResume } from '@/lib/resume-api'
import { cn } from '@/lib/utils'
import { useResumeStore, type ResumeDraft } from '@/stores/resume-store'

export default function ResumeLibrary() {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const draftOrder = useResumeStore((state) => state.draftOrder)
  const draftsById = useResumeStore((state) => state.draftsById)
  const createDraft = useResumeStore((state) => state.createDraft)
  const setActiveDraft = useResumeStore((state) => state.setActiveDraft)
  const deleteDraft = useResumeStore((state) => state.deleteDraft)
  const duplicateDraft = useResumeStore((state) => state.duplicateDraft)

  const drafts = useMemo(
    () =>
      draftOrder
        .map((id) => draftsById[id])
        .filter((draft): draft is ResumeDraft => Boolean(draft)),
    [draftOrder, draftsById]
  )

  const handleNewResume = () => {
    const draftId = createDraft()
    setActiveDraft(draftId)
    router.push(`/edit/${draftId}`)
  }

  const handleOpen = (draftId: string) => {
    setActiveDraft(draftId)
    router.push(`/edit/${draftId}`)
  }

  const handleDuplicate = (draftId: string) => {
    const duplicateId = duplicateDraft(draftId)
    if (duplicateId) {
      setActiveDraft(duplicateId)
      router.push(`/edit/${duplicateId}`)
    }
  }

  const handleDelete = async (draftId: string) => {
    if (isDeleting) return

    const draft = draftsById[draftId]
    if (!draft) return

    const confirmMessage = draft.isPublished
      ? 'Delete this resume? The public link will stop working immediately.'
      : 'Delete this resume draft? This cannot be undone.'
    if (!confirm(confirmMessage)) return

    if (!draft.isPublished) {
      deleteDraft(draftId)
      return
    }

    setIsDeleting(draftId)
    try {
      if (!draft.id) {
        throw new Error('Missing resume id')
      }
      await deleteResume(draft.id, {
        editSecret: draft.editSecret ?? undefined,
      })
      deleteDraft(draftId)
      toast.success('Resume unpublished and deleted')
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete resume')
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="bg-background min-h-screen">
      <header className="border-border bg-background/80 sticky top-0 z-10 flex items-center justify-between border-b px-6 py-4 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center">
            <AppIcon className="h-full w-full" />
          </span>
          <div>
            <p className="font-heading text-lg font-semibold">TidyResume</p>
            <p className="text-muted-foreground text-sm">Your resume library</p>
          </div>
        </Link>
        <Button onClick={handleNewResume} className="gap-2">
          <PlusIcon size={16} weight="bold" />
          New resume
        </Button>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
        <section className="space-y-2">
          <h1 className="font-heading text-2xl font-semibold">Resumes</h1>
          <p className="text-muted-foreground text-sm">
            Drafts live only in this browser until you publish them.
          </p>
        </section>

        <section
          className={cn(
            'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
            drafts.length === 0 && 'grid-cols-1'
          )}
        >
          {drafts.length === 0 ? (
            <div className="border-border/70 bg-muted/30 flex flex-col items-start gap-3 rounded-2xl border border-dashed p-6">
              <p className="text-muted-foreground text-sm">
                You have no resumes yet. Start a new draft to begin.
              </p>
              <Button onClick={handleNewResume} className="gap-2">
                <PlusIcon size={16} weight="bold" />
                Create first resume
              </Button>
            </div>
          ) : null}
          {drafts.map((draft) => (
            <ResumeCard
              key={draft.draftId}
              draft={draft}
              onOpen={() => handleOpen(draft.draftId)}
              onDuplicate={() => handleDuplicate(draft.draftId)}
              onDelete={() => handleDelete(draft.draftId)}
            />
          ))}
        </section>
        {isDeleting ? (
          <div className="text-muted-foreground text-xs">
            Deleting resume...
          </div>
        ) : null}
      </main>
    </div>
  )
}
