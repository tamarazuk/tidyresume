'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import {
  FileTextIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TagIcon,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import AppIcon from '@/icons/app-icon'
import { LabelBadge } from '@/components/labels/label-badge'
import { LabelManager } from '@/components/labels/label-manager'
import ResumeCard from '@/components/resumes/resume-card'
import ShelfRow from '@/components/resumes/shelf-row'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { deleteResume } from '@/lib/resume-api'
import { cn } from '@/lib/utils'
import { useResumeLibraryStore } from '@/hooks/use-resume-library-store'
import type { ResumeDraft } from '@/stores/resume-store'
import type { ResumeLabelId } from '@/types/resume'

type ViewMode = 'grid' | 'list'
type GroupFilter = 'all' | 'published' | 'drafts'

const VIEW_MODE_KEY = 'tidyresume:library-view'

function getStoredViewMode(): ViewMode {
  if (typeof window === 'undefined') return 'grid'
  const stored = localStorage.getItem(VIEW_MODE_KEY)
  return stored === 'list' ? 'list' : 'grid'
}

export default function ResumeLibrary() {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [view, setViewState] = useState<ViewMode>(getStoredViewMode)
  const setView = (mode: ViewMode) => {
    setViewState(mode)
    localStorage.setItem(VIEW_MODE_KEY, mode)
  }
  const [filter, setFilter] = useState<GroupFilter>('all')
  const [selectedLabelIds, setSelectedLabelIds] = useState<Set<ResumeLabelId>>(
    new Set()
  )

  const {
    draftOrder,
    draftsById,
    labelsById,
    labelOrder,
    createDraft,
    setActiveDraft,
    deleteDraft,
    duplicateDraft,
  } = useResumeLibraryStore()

  const allLabels = useMemo(
    () => labelOrder.map((id) => labelsById[id]).filter(Boolean),
    [labelOrder, labelsById]
  )

  const toggleLabelFilter = (labelId: ResumeLabelId) => {
    setSelectedLabelIds((prev) => {
      const next = new Set(prev)
      if (next.has(labelId)) {
        next.delete(labelId)
      } else {
        next.add(labelId)
      }
      return next
    })
  }

  const allDrafts = useMemo(
    () =>
      draftOrder
        .map((id) => draftsById[id])
        .filter((draft): draft is ResumeDraft => Boolean(draft))
        .sort((a, b) => b.updatedAt - a.updatedAt),
    [draftOrder, draftsById]
  )

  const filtered = useMemo(() => {
    let result = allDrafts
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter((d) => {
        if (d.resumeTitle.toLowerCase().includes(q)) return true
        return d.labelIds.some((lid) => {
          const label = labelsById[lid]
          return label && label.name.toLowerCase().includes(q)
        })
      })
    }
    if (filter === 'published') result = result.filter((d) => d.isPublished)
    if (filter === 'drafts') result = result.filter((d) => !d.isPublished)
    if (selectedLabelIds.size > 0) {
      result = result.filter((d) =>
        d.labelIds.some((lid) => selectedLabelIds.has(lid))
      )
    }
    return result
  }, [allDrafts, query, filter, selectedLabelIds, labelsById])

  const published = filtered.filter((d) => d.isPublished)
  const draftsOnly = filtered.filter((d) => !d.isPublished)

  const filterOptions: { value: GroupFilter; label: string; count: number }[] =
    [
      { value: 'all', label: 'All', count: allDrafts.length },
      {
        value: 'published',
        label: 'Published',
        count: allDrafts.filter((d) => d.isPublished).length,
      },
      {
        value: 'drafts',
        label: 'Local Drafts',
        count: allDrafts.filter((d) => !d.isPublished).length,
      },
    ]

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

  const renderGridContent = () => (
    <div className="space-y-8">
      {published.length > 0 && filter !== 'drafts' ? (
        <section>
          {filter === 'all' ? (
            <div className="mb-3 flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <h2 className="text-foreground text-sm font-semibold">
                Published
              </h2>
              <span className="text-muted-foreground text-xs">
                ({published.length})
              </span>
            </div>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {published.map((d) => (
              <ResumeCard
                key={d.draftId}
                draft={d}
                onOpen={() => handleOpen(d.draftId)}
                onDuplicate={() => handleDuplicate(d.draftId)}
                onDelete={() => handleDelete(d.draftId)}
              />
            ))}
          </div>
        </section>
      ) : null}

      {draftsOnly.length > 0 && filter !== 'published' ? (
        <section>
          {filter === 'all' ? (
            <div className="mb-3 flex items-center gap-2">
              <span className="size-2 rounded-full bg-slate-300 dark:bg-slate-600" />
              <h2 className="text-foreground text-sm font-semibold">
                Local Drafts
              </h2>
              <span className="text-muted-foreground text-xs">
                ({draftsOnly.length})
              </span>
            </div>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {draftsOnly.map((d) => (
              <ResumeCard
                key={d.draftId}
                draft={d}
                onOpen={() => handleOpen(d.draftId)}
                onDuplicate={() => handleDuplicate(d.draftId)}
                onDelete={() => handleDelete(d.draftId)}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )

  const renderListContent = () => (
    <div className="space-y-8">
      {published.length > 0 && filter !== 'drafts' ? (
        <section>
          {filter === 'all' ? (
            <div className="mb-3 flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <h2 className="text-foreground text-sm font-semibold">
                Published
              </h2>
              <span className="text-muted-foreground text-xs">
                ({published.length})
              </span>
            </div>
          ) : null}
          <div className="flex flex-col gap-3">
            {published.map((d) => (
              <ShelfRow
                key={d.draftId}
                draft={d}
                onOpen={() => handleOpen(d.draftId)}
                onDuplicate={() => handleDuplicate(d.draftId)}
                onDelete={() => handleDelete(d.draftId)}
              />
            ))}
          </div>
        </section>
      ) : null}

      {draftsOnly.length > 0 && filter !== 'published' ? (
        <section>
          {filter === 'all' ? (
            <div className="mb-3 flex items-center gap-2">
              <span className="size-2 rounded-full bg-slate-300 dark:bg-slate-600" />
              <h2 className="text-foreground text-sm font-semibold">
                Local Drafts
              </h2>
              <span className="text-muted-foreground text-xs">
                ({draftsOnly.length})
              </span>
            </div>
          ) : null}
          <div className="flex flex-col gap-3">
            {draftsOnly.map((d) => (
              <ShelfRow
                key={d.draftId}
                draft={d}
                onOpen={() => handleOpen(d.draftId)}
                onDuplicate={() => handleDuplicate(d.draftId)}
                onDelete={() => handleDelete(d.draftId)}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )

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
          <h1 className="font-heading text-2xl font-semibold">
            Resume Library
          </h1>
          <p className="text-muted-foreground text-sm">
            {allDrafts.length} resume{allDrafts.length === 1 ? '' : 's'} —
            browser-stored until published.
          </p>
        </section>

        {/* Toolbar: filters + search + view toggle */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Filter pills */}
          <div className="bg-muted/50 flex gap-0.5 rounded-lg p-0.5">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFilter(opt.value)}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                  filter === opt.value
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {opt.label}
                <span
                  className={cn(
                    'flex size-5 items-center justify-center rounded text-[10px]',
                    filter === opt.value
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted'
                  )}
                >
                  {opt.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Labels management */}
            <LabelManager>
              <Button variant="outline" size="sm" className="gap-1">
                <TagIcon size={14} />
                Labels
              </Button>
            </LabelManager>

            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon
                size={14}
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2"
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-48 pl-8"
                aria-label="Search resumes"
              />
            </div>

            {/* View toggle */}
            <div className="border-border/60 flex overflow-hidden rounded-md border">
              <button
                type="button"
                onClick={() => setView('grid')}
                className={cn(
                  'flex size-8 items-center justify-center text-sm transition-colors',
                  view === 'grid'
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted/50'
                )}
                aria-label="Grid view"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="stroke-current"
                >
                  <rect
                    x="1"
                    y="1"
                    width="5"
                    height="5"
                    rx="1"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="8"
                    y="1"
                    width="5"
                    height="5"
                    rx="1"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="1"
                    y="8"
                    width="5"
                    height="5"
                    rx="1"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="8"
                    y="8"
                    width="5"
                    height="5"
                    rx="1"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setView('list')}
                className={cn(
                  'flex size-8 items-center justify-center text-sm transition-colors',
                  view === 'list'
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted/50'
                )}
                aria-label="List view"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="stroke-current"
                >
                  <line
                    x1="1"
                    y1="3"
                    x2="13"
                    y2="3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="1"
                    y1="7"
                    x2="13"
                    y2="7"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="1"
                    y1="11"
                    x2="13"
                    y2="11"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Label filter chips */}
        {allLabels.length > 0 ? (
          <div
            className="flex flex-wrap gap-1.5"
            data-testid="label-filter-chips"
          >
            {allLabels.map((label) => (
              <LabelBadge
                key={label.id}
                name={label.name}
                color={label.color}
                selected={selectedLabelIds.has(label.id)}
                onClick={() => toggleLabelFilter(label.id)}
              />
            ))}
          </div>
        ) : null}

        {/* Content */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <FileTextIcon
              size={44}
              className="text-muted-foreground/30 mx-auto mb-3"
            />
            <p className="text-muted-foreground text-sm">
              {query || filter !== 'all' || selectedLabelIds.size > 0
                ? 'No resumes match your criteria.'
                : 'No resumes yet.'}
            </p>
            {!query && filter === 'all' && selectedLabelIds.size === 0 ? (
              <Button
                onClick={handleNewResume}
                className="mt-3 gap-2"
                size="sm"
              >
                <PlusIcon size={14} weight="bold" />
                Create first resume
              </Button>
            ) : null}
          </div>
        ) : view === 'grid' ? (
          renderGridContent()
        ) : (
          renderListContent()
        )}

        {/* Footer */}
        <div className="text-muted-foreground text-xs">
          Showing {filtered.length} of {allDrafts.length} resumes.
          {isDeleting ? ' Deleting resume...' : ''}
        </div>
      </main>
    </div>
  )
}
