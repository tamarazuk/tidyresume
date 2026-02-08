'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import {
  ArrowsClockwiseIcon,
  ArrowSquareOutIcon,
  FilesIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@phosphor-icons/react/dist/ssr'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn, getResumeUrl } from '@/lib/utils'
import { useResumeStore, type ResumeDraft } from '@/stores/resume-store'

const DIALOG_CONTENT_CLASS_NAME =
  'top-0 left-0 h-dvh w-screen max-w-none translate-x-0 translate-y-0 rounded-none border-0 p-0'

function sortDrafts(drafts: ResumeDraft[]) {
  return [...drafts].sort((left, right) => right.updatedAt - left.updatedAt)
}

interface SwitcherListProps {
  drafts: ResumeDraft[]
  activeDraftId: string | null
  query: string
  onQueryChange: (nextValue: string) => void
  onOpenDraft: (draftId: string) => void
  onDuplicateDraft: (draftId: string) => void
  onOpenPublicLink: (draft: ResumeDraft) => void
  onCreateDraft: () => void
  onClose?: () => void
  className?: string
}

function SwitcherList({
  drafts,
  activeDraftId,
  query,
  onQueryChange,
  onOpenDraft,
  onDuplicateDraft,
  onOpenPublicLink,
  onCreateDraft,
  onClose,
  className,
}: SwitcherListProps) {
  const normalizedQuery = query.trim().toLowerCase()
  const filteredDrafts = useMemo(() => {
    if (!normalizedQuery) return drafts
    return drafts.filter((draft) => {
      const title = draft.resumeTitle.toLowerCase()
      const slug = draft.slug?.toLowerCase() ?? ''
      const remoteId = draft.id?.toLowerCase() ?? ''
      return (
        title.includes(normalizedQuery) ||
        slug.includes(normalizedQuery) ||
        remoteId.includes(normalizedQuery)
      )
    })
  }, [drafts, normalizedQuery])

  return (
    <div className={cn('flex h-full flex-col', className)}>
      <div className="border-border flex flex-col gap-3 border-b px-4 py-4">
        <div className="relative">
          <MagnifyingGlassIcon
            size={14}
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2"
          />
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search resumes..."
            className="pl-8"
            aria-label="Search resumes"
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="gap-1.5"
            onClick={onCreateDraft}
            aria-label="Create new resume"
          >
            <PlusIcon size={14} />
            New
          </Button>
          <Link
            href="/resumes"
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
            onClick={onClose}
          >
            Manage all
          </Link>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
        {filteredDrafts.length === 0 ? (
          <div className="text-muted-foreground px-2 py-8 text-center text-sm">
            No resumes match your search.
          </div>
        ) : null}
        <div className="space-y-1">
          {filteredDrafts.map((draft) => {
            const isActive = draft.draftId === activeDraftId
            const statusLabel = draft.isPublished ? 'Published' : 'Draft'
            const statusClassName = draft.isPublished
              ? 'bg-emerald-500/10 text-emerald-700'
              : 'bg-slate-500/10 text-slate-700'
            return (
              <div
                key={draft.draftId}
                className={cn(
                  'hover:bg-muted/60 rounded-md border border-transparent p-2',
                  isActive && 'bg-muted border-border/70'
                )}
              >
                <button
                  type="button"
                  className="w-full cursor-pointer text-left"
                  onClick={() => onOpenDraft(draft.draftId)}
                  aria-label={`Open ${draft.resumeTitle || 'Untitled Resume'}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">
                      {draft.resumeTitle || 'Untitled Resume'}
                    </p>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[11px] font-medium',
                        statusClassName
                      )}
                    >
                      {statusLabel}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Updated{' '}
                    {new Date(draft.updatedAt).toLocaleDateString('en-US')}
                  </p>
                </button>
                <div className="mt-2 flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    className="gap-1.5"
                    onClick={() => onDuplicateDraft(draft.draftId)}
                    aria-label={`Duplicate ${draft.resumeTitle || 'Untitled Resume'}`}
                  >
                    <ArrowsClockwiseIcon size={12} />
                    Duplicate
                  </Button>
                  {draft.id ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      className="gap-1.5"
                      onClick={() => onOpenPublicLink(draft)}
                      aria-label={`Open public link for ${draft.resumeTitle || 'Untitled Resume'}`}
                    >
                      <ArrowSquareOutIcon size={12} />
                      Public link
                    </Button>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function ResumeSwitcher() {
  const router = useRouter()
  const [desktopOpen, setDesktopOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const draftOrder = useResumeStore((state) => state.draftOrder)
  const draftsById = useResumeStore((state) => state.draftsById)
  const activeDraftId = useResumeStore((state) => state.activeDraftId)
  const setActiveDraft = useResumeStore((state) => state.setActiveDraft)
  const createDraft = useResumeStore((state) => state.createDraft)
  const duplicateDraft = useResumeStore((state) => state.duplicateDraft)

  const drafts = useMemo(() => {
    const unsorted = draftOrder
      .map((draftId) => draftsById[draftId])
      .filter((draft): draft is ResumeDraft => Boolean(draft))
    return sortDrafts(unsorted)
  }, [draftOrder, draftsById])

  const closeMenus = () => {
    setDesktopOpen(false)
    setMobileOpen(false)
    setQuery('')
  }

  const handleOpenDraft = (draftId: string) => {
    setActiveDraft(draftId)
    router.push(`/edit/${draftId}`)
    closeMenus()
  }

  const handleCreateDraft = () => {
    const draftId = createDraft()
    router.push(`/edit/${draftId}`)
    closeMenus()
  }

  const handleDuplicateDraft = (draftId: string) => {
    const nextDraftId = duplicateDraft(draftId)
    if (!nextDraftId) return
    router.push(`/edit/${nextDraftId}`)
    closeMenus()
  }

  const handleOpenPublicLink = (draft: ResumeDraft) => {
    if (!draft.id) return
    router.push(getResumeUrl(draft.id, draft.slug))
    closeMenus()
  }

  return (
    <>
      <Popover open={desktopOpen} onOpenChange={setDesktopOpen}>
        <PopoverTrigger
          render={(props) => (
            <Button
              {...props}
              variant="outline"
              size="sm"
              className="hidden gap-1.5 sm:inline-flex"
              aria-label="Switch resumes"
            >
              <FilesIcon size={14} />
              Resumes
            </Button>
          )}
        />
        <PopoverContent className="hidden w-[26rem] p-0 sm:flex sm:flex-col">
          <SwitcherList
            drafts={drafts}
            activeDraftId={activeDraftId}
            query={query}
            onQueryChange={setQuery}
            onOpenDraft={handleOpenDraft}
            onDuplicateDraft={handleDuplicateDraft}
            onOpenPublicLink={handleOpenPublicLink}
            onCreateDraft={handleCreateDraft}
            onClose={closeMenus}
          />
        </PopoverContent>
      </Popover>

      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogTrigger
          render={(props) => (
            <Button
              {...props}
              variant="outline"
              size="sm"
              className="gap-1.5 sm:hidden"
              aria-label="Switch resumes"
            >
              <FilesIcon size={14} />
              Resumes
            </Button>
          )}
        />
        <DialogContent className={cn(DIALOG_CONTENT_CLASS_NAME, 'sm:hidden')}>
          <div className="border-border bg-background border-b px-4 py-3">
            <DialogTitle className="font-heading text-lg">
              Resume Switcher
            </DialogTitle>
          </div>
          <SwitcherList
            drafts={drafts}
            activeDraftId={activeDraftId}
            query={query}
            onQueryChange={setQuery}
            onOpenDraft={handleOpenDraft}
            onDuplicateDraft={handleDuplicateDraft}
            onOpenPublicLink={handleOpenPublicLink}
            onCreateDraft={handleCreateDraft}
            onClose={closeMenus}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
