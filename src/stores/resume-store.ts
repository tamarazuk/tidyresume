'use client'

import { useSyncExternalStore } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_RESUME } from '@/components/editor/constants'
import { DEFAULT_RESUME_TITLE } from '@/lib/constants'
import { DEFAULT_RESUME_THEME } from '@/lib/resume-theme'
import type {
  ResumeAccent,
  ResumeId,
  ResumeSlug,
  ResumeThemeSettings,
} from '@/lib/resume-types'

type SaveStatus = 'saved' | 'saving' | 'unsaved'
export type ResumeThemeMode = 'auto' | 'light' | 'dark'

export interface ResumeDisplaySettings {
  themeMode: ResumeThemeMode
  theme: ResumeThemeSettings
}

const MAX_MARKDOWN_LENGTH = 3_000_000
const CONTENT_TOO_LARGE_WARNING = 'Content too large to store'

const resolveThemeDefaults = (
  theme?: ResumeThemeSettings | null
): ResumeThemeSettings => ({
  ...DEFAULT_RESUME_THEME,
  ...theme,
  typography: {
    ...DEFAULT_RESUME_THEME.typography,
    ...(theme?.typography ?? {}),
  },
})

interface ResumeState {
  id: ResumeId | null
  slug: ResumeSlug
  editSecret: string | null
  resumeTitle: string
  markdown: string
  saveStatus: SaveStatus
  syncStatus: 'synced' | 'syncing' | 'error' | 'unsaved'
  isPublished: boolean
  imageWarning: string | null
  contentWarning: string | null
  resumeDisplay: ResumeDisplaySettings
  setResumeTitle: (resumeTitle: string) => void
  setResumeThemeMode: (themeMode: ResumeThemeMode) => void
  setResumeAccent: (accent: ResumeAccent) => void
  setResumeTheme: (theme: ResumeThemeSettings) => void
  setMarkdown: (markdown: string) => void
  setSaveStatus: (saveStatus: SaveStatus) => void
  setSyncStatus: (
    syncStatus: 'synced' | 'syncing' | 'error' | 'unsaved'
  ) => void
  setId: (id: ResumeId | null) => void
  setSlug: (slug: ResumeSlug) => void
  setEditSecret: (editSecret: string | null) => void
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
        editSecret: null,
        resumeTitle: DEFAULT_RESUME_TITLE,
        markdown: DEFAULT_RESUME,
        saveStatus: 'saved',
        syncStatus: 'unsaved',
        isPublished: false,
        imageWarning: null,
        contentWarning: null,
        resumeDisplay: {
          themeMode: 'auto',
          theme: resolveThemeDefaults(),
        },
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
        setEditSecret: (editSecret) => set({ editSecret }),
        setIsPublished: (isPublished) => set({ isPublished }),
        setImageWarning: (imageWarning) => set({ imageWarning }),
        setContentWarning: (contentWarning) => set({ contentWarning }),
        setResumeThemeMode: (themeMode) =>
          set((state) => ({
            resumeDisplay: {
              ...state.resumeDisplay,
              themeMode,
            },
          })),
        setResumeTheme: (theme) => {
          set((state) => ({
            resumeDisplay: {
              ...state.resumeDisplay,
              theme: resolveThemeDefaults(theme),
            },
            saveStatus: 'saving',
          }))
          scheduleSaveStatus()
        },
        setResumeAccent: (accent) => {
          set((state) => ({
            resumeDisplay: {
              ...state.resumeDisplay,
              theme: {
                ...state.resumeDisplay.theme,
                accent,
              },
            },
            saveStatus: 'saving',
          }))
          scheduleSaveStatus()
        },
        unpublish: () =>
          set({
            syncStatus: 'unsaved',
            isPublished: false,
            id: null,
            editSecret: null,
          }),
        resetResume: () =>
          set({
            id: null,
            slug: null,
            editSecret: null,
            resumeTitle: DEFAULT_RESUME_TITLE,
            markdown: '',
            saveStatus: 'saved',
            syncStatus: 'unsaved',
            isPublished: false,
            imageWarning: null,
            contentWarning: null,
            resumeDisplay: {
              themeMode: 'auto',
              theme: resolveThemeDefaults(),
            },
          }),
      }
    },
    {
      name: 'tidyresume-editor',
      version: 7, // Bump version
      onRehydrateStorage: () => (state) => {
        state?.setSaveStatus('saved')
      },
      migrate: (persistedState) => {
        const state = persistedState as ResumeState
        const storedTheme = resolveThemeDefaults(state.resumeDisplay?.theme)
        return {
          ...state,
          resumeTitle: state.resumeTitle ?? 'Untitled Resume',
          markdown: state.markdown ?? DEFAULT_RESUME,
          saveStatus: state.saveStatus ?? 'saved',

          id: state.id ?? null,
          slug: state.slug ?? null,
          editSecret: state.editSecret ?? null,
          isPublished: state.isPublished ?? false,
          syncStatus: 'unsaved', // Reset to unsaved on migration
          imageWarning: state.imageWarning ?? null,
          contentWarning: state.contentWarning ?? null,
          resumeDisplay: {
            themeMode: state.resumeDisplay?.themeMode ?? 'auto',
            theme: storedTheme,
          },
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
