'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowSquareOutIcon,
  CaretDownIcon,
  CheckCircleIcon,
  GlobeIcon,
  MagnifyingGlassIcon,
  PencilSimpleLineIcon,
  PlusIcon,
  StackIcon,
} from '@phosphor-icons/react/dist/ssr'
import { LabelDot } from '@/components/labels/label-badge'
import { formatUpdatedAt } from '@/components/resumes/format-updated-at'
import { Button, buttonVariants } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn, getResumeUrl } from '@/lib/utils'
import usePlatformShortcuts from '@/hooks/use-platform-shortcuts'
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
  onOpenPublicLink,
  onCreateDraft,
  onClose,
  className,
}: SwitcherListProps) {
  const searchRef = useRef<HTMLInputElement>(null)
  const labelsById = useResumeStore((s) => s.labelsById)
  const normalizedQuery = query.trim().toLowerCase()

  const filteredDrafts = useMemo(() => {
    if (!normalizedQuery) return drafts
    return drafts.filter((draft) => {
      const title = draft.resumeTitle.toLowerCase()
      const slug = draft.slug?.toLowerCase() ?? ''
      if (title.includes(normalizedQuery) || slug.includes(normalizedQuery)) {
        return true
      }
      return draft.labelIds.some((lid) => {
        const label = labelsById[lid]
        return label && label.name.toLowerCase().includes(normalizedQuery)
      })
    })
  }, [drafts, normalizedQuery, labelsById])

  const published = filteredDrafts.filter((d) => d.isPublished)
  const draftsOnly = filteredDrafts.filter((d) => !d.isPublished)
  const hasQuery = normalizedQuery.length > 0

  useEffect(() => {
    // Auto-focus search on mount
    const timer = setTimeout(() => searchRef.current?.focus(), 0)
    return () => clearTimeout(timer)
  }, [])

  const renderItem = (draft: ResumeDraft) => {
    const isActive = draft.draftId === activeDraftId
    return (
      <div
        key={draft.draftId}
        className={cn(
          'hover:bg-muted/60 rounded-md px-2 py-1.5 transition-colors',
          isActive && 'bg-emerald-500/5'
        )}
      >
        <button
          type="button"
          className="flex w-full items-center gap-2 text-left"
          onClick={() => onOpenDraft(draft.draftId)}
          aria-label={`Open ${draft.resumeTitle || 'Untitled Resume'}`}
        >
          <span
            className={cn(
              'size-1.5 shrink-0 rounded-full',
              draft.isPublished
                ? 'bg-emerald-500'
                : 'bg-slate-300 dark:bg-slate-600'
            )}
          />
          <span className="min-w-0 flex-1 truncate text-sm">
            {draft.resumeTitle || 'Untitled Resume'}
          </span>
          {draft.labelIds.length > 0 ? (
            <span className="flex shrink-0 items-center gap-0.5">
              {draft.labelIds.slice(0, 3).map((lid) => {
                const label = labelsById[lid]
                return label ? <LabelDot key={lid} color={label.color} /> : null
              })}
            </span>
          ) : null}
          <span className="text-muted-foreground shrink-0 text-[11px]">
            {formatUpdatedAt(draft.updatedAt)}
          </span>
          {isActive ? (
            <CheckCircleIcon
              size={14}
              weight="fill"
              className="text-primary shrink-0"
            />
          ) : null}
        </button>
        {draft.id ? (
          <div className="mt-1 pl-3.5">
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className="text-muted-foreground h-5 gap-1 px-1.5 text-[11px]"
              onClick={() => onOpenPublicLink(draft)}
              aria-label={`Open public link for ${draft.resumeTitle || 'Untitled Resume'}`}
            >
              <ArrowSquareOutIcon size={10} />
              Public link
            </Button>
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div className={cn('flex h-full flex-col', className)}>
      {/* Search */}
      <div className="border-border border-b p-3">
        <div className="relative">
          <MagnifyingGlassIcon
            size={14}
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2"
          />
          <Input
            ref={searchRef}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search resumes..."
            className="pl-8"
            aria-label="Search resumes"
          />
        </div>
      </div>

      {/* Body */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {filteredDrafts.length === 0 ? (
          <div className="text-muted-foreground px-2 py-8 text-center text-sm">
            No resumes match your search.
          </div>
        ) : hasQuery ? (
          /* Flat filtered list when searching */
          <div className="space-y-0.5 p-1.5">
            {filteredDrafts.map(renderItem)}
          </div>
        ) : (
          /* Grouped by status */
          <>
            {published.length > 0 ? (
              <div className="p-1.5">
                <p className="text-muted-foreground flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold tracking-widest uppercase">
                  <GlobeIcon size={10} />
                  Published ({published.length})
                </p>
                <div className="space-y-0.5">{published.map(renderItem)}</div>
              </div>
            ) : null}

            {published.length > 0 && draftsOnly.length > 0 ? (
              <div className="border-border/40 mx-2 border-t" />
            ) : null}

            {draftsOnly.length > 0 ? (
              <div className="p-1.5">
                <p className="text-muted-foreground flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold tracking-widest uppercase">
                  <PencilSimpleLineIcon size={10} />
                  Drafts ({draftsOnly.length})
                </p>
                <div className="space-y-0.5">{draftsOnly.map(renderItem)}</div>
              </div>
            ) : null}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-border/40 flex items-center gap-2 border-t px-3 py-2">
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="text-primary gap-1"
          onClick={onCreateDraft}
          aria-label="Create new resume"
        >
          <PlusIcon size={11} weight="bold" />
          New
        </Button>
        <div className="flex-1" />
        <Link
          href="/resumes"
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'xs' }),
            'text-muted-foreground'
          )}
          onClick={onClose}
        >
          Library
        </Link>
      </div>
    </div>
  )
}

export default function ResumeSwitcher() {
  const router = useRouter()
  const { modifierKey } = usePlatformShortcuts()
  const [desktopOpen, setDesktopOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const draftOrder = useResumeStore((state) => state.draftOrder)
  const draftsById = useResumeStore((state) => state.draftsById)
  const activeDraftId = useResumeStore((state) => state.activeDraftId)
  const setActiveDraft = useResumeStore((state) => state.setActiveDraft)
  const createDraft = useResumeStore((state) => state.createDraft)

  const drafts = useMemo(() => {
    const unsorted = draftOrder
      .map((draftId) => draftsById[draftId])
      .filter((draft): draft is ResumeDraft => Boolean(draft))
    return sortDrafts(unsorted)
  }, [draftOrder, draftsById])

  const activeDraft = drafts.find((d) => d.draftId === activeDraftId)

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setDesktopOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

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
    setActiveDraft(draftId)
    router.push(`/edit/${draftId}`)
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
            <button
              {...props}
              type="button"
              className={cn(
                'border-border/60 bg-background hover:bg-muted/40 hidden h-8 items-center gap-1.5 rounded-md border px-2 text-sm transition-all sm:inline-flex',
                desktopOpen && 'border-primary/40 bg-muted/30'
              )}
              aria-label="Switch resumes"
            >
              <StackIcon size={14} className="text-muted-foreground" />
              <span className="max-w-[120px] truncate font-medium">
                {activeDraft?.resumeTitle || 'Resumes'}
              </span>
              <span className="bg-muted text-muted-foreground ml-0.5 flex size-5 items-center justify-center rounded text-[10px] font-bold">
                {drafts.length}
              </span>
              <Kbd className="ml-1 hidden lg:inline-flex">
                {modifierKey === 'Cmd' ? '⌘' : 'Ctrl'}
              </Kbd>
              <Kbd className="hidden lg:inline-flex">K</Kbd>
              <CaretDownIcon
                size={10}
                className={cn(
                  'text-muted-foreground transition-transform',
                  desktopOpen && 'rotate-180'
                )}
              />
            </button>
          )}
        />
        <PopoverContent className="hidden w-[22rem] p-0 sm:flex sm:flex-col">
          <SwitcherList
            drafts={drafts}
            activeDraftId={activeDraftId}
            query={query}
            onQueryChange={setQuery}
            onOpenDraft={handleOpenDraft}
            onOpenPublicLink={handleOpenPublicLink}
            onCreateDraft={handleCreateDraft}
            onClose={closeMenus}
          />
        </PopoverContent>
      </Popover>

      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogTrigger
          render={(props) => (
            <button
              {...props}
              type="button"
              className={cn(
                'border-border/60 bg-background hover:bg-muted/40 inline-flex h-8 items-center gap-1.5 rounded-md border px-2 text-sm transition-all sm:hidden',
                mobileOpen && 'border-primary/40 bg-muted/30'
              )}
              aria-label="Switch resumes"
            >
              <StackIcon size={14} className="text-muted-foreground" />
              <span className="max-w-[120px] truncate font-medium">
                {activeDraft?.resumeTitle || 'Resumes'}
              </span>
              <span className="bg-muted text-muted-foreground ml-0.5 flex size-5 items-center justify-center rounded text-[10px] font-bold">
                {drafts.length}
              </span>
              <CaretDownIcon
                size={10}
                className={cn(
                  'text-muted-foreground transition-transform',
                  mobileOpen && 'rotate-180'
                )}
              />
            </button>
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
            onOpenPublicLink={handleOpenPublicLink}
            onCreateDraft={handleCreateDraft}
            onClose={closeMenus}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
