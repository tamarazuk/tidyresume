'use client'

import { useSyncExternalStore } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_RESUME } from '@/components/editor/constants'
import { DEFAULT_RESUME_TITLE } from '@/lib/constants'
import type { ResumeId, ResumeSlug } from '@/lib/resume-types'

type SaveStatus = 'saved' | 'saving' | 'unsaved'

const MAX_MARKDOWN_LENGTH = 3_000_000
const CONTENT_TOO_LARGE_WARNING = 'Content too large to store'

interface ResumeState {
  id: ResumeId | null
  slug: ResumeSlug
  deleteSecret: string | null
  resumeTitle: string
  markdown: string
  saveStatus: SaveStatus
  syncStatus: 'synced' | 'syncing' | 'error' | 'unsaved'
  isPublished: boolean
  imageWarning: string | null
  contentWarning: string | null
  setResumeTitle: (resumeTitle: string) => void
  setMarkdown: (markdown: string) => void
  setSaveStatus: (saveStatus: SaveStatus) => void
  setSyncStatus: (
    syncStatus: 'synced' | 'syncing' | 'error' | 'unsaved'
  ) => void
  setId: (id: ResumeId | null) => void
  setSlug: (slug: ResumeSlug) => void
  setDeleteSecret: (deleteSecret: string | null) => void
  setIsPublished: (isPublished: boolean) => void
  setImageWarning: (imageWarning: string | null) => void
  setContentWarning: (contentWarning: string | null) => void
  unpublish: () => void
  resetResume: () => void
}

const createSaveStatusDebouncer = (
  set: (partial: Partial<ResumeState>) => void
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return () => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      set({ saveStatus: 'saved' })
    }, 500)
  }
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => {
      const scheduleSaveStatus = createSaveStatusDebouncer(set)
      return {
        id: null,
        slug: null,
        deleteSecret: null,
        resumeTitle: DEFAULT_RESUME_TITLE,
        markdown: DEFAULT_RESUME,
        saveStatus: 'saved',
        syncStatus: 'unsaved',
        isPublished: false,
        imageWarning: null,
        contentWarning: null,
        setResumeTitle: (resumeTitle) => {
          set({ resumeTitle, saveStatus: 'saving' })
          scheduleSaveStatus()
        },
        setMarkdown: (markdown) => {
          set(() => {
            const exceedsLimit = markdown.length > MAX_MARKDOWN_LENGTH
            return {
              markdown: exceedsLimit
                ? markdown.slice(0, MAX_MARKDOWN_LENGTH)
                : markdown,
              saveStatus: 'saving',
              contentWarning: exceedsLimit ? CONTENT_TOO_LARGE_WARNING : null,
            }
          })
          scheduleSaveStatus()
        },
        setSaveStatus: (saveStatus) => set({ saveStatus }),
        setSyncStatus: (syncStatus) => set({ syncStatus }),
        setId: (id) => set({ id }),
        setSlug: (slug) => set({ slug }),
        setDeleteSecret: (deleteSecret) => set({ deleteSecret }),
        setIsPublished: (isPublished) => set({ isPublished }),
        setImageWarning: (imageWarning) => set({ imageWarning }),
        setContentWarning: (contentWarning) => set({ contentWarning }),
        unpublish: () => set({ syncStatus: 'unsaved', isPublished: false }),
        resetResume: () =>
          set({
            id: null,
            slug: null,
            deleteSecret: null,
            resumeTitle: DEFAULT_RESUME_TITLE,
            markdown: '',
            saveStatus: 'saved',
            syncStatus: 'unsaved',
            isPublished: false,
            imageWarning: null,
            contentWarning: null,
          }),
      }
    },
    {
      name: 'tidyresume-editor',
      version: 4, // Bump version
      onRehydrateStorage: () => (state) => {
        state?.setSaveStatus('saved')
      },
      migrate: (persistedState) => {
        const state = persistedState as ResumeState
        return {
          ...state,
          resumeTitle: state.resumeTitle ?? 'Untitled Resume',
          markdown: state.markdown ?? DEFAULT_RESUME,
          saveStatus: state.saveStatus ?? 'saved',

          id: state.id ?? null,
          slug: state.slug ?? null,
          deleteSecret: state.deleteSecret ?? null,
          isPublished: state.isPublished ?? false,
          syncStatus: 'unsaved', // Reset to unsaved on migration
          imageWarning: state.imageWarning ?? null,
          contentWarning: state.contentWarning ?? null,
        }
      },
    }
  )
)

let hydratedSnapshot = false

export const useResumeHydrated = () => {
  return useSyncExternalStore(
    (onStoreChange) => {
      const persist = useResumeStore.persist
      if (!persist) {
        return () => {}
      }
      const notify = () => {
        hydratedSnapshot = persist.hasHydrated?.() ?? false
        onStoreChange()
      }
      const unsubscribe = persist.onFinishHydration(notify)
      if (persist.hasHydrated?.()) {
        queueMicrotask(notify)
      }
      return () => {
        unsubscribe()
      }
    },
    () => hydratedSnapshot,
    () => false
  )
}
