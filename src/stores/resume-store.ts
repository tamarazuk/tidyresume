'use client'

import { useSyncExternalStore } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_RESUME } from '@/components/editor/constants'
import { DEFAULT_RESUME_TITLE } from '@/lib/constants'
import { DEFAULT_RESUME_THEME } from '@/lib/resume-theme'
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
type SyncStatus = 'synced' | 'syncing' | 'error' | 'unsaved'
export type ResumeThemeMode = 'auto' | 'light' | 'dark'

export interface ResumeDisplaySettings {
  themeMode: ResumeThemeMode
  theme: ResumeThemeSettings
}

interface ResumeEntry {
  localId: string
  id: ResumeId | null
  slug: ResumeSlug
  editSecret: string | null
  resumeTitle: string
  markdown: string
  saveStatus: SaveStatus
  syncStatus: SyncStatus
  isPublished: boolean
  imageWarning: string | null
  contentWarning: string | null
  resumeDisplay: ResumeDisplaySettings
  lastOpenedAt: number
  lastUpdatedAt: number
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
  }
}

const createLocalId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const normalizeResumeDisplay = (
  display?: Partial<ResumeDisplaySettings> | null
): ResumeDisplaySettings => {
  return {
    themeMode: display?.themeMode ?? 'auto',
    theme: resolveThemeDefaults(display?.theme ?? null),
  }
}

const normalizeResumeEntry = (
  entry: Partial<ResumeEntry>,
  fallbackLocalId: string,
  now: number
): ResumeEntry => {
  return {
    localId: entry.localId ?? fallbackLocalId,
    id: entry.id ?? null,
    slug: entry.slug ?? null,
    editSecret: entry.editSecret ?? null,
    resumeTitle: entry.resumeTitle ?? DEFAULT_RESUME_TITLE,
    markdown: entry.markdown ?? DEFAULT_RESUME,
    saveStatus: entry.saveStatus ?? 'saved',
    syncStatus: entry.syncStatus ?? 'unsaved',
    isPublished: entry.isPublished ?? false,
    imageWarning: entry.imageWarning ?? null,
    contentWarning: entry.contentWarning ?? null,
    resumeDisplay: normalizeResumeDisplay(entry.resumeDisplay),
    lastOpenedAt: entry.lastOpenedAt ?? now,
    lastUpdatedAt: entry.lastUpdatedAt ?? now,
  }
}

const pickMostRecentResume = (resumes: ResumeEntry[]) => {
  if (resumes.length === 0) return null
  return resumes.reduce((latest, resume) => {
    if (!latest) return resume
    return (resume.lastOpenedAt ?? 0) > (latest.lastOpenedAt ?? 0)
      ? resume
      : latest
  }, resumes[0] ?? null)
}

interface ResumeState {
  localId: string
  resumes: ResumeEntry[]
  id: ResumeId | null
  slug: ResumeSlug
  editSecret: string | null
  resumeTitle: string
  markdown: string
  saveStatus: SaveStatus
  syncStatus: SyncStatus
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
  setSyncStatus: (syncStatus: SyncStatus) => void
  setId: (id: ResumeId | null) => void
  setSlug: (slug: ResumeSlug) => void
  setEditSecret: (editSecret: string | null) => void
  setIsPublished: (isPublished: boolean) => void
  setImageWarning: (imageWarning: string | null) => void
  setContentWarning: (contentWarning: string | null) => void
  unpublish: () => void
  unpublishById: (id: ResumeId) => void
  hasResumeId: (id: ResumeId) => boolean
  setActiveResumeById: (id: ResumeId) => void
  setActiveResumeByLocalId: (localId: string) => void
  touchActiveResume: () => void
  loadResumeFromRemote: (resume: {
    id: ResumeId
    slug: ResumeSlug
    title: string
    content: string
    editSecret?: string | null
    theme?: ResumeThemeSettings | null
  }) => void
  resetResume: () => void
}

type ResumeEntryUpdate = Partial<
  Omit<ResumeEntry, 'localId' | 'lastOpenedAt' | 'lastUpdatedAt'>
>

const buildResumeEntryFromState = (
  state: ResumeState,
  localId: string,
  now: number
): ResumeEntry => {
  return normalizeResumeEntry(
    {
      localId,
      id: state.id,
      slug: state.slug,
      editSecret: state.editSecret,
      resumeTitle: state.resumeTitle,
      markdown: state.markdown,
      saveStatus: state.saveStatus,
      syncStatus: state.syncStatus,
      isPublished: state.isPublished,
      imageWarning: state.imageWarning,
      contentWarning: state.contentWarning,
      resumeDisplay: state.resumeDisplay,
    },
    localId,
    now
  )
}

const updateResumeEntry = (
  current: ResumeEntry,
  updates: ResumeEntryUpdate,
  now: number,
  options: { updateOpenedAt?: boolean; updateUpdatedAt?: boolean } = {}
): ResumeEntry => {
  const nextDisplay = updates.resumeDisplay
    ? normalizeResumeDisplay({
        ...current.resumeDisplay,
        ...updates.resumeDisplay,
        theme: updates.resumeDisplay.theme ?? current.resumeDisplay.theme,
      })
    : current.resumeDisplay

  return {
    ...current,
    ...updates,
    resumeDisplay: nextDisplay,
    lastOpenedAt: options.updateOpenedAt ? now : current.lastOpenedAt,
    lastUpdatedAt:
      options.updateUpdatedAt === false ? current.lastUpdatedAt : now,
  }
}

const upsertResumeEntry = (
  resumes: ResumeEntry[],
  entry: ResumeEntry
): ResumeEntry[] => {
  const index = resumes.findIndex((resume) => resume.localId === entry.localId)
  if (index === -1) {
    return [entry, ...resumes]
  }
  const next = resumes.slice()
  next[index] = entry
  return next
}

const applyActiveResumeUpdate = (
  state: ResumeState,
  updates: ResumeEntryUpdate,
  options: { updateOpenedAt?: boolean; updateUpdatedAt?: boolean } = {}
): Partial<ResumeState> => {
  const now = Date.now()
  const localId = state.localId || createLocalId()
  const currentEntry =
    state.resumes.find((resume) => resume.localId === localId) ??
    buildResumeEntryFromState(state, localId, now)

  const nextEntry = updateResumeEntry(currentEntry, updates, now, options)

  return {
    ...updates,
    resumeDisplay: nextEntry.resumeDisplay,
    localId,
    resumes: upsertResumeEntry(state.resumes, nextEntry),
  }
}
const createSaveStatusDebouncer = (
  set: (partial: Partial<ResumeState>) => void
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return () => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      set((state) =>
        applyActiveResumeUpdate(
          state,
          { saveStatus: 'saved' },
          { updateUpdatedAt: false }
        )
      )
    }, 500)
  }
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => {
      const scheduleSaveStatus = createSaveStatusDebouncer(set)
      const now = Date.now()
      const localId = createLocalId()
      const baseEntry = normalizeResumeEntry(
        {
          localId,
          resumeTitle: DEFAULT_RESUME_TITLE,
          markdown: DEFAULT_RESUME,
          resumeDisplay: {
            themeMode: 'auto',
            theme: resolveThemeDefaults(),
          },
        },
        localId,
        now
      )
      return {
        localId: baseEntry.localId,
        resumes: [baseEntry],
        id: baseEntry.id,
        slug: baseEntry.slug,
        editSecret: baseEntry.editSecret,
        resumeTitle: baseEntry.resumeTitle,
        markdown: baseEntry.markdown,
        saveStatus: baseEntry.saveStatus,
        syncStatus: baseEntry.syncStatus,
        isPublished: baseEntry.isPublished,
        imageWarning: baseEntry.imageWarning,
        contentWarning: baseEntry.contentWarning,
        resumeDisplay: baseEntry.resumeDisplay,
        setResumeTitle: (resumeTitle) => {
          set((state) =>
            applyActiveResumeUpdate(state, {
              resumeTitle,
              saveStatus: 'saving',
            })
          )
          scheduleSaveStatus()
        },
        setMarkdown: (markdown) => {
          set((state) => {
            const exceedsLimit = markdown.length > MAX_MARKDOWN_LENGTH
            return applyActiveResumeUpdate(state, {
              markdown: exceedsLimit
                ? markdown.slice(0, MAX_MARKDOWN_LENGTH)
                : markdown,
              saveStatus: 'saving',
              contentWarning: exceedsLimit ? CONTENT_TOO_LARGE_WARNING : null,
            })
          })
          scheduleSaveStatus()
        },
        setSaveStatus: (saveStatus) =>
          set((state) =>
            applyActiveResumeUpdate(
              state,
              { saveStatus },
              { updateUpdatedAt: false }
            )
          ),
        setSyncStatus: (syncStatus) =>
          set((state) =>
            applyActiveResumeUpdate(
              state,
              { syncStatus },
              { updateUpdatedAt: false }
            )
          ),
        setId: (id) =>
          set((state) =>
            applyActiveResumeUpdate(state, { id }, { updateUpdatedAt: false })
          ),
        setSlug: (slug) =>
          set((state) => applyActiveResumeUpdate(state, { slug })),
        setEditSecret: (editSecret) =>
          set((state) =>
            applyActiveResumeUpdate(
              state,
              { editSecret },
              { updateUpdatedAt: false }
            )
          ),
        setIsPublished: (isPublished) =>
          set((state) =>
            applyActiveResumeUpdate(
              state,
              { isPublished },
              { updateUpdatedAt: false }
            )
          ),
        setImageWarning: (imageWarning) =>
          set((state) =>
            applyActiveResumeUpdate(
              state,
              { imageWarning },
              { updateUpdatedAt: false }
            )
          ),
        setContentWarning: (contentWarning) =>
          set((state) =>
            applyActiveResumeUpdate(
              state,
              { contentWarning },
              { updateUpdatedAt: false }
            )
          ),
        setResumeThemeMode: (themeMode) =>
          set((state) =>
            applyActiveResumeUpdate(
              state,
              {
                resumeDisplay: {
                  ...state.resumeDisplay,
                  themeMode,
                },
              },
              { updateUpdatedAt: false }
            )
          ),
        setResumeTheme: (theme) => {
          set((state) =>
            applyActiveResumeUpdate(state, {
              resumeDisplay: {
                ...state.resumeDisplay,
                theme: resolveThemeDefaults({
                  ...state.resumeDisplay.theme,
                  ...theme,
                  typography: {
                    ...state.resumeDisplay.theme.typography,
                    ...theme.typography,
                  },
                }),
              },
              saveStatus: 'saving',
            })
          )
          scheduleSaveStatus()
        },
        setResumeAccent: (accent) => {
          set((state) =>
            applyActiveResumeUpdate(state, {
              resumeDisplay: {
                ...state.resumeDisplay,
                theme: {
                  ...state.resumeDisplay.theme,
                  accent,
                },
              },
              saveStatus: 'saving',
            })
          )
          scheduleSaveStatus()
        },
        unpublish: () =>
          set((state) =>
            applyActiveResumeUpdate(
              state,
              {
                syncStatus: 'unsaved',
                isPublished: false,
                id: null,
                editSecret: null,
              },
              { updateUpdatedAt: false }
            )
          ),
        unpublishById: (resumeId) =>
          set((state) => {
            if (state.id === resumeId) {
              return applyActiveResumeUpdate(
                state,
                {
                  syncStatus: 'unsaved',
                  isPublished: false,
                  id: null,
                  editSecret: null,
                },
                { updateUpdatedAt: false }
              )
            }
            const target = state.resumes.find(
              (resume) => resume.id === resumeId
            )
            if (!target) return {}
            const now = Date.now()
            const nextEntry = updateResumeEntry(
              target,
              {
                syncStatus: 'unsaved',
                isPublished: false,
                id: null,
                editSecret: null,
              },
              now,
              { updateUpdatedAt: false }
            )
            return {
              resumes: upsertResumeEntry(state.resumes, nextEntry),
            }
          }),
        hasResumeId: (resumeId) => {
          const state = get()
          return (
            state.resumes.some((resume) => resume.id === resumeId) ||
            state.id === resumeId
          )
        },
        setActiveResumeById: (resumeId) =>
          set((state) => {
            const target = state.resumes.find(
              (resume) => resume.id === resumeId
            )
            if (!target) return {}
            const now = Date.now()
            const nextEntry = updateResumeEntry(
              target,
              {},
              now,
              { updateOpenedAt: true, updateUpdatedAt: false }
            )
            return {
              localId: nextEntry.localId,
              resumes: upsertResumeEntry(state.resumes, nextEntry),
              id: nextEntry.id,
              slug: nextEntry.slug,
              editSecret: nextEntry.editSecret,
              resumeTitle: nextEntry.resumeTitle,
              markdown: nextEntry.markdown,
              saveStatus: nextEntry.saveStatus,
              syncStatus: nextEntry.syncStatus,
              isPublished: nextEntry.isPublished,
              imageWarning: nextEntry.imageWarning,
              contentWarning: nextEntry.contentWarning,
              resumeDisplay: nextEntry.resumeDisplay,
            }
          }),
        setActiveResumeByLocalId: (nextLocalId) =>
          set((state) => {
            const target = state.resumes.find(
              (resume) => resume.localId === nextLocalId
            )
            if (!target) return {}
            const now = Date.now()
            const nextEntry = updateResumeEntry(
              target,
              {},
              now,
              { updateOpenedAt: true, updateUpdatedAt: false }
            )
            return {
              localId: nextEntry.localId,
              resumes: upsertResumeEntry(state.resumes, nextEntry),
              id: nextEntry.id,
              slug: nextEntry.slug,
              editSecret: nextEntry.editSecret,
              resumeTitle: nextEntry.resumeTitle,
              markdown: nextEntry.markdown,
              saveStatus: nextEntry.saveStatus,
              syncStatus: nextEntry.syncStatus,
              isPublished: nextEntry.isPublished,
              imageWarning: nextEntry.imageWarning,
              contentWarning: nextEntry.contentWarning,
              resumeDisplay: nextEntry.resumeDisplay,
            }
          }),
        touchActiveResume: () =>
          set((state) =>
            applyActiveResumeUpdate(
              state,
              {},
              { updateOpenedAt: true, updateUpdatedAt: false }
            )
          ),
        loadResumeFromRemote: (resume) =>
          set((state) => {
            const now = Date.now()
            const existing = state.resumes.find(
              (entry) => entry.id === resume.id
            )
            const localId = existing?.localId ?? createLocalId()
            const baseEntry =
              existing ?? normalizeResumeEntry({}, localId, now)
            const nextSlug =
              resume.slug !== undefined ? resume.slug : baseEntry.slug
            const nextEditSecret =
              resume.editSecret !== undefined
                ? resume.editSecret
                : baseEntry.editSecret
            const nextTheme =
              resume.theme !== undefined
                ? resume.theme
                : baseEntry.resumeDisplay.theme
            const nextEntry = updateResumeEntry(
              baseEntry,
              {
                id: resume.id,
                slug: nextSlug,
                resumeTitle: resume.title,
                markdown: resume.content,
                editSecret: nextEditSecret,
                isPublished: true,
                saveStatus: 'saved',
                syncStatus: 'synced',
                imageWarning: null,
                contentWarning: null,
                resumeDisplay: {
                  themeMode: baseEntry.resumeDisplay.themeMode,
                  theme: resolveThemeDefaults(nextTheme ?? null),
                },
              },
              now,
              { updateOpenedAt: true }
            )
            return {
              localId: nextEntry.localId,
              resumes: upsertResumeEntry(state.resumes, nextEntry),
              id: nextEntry.id,
              slug: nextEntry.slug,
              editSecret: nextEntry.editSecret,
              resumeTitle: nextEntry.resumeTitle,
              markdown: nextEntry.markdown,
              saveStatus: nextEntry.saveStatus,
              syncStatus: nextEntry.syncStatus,
              isPublished: nextEntry.isPublished,
              imageWarning: nextEntry.imageWarning,
              contentWarning: nextEntry.contentWarning,
              resumeDisplay: nextEntry.resumeDisplay,
            }
          }),
        resetResume: () =>
          set((state) => {
            const now = Date.now()
            const localId = createLocalId()
            const nextEntry = normalizeResumeEntry(
              {
                localId,
                resumeTitle: DEFAULT_RESUME_TITLE,
                markdown: '',
                resumeDisplay: {
                  themeMode: 'auto',
                  theme: resolveThemeDefaults(),
                },
              },
              localId,
              now
            )
            return {
              localId,
              resumes: [nextEntry, ...state.resumes],
              id: nextEntry.id,
              slug: nextEntry.slug,
              editSecret: nextEntry.editSecret,
              resumeTitle: nextEntry.resumeTitle,
              markdown: nextEntry.markdown,
              saveStatus: nextEntry.saveStatus,
              syncStatus: nextEntry.syncStatus,
              isPublished: nextEntry.isPublished,
              imageWarning: nextEntry.imageWarning,
              contentWarning: nextEntry.contentWarning,
              resumeDisplay: nextEntry.resumeDisplay,
            }
          }),
      }
    },
    {
      name: 'tidyresume-editor',
      version: 8, // Bump version
      onRehydrateStorage: () => (state) => {
        state?.setSaveStatus('saved')
      },
      migrate: (persistedState) => {
        const now = Date.now()
        const state = persistedState as Partial<ResumeState> & {
          resumes?: ResumeEntry[]
        }
        const storedResumes = Array.isArray(state.resumes)
          ? state.resumes
          : null

        if (storedResumes && storedResumes.length > 0) {
          const normalizedResumes = storedResumes.map((resume) =>
            normalizeResumeEntry(
              resume,
              resume.localId ?? createLocalId(),
              now
            )
          )
          const recentResume = pickMostRecentResume(normalizedResumes)
          const activeResume =
            normalizedResumes.find(
              (resume) => resume.localId === state.localId
            ) ?? recentResume

          if (!activeResume) {
            const localId = createLocalId()
            const fallbackResume = normalizeResumeEntry({}, localId, now)
            return {
              ...state,
              localId,
              resumes: [fallbackResume],
              id: fallbackResume.id,
              slug: fallbackResume.slug,
              editSecret: fallbackResume.editSecret,
              resumeTitle: fallbackResume.resumeTitle,
              markdown: fallbackResume.markdown,
              saveStatus: fallbackResume.saveStatus,
              syncStatus: fallbackResume.syncStatus,
              isPublished: fallbackResume.isPublished,
              imageWarning: fallbackResume.imageWarning,
              contentWarning: fallbackResume.contentWarning,
              resumeDisplay: fallbackResume.resumeDisplay,
            }
          }

          const syncedActive = updateResumeEntry(
            activeResume,
            { syncStatus: 'unsaved' },
            now,
            { updateUpdatedAt: false }
          )

          return {
            ...state,
            localId: syncedActive.localId,
            resumes: upsertResumeEntry(normalizedResumes, syncedActive),
            id: syncedActive.id,
            slug: syncedActive.slug,
            editSecret: syncedActive.editSecret,
            resumeTitle: syncedActive.resumeTitle ?? DEFAULT_RESUME_TITLE,
            markdown: syncedActive.markdown ?? DEFAULT_RESUME,
            saveStatus: syncedActive.saveStatus ?? 'saved',
            syncStatus: syncedActive.syncStatus ?? 'unsaved',
            isPublished: syncedActive.isPublished ?? false,
            imageWarning: syncedActive.imageWarning ?? null,
            contentWarning: syncedActive.contentWarning ?? null,
            resumeDisplay: syncedActive.resumeDisplay,
          }
        }

        const localId = state.localId ?? createLocalId()
        const legacyResume = normalizeResumeEntry(
          {
            localId,
            id: state.id ?? null,
            slug: state.slug ?? null,
            editSecret: state.editSecret ?? null,
            resumeTitle: state.resumeTitle ?? DEFAULT_RESUME_TITLE,
            markdown: state.markdown ?? DEFAULT_RESUME,
            saveStatus: state.saveStatus ?? 'saved',
            syncStatus: 'unsaved',
            isPublished: state.isPublished ?? false,
            imageWarning: state.imageWarning ?? null,
            contentWarning: state.contentWarning ?? null,
            resumeDisplay: state.resumeDisplay,
          },
          localId,
          now
        )

        return {
          ...state,
          localId,
          resumes: [legacyResume],
          id: legacyResume.id,
          slug: legacyResume.slug,
          editSecret: legacyResume.editSecret,
          resumeTitle: legacyResume.resumeTitle,
          markdown: legacyResume.markdown,
          saveStatus: legacyResume.saveStatus,
          syncStatus: legacyResume.syncStatus,
          isPublished: legacyResume.isPublished,
          imageWarning: legacyResume.imageWarning,
          contentWarning: legacyResume.contentWarning,
          resumeDisplay: legacyResume.resumeDisplay,
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
