'use client'

import { useSyncExternalStore } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_RESUME } from '@/components/editor/constants'
import { DEFAULT_RESUME_TITLE } from '@/lib/constants'
import {
  DEFAULT_RESUME_THEME,
  normalizeResumeMargins,
} from '@/lib/resume-theme'
import {
  RESUME_BODY_LETTER_SPACING_VALUES,
  RESUME_BODY_LINE_HEIGHT_VALUES,
} from '@/types/resume'
import type {
  ResumeAccent,
  ResumeBodySize,
  ResumeBodyLineHeight,
  ResumeBodyLetterSpacing,
  ResumeHeadingSize,
  ResumeId,
  ResumeSlug,
  ResumeThemeSettings,
} from '@/types/resume'

type SaveStatus = 'saved' | 'saving' | 'unsaved'
export type ResumeThemeMode = 'auto' | 'light' | 'dark'

export interface ResumeDisplaySettings {
  themeMode: ResumeThemeMode
  theme: ResumeThemeSettings
}

const MAX_MARKDOWN_LENGTH = 3_000_000
const CONTENT_TOO_LARGE_WARNING = 'Content too large to store'
const RESUME_BODY_LINE_HEIGHT_VALUE_SET: ReadonlySet<ResumeBodyLineHeight> =
  new Set(RESUME_BODY_LINE_HEIGHT_VALUES)
const RESUME_BODY_LETTER_SPACING_VALUE_SET: ReadonlySet<ResumeBodyLetterSpacing> =
  new Set(RESUME_BODY_LETTER_SPACING_VALUES)

// Normalize legacy size values from persisted themes.
const normalizeResumeHeadingSize = (value: unknown): ResumeHeadingSize => {
  if (value === 'xs' || value === 'xl') return value
  if (value === 'sm' || value === 'md' || value === 'lg') return value
  if (value === '14') return 'sm'
  if (value === '15') return 'md'
  if (value === '16') return 'lg'
  return DEFAULT_RESUME_THEME.typography?.headingSize ?? 'md'
}

// Normalize legacy size values from persisted themes.
const normalizeResumeBodySize = (value: unknown): ResumeBodySize => {
  if (
    value === '10' ||
    value === '11' ||
    value === '12' ||
    value === '13'
  ) {
    return value
  }
  if (value === '14' || value === '15' || value === '16') return value
  if (value === 'sm') return '14'
  if (value === 'md') return '15'
  if (value === 'lg') return '16'
  return DEFAULT_RESUME_THEME.typography?.bodySize ?? '15'
}

const normalizeResumeBodyLineHeight = (
  value: unknown
): ResumeBodyLineHeight => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    const candidate = value.toFixed(1)
    if (RESUME_BODY_LINE_HEIGHT_VALUE_SET.has(candidate as ResumeBodyLineHeight)) {
      return candidate as ResumeBodyLineHeight
    }
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (RESUME_BODY_LINE_HEIGHT_VALUE_SET.has(trimmed as ResumeBodyLineHeight)) {
      return trimmed as ResumeBodyLineHeight
    }
  }
  return DEFAULT_RESUME_THEME.typography?.bodyLineHeight ?? '1.6'
}

const normalizeResumeBodyLetterSpacing = (
  value: unknown
): ResumeBodyLetterSpacing => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    const candidate = `${value}em`
    if (RESUME_BODY_LETTER_SPACING_VALUE_SET.has(candidate as ResumeBodyLetterSpacing)) {
      return candidate as ResumeBodyLetterSpacing
    }
    if (value === 0) return '0'
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (RESUME_BODY_LETTER_SPACING_VALUE_SET.has(trimmed as ResumeBodyLetterSpacing)) {
      return trimmed as ResumeBodyLetterSpacing
    }
  }
  return DEFAULT_RESUME_THEME.typography?.bodyLetterSpacing ?? '0'
}

const resolveThemeDefaults = (
  theme?: ResumeThemeSettings | null
): ResumeThemeSettings => {
  const typography = {
    ...DEFAULT_RESUME_THEME.typography,
    ...(theme?.typography ?? {}),
  }
  return {
    ...DEFAULT_RESUME_THEME,
    ...theme,
    typography: {
      ...typography,
      headingSize: normalizeResumeHeadingSize(typography.headingSize),
      bodySize: normalizeResumeBodySize(typography.bodySize),
      bodyLineHeight: normalizeResumeBodyLineHeight(typography.bodyLineHeight),
      bodyLetterSpacing: normalizeResumeBodyLetterSpacing(
        typography.bodyLetterSpacing
      ),
    },
    margins: normalizeResumeMargins(theme?.margins),
  }
}

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
              theme: resolveThemeDefaults({
                ...state.resumeDisplay.theme,
                ...theme,
                typography: {
                  ...state.resumeDisplay.theme.typography,
                  ...theme.typography,
                },
                margins: theme.margins
                  ? { ...state.resumeDisplay.theme.margins, ...theme.margins }
                  : state.resumeDisplay.theme.margins,
              }),
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
      version: 8,
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
