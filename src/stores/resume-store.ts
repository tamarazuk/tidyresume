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
import { DEFAULT_LABEL_COLOR } from '@/lib/label-colors'
import type {
  ResumeAccent,
  ResumeBodySize,
  ResumeBodyLineHeight,
  ResumeBodyLetterSpacing,
  ResumeHeadingSize,
  ResumeId,
  ResumeLabel,
  ResumeLabelId,
  ResumeSlug,
  ResumeThemeSettings,
} from '@/types/resume'

export type SaveStatus = 'saved' | 'saving' | 'unsaved'
export type ResumeSyncStatus = 'synced' | 'syncing' | 'error' | 'unsaved'
export type ResumeThemeMode = 'auto' | 'light' | 'dark'

export interface ResumeDisplaySettings {
  themeMode: ResumeThemeMode
  theme: ResumeThemeSettings
}

type ResumeThemeUpdate = Omit<ResumeThemeSettings, 'margins'> & {
  margins?: Partial<NonNullable<ResumeThemeSettings['margins']>>
}

export type ResumeDraftId = string

export interface ResumeDraft {
  draftId: ResumeDraftId
  id: ResumeId | null
  slug: ResumeSlug
  editSecret: string | null
  resumeTitle: string
  markdown: string
  saveStatus: SaveStatus
  syncStatus: ResumeSyncStatus
  isPublished: boolean
  imageWarning: string | null
  contentWarning: string | null
  resumeDisplay: ResumeDisplaySettings
  labelIds: ResumeLabelId[]
  createdAt: number
  updatedAt: number
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
  if (value === '10' || value === '11' || value === '12' || value === '13') {
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
    if (
      RESUME_BODY_LINE_HEIGHT_VALUE_SET.has(candidate as ResumeBodyLineHeight)
    ) {
      return candidate as ResumeBodyLineHeight
    }
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (
      RESUME_BODY_LINE_HEIGHT_VALUE_SET.has(trimmed as ResumeBodyLineHeight)
    ) {
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
    if (
      RESUME_BODY_LETTER_SPACING_VALUE_SET.has(
        candidate as ResumeBodyLetterSpacing
      )
    ) {
      return candidate as ResumeBodyLetterSpacing
    }
    if (value === 0) return '0'
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (
      RESUME_BODY_LETTER_SPACING_VALUE_SET.has(
        trimmed as ResumeBodyLetterSpacing
      )
    ) {
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
  activeDraftId: ResumeDraftId | null
  draftOrder: ResumeDraftId[]
  draftsById: Record<ResumeDraftId, ResumeDraft>
  labelsById: Record<ResumeLabelId, ResumeLabel>
  labelOrder: ResumeLabelId[]
  getActiveDraft: () => ResumeDraft
  getDraftByRemoteId: (id: ResumeId) => ResumeDraft | null
  createDraft: () => ResumeDraftId
  duplicateDraft: (draftId: ResumeDraftId) => ResumeDraftId | null
  deleteDraft: (draftId: ResumeDraftId) => void
  setActiveDraft: (draftId: ResumeDraftId) => void
  updateDraft: (draftId: ResumeDraftId, partial: Partial<ResumeDraft>) => void
  updateActiveDraft: (partial: Partial<ResumeDraft>) => void
  setDraftTitle: (draftId: ResumeDraftId, resumeTitle: string) => void
  setDraftTheme: (draftId: ResumeDraftId, theme: ResumeThemeUpdate) => void
  setDraftAccent: (draftId: ResumeDraftId, accent: ResumeAccent) => void
  setDraftSlug: (draftId: ResumeDraftId, slug: ResumeSlug) => void
  setDraftSyncStatus: (
    draftId: ResumeDraftId,
    syncStatus: ResumeSyncStatus
  ) => void
  setResumeTitle: (resumeTitle: string) => void
  setResumeThemeMode: (themeMode: ResumeThemeMode) => void
  setResumeAccent: (accent: ResumeAccent) => void
  setResumeTheme: (theme: ResumeThemeUpdate) => void
  setMarkdown: (markdown: string) => void
  setSaveStatus: (saveStatus: SaveStatus) => void
  setSyncStatus: (syncStatus: ResumeSyncStatus) => void
  setId: (id: ResumeId | null) => void
  setSlug: (slug: ResumeSlug) => void
  setEditSecret: (editSecret: string | null) => void
  setIsPublished: (isPublished: boolean) => void
  setImageWarning: (imageWarning: string | null) => void
  setContentWarning: (contentWarning: string | null) => void
  unpublish: (draftId?: ResumeDraftId) => void
  resetResume: () => void
  createLabel: (name: string, color?: string) => ResumeLabelId
  updateLabel: (
    id: ResumeLabelId,
    updates: { name?: string; color?: string }
  ) => void
  deleteLabel: (id: ResumeLabelId) => void
  addLabelToDraft: (draftId: ResumeDraftId, labelId: ResumeLabelId) => void
  removeLabelFromDraft: (draftId: ResumeDraftId, labelId: ResumeLabelId) => void
}

const createResumeDisplay = (
  overrides?: Partial<ResumeDisplaySettings>
): ResumeDisplaySettings => {
  return {
    themeMode: overrides?.themeMode ?? 'auto',
    theme: resolveThemeDefaults(overrides?.theme),
  }
}

const createDraftDefaults = (
  overrides: Partial<ResumeDraft> = {}
): ResumeDraft => {
  const now = Date.now()
  const resumeDisplay = createResumeDisplay(overrides.resumeDisplay)
  return {
    draftId: overrides.draftId ?? crypto.randomUUID(),
    id: overrides.id ?? null,
    slug: overrides.slug ?? null,
    editSecret: overrides.editSecret ?? null,
    resumeTitle: overrides.resumeTitle ?? DEFAULT_RESUME_TITLE,
    markdown: overrides.markdown ?? DEFAULT_RESUME,
    saveStatus: overrides.saveStatus ?? 'saved',
    syncStatus: overrides.syncStatus ?? 'unsaved',
    isPublished: overrides.isPublished ?? false,
    imageWarning: overrides.imageWarning ?? null,
    contentWarning: overrides.contentWarning ?? null,
    resumeDisplay,
    labelIds: overrides.labelIds ?? [],
    createdAt: overrides.createdAt ?? now,
    updatedAt: overrides.updatedAt ?? now,
  }
}

const mergeResumeDisplay = (
  current: ResumeDisplaySettings,
  next?: Partial<ResumeDisplaySettings>
): ResumeDisplaySettings => {
  if (!next) return current
  const theme = next.theme
    ? resolveThemeDefaults({
        ...current.theme,
        ...next.theme,
        typography: {
          ...current.theme.typography,
          ...next.theme.typography,
        },
      })
    : current.theme
  return {
    ...current,
    ...next,
    theme,
  }
}

const mergeThemeUpdate = (
  draft: ResumeDraft,
  theme: ResumeThemeUpdate
): ResumeDisplaySettings => {
  return {
    ...draft.resumeDisplay,
    theme: resolveThemeDefaults({
      ...draft.resumeDisplay.theme,
      ...theme,
      typography: {
        ...draft.resumeDisplay.theme.typography,
        ...theme.typography,
      },
      margins: theme.margins
        ? normalizeResumeMargins({
            ...draft.resumeDisplay.theme.margins,
            ...theme.margins,
          })
        : draft.resumeDisplay.theme.margins,
    }),
  }
}

const createSaveStatusDebouncer = (
  updateDraft: (draftId: string, partial: Partial<ResumeDraft>) => void
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return (draftId: string) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      updateDraft(draftId, { saveStatus: 'saved' })
    }, 500)
  }
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => {
      const scheduleSaveStatus = createSaveStatusDebouncer((draftId, partial) =>
        get().updateDraft(draftId, partial)
      )
      const initialDraft = createDraftDefaults()
      return {
        activeDraftId: initialDraft.draftId,
        draftOrder: [initialDraft.draftId],
        draftsById: {
          [initialDraft.draftId]: initialDraft,
        },
        labelsById: {},
        labelOrder: [],
        getActiveDraft: () => {
          const state = get()
          const activeId = state.activeDraftId ?? state.draftOrder[0]
          if (activeId && state.draftsById[activeId]) {
            return state.draftsById[activeId]
          }
          const firstId = state.draftOrder[0]
          if (firstId && state.draftsById[firstId]) {
            return state.draftsById[firstId]
          }
          return createDraftDefaults()
        },
        getDraftByRemoteId: (id) => {
          const drafts = Object.values(get().draftsById).filter(
            (draft) => draft.id === id
          )
          if (drafts.length === 0) return null
          drafts.sort((left, right) => {
            const secretScore =
              Number(Boolean(right.editSecret)) -
              Number(Boolean(left.editSecret))
            if (secretScore !== 0) return secretScore
            return right.updatedAt - left.updatedAt
          })
          return drafts[0]
        },
        createDraft: () => {
          const draft = createDraftDefaults()
          set((state) => ({
            draftsById: {
              ...state.draftsById,
              [draft.draftId]: draft,
            },
            draftOrder: [draft.draftId, ...state.draftOrder],
            activeDraftId: draft.draftId,
          }))
          return draft.draftId
        },
        duplicateDraft: (draftId) => {
          const draft = get().draftsById[draftId]
          if (!draft) return null
          const duplicate = createDraftDefaults({
            resumeTitle: `${draft.resumeTitle} Copy`,
            markdown: draft.markdown,
            resumeDisplay: draft.resumeDisplay,
            labelIds: [...draft.labelIds],
          })
          set((state) => ({
            draftsById: {
              ...state.draftsById,
              [duplicate.draftId]: duplicate,
            },
            draftOrder: [duplicate.draftId, ...state.draftOrder],
            activeDraftId: duplicate.draftId,
          }))
          return duplicate.draftId
        },
        deleteDraft: (draftId) => {
          set((state) => {
            if (!state.draftsById[draftId]) return state
            const nextDraftOrder = state.draftOrder.filter(
              (id) => id !== draftId
            )
            const nextDraftsById = { ...state.draftsById }
            delete nextDraftsById[draftId]
            let nextActiveId = state.activeDraftId
            if (state.activeDraftId === draftId) {
              nextActiveId = nextDraftOrder[0] ?? null
            }
            if (!nextActiveId) {
              const fallback = createDraftDefaults()
              nextDraftsById[fallback.draftId] = fallback
              nextDraftOrder.unshift(fallback.draftId)
              nextActiveId = fallback.draftId
            }
            return {
              draftsById: nextDraftsById,
              draftOrder: nextDraftOrder,
              activeDraftId: nextActiveId,
            }
          })
        },
        setActiveDraft: (draftId) => {
          set((state) => {
            if (!state.draftsById[draftId]) return state
            return { activeDraftId: draftId }
          })
        },
        updateDraft: (draftId, partial) => {
          set((state) => {
            const draft = state.draftsById[draftId]
            if (!draft) return state
            const updatedDraft: ResumeDraft = {
              ...draft,
              ...partial,
              resumeDisplay: mergeResumeDisplay(
                draft.resumeDisplay,
                partial.resumeDisplay
              ),
              updatedAt: partial.updatedAt ?? Date.now(),
            }
            return {
              draftsById: {
                ...state.draftsById,
                [draftId]: updatedDraft,
              },
            }
          })
        },
        updateActiveDraft: (partial) => {
          const activeId = get().activeDraftId
          if (!activeId) return
          get().updateDraft(activeId, partial)
        },
        setDraftTitle: (draftId, resumeTitle) => {
          get().updateDraft(draftId, { resumeTitle })
        },
        setDraftTheme: (draftId, theme) => {
          const draft = get().draftsById[draftId]
          if (!draft) return
          get().updateDraft(draftId, {
            resumeDisplay: mergeThemeUpdate(draft, theme),
          })
        },
        setDraftAccent: (draftId, accent) => {
          const draft = get().draftsById[draftId]
          if (!draft) return
          get().updateDraft(draftId, {
            resumeDisplay: {
              ...draft.resumeDisplay,
              theme: {
                ...draft.resumeDisplay.theme,
                accent,
              },
            },
          })
        },
        setDraftSlug: (draftId, slug) => {
          get().updateDraft(draftId, { slug })
        },
        setDraftSyncStatus: (draftId, syncStatus) => {
          get().updateDraft(draftId, { syncStatus })
        },
        setResumeTitle: (resumeTitle) => {
          const activeId = get().activeDraftId
          get().updateActiveDraft({ resumeTitle, saveStatus: 'saving' })
          if (activeId) scheduleSaveStatus(activeId)
        },
        setMarkdown: (markdown) => {
          const activeId = get().activeDraftId
          const exceedsLimit = markdown.length > MAX_MARKDOWN_LENGTH
          get().updateActiveDraft({
            markdown: exceedsLimit
              ? markdown.slice(0, MAX_MARKDOWN_LENGTH)
              : markdown,
            saveStatus: 'saving',
            contentWarning: exceedsLimit ? CONTENT_TOO_LARGE_WARNING : null,
          })
          if (activeId) scheduleSaveStatus(activeId)
        },
        setSaveStatus: (saveStatus) => get().updateActiveDraft({ saveStatus }),
        setSyncStatus: (syncStatus) => get().updateActiveDraft({ syncStatus }),
        setId: (id) => get().updateActiveDraft({ id }),
        setSlug: (slug) => get().updateActiveDraft({ slug }),
        setEditSecret: (editSecret) => get().updateActiveDraft({ editSecret }),
        setIsPublished: (isPublished) =>
          get().updateActiveDraft({ isPublished }),
        setImageWarning: (imageWarning) =>
          get().updateActiveDraft({ imageWarning }),
        setContentWarning: (contentWarning) =>
          get().updateActiveDraft({ contentWarning }),
        setResumeThemeMode: (themeMode) => {
          const draft = get().getActiveDraft()
          get().updateActiveDraft({
            resumeDisplay: {
              ...draft.resumeDisplay,
              themeMode,
            },
          })
        },
        setResumeTheme: (theme) => {
          const draft = get().getActiveDraft()
          get().updateActiveDraft({
            resumeDisplay: mergeThemeUpdate(draft, theme),
            saveStatus: 'saving',
          })
          scheduleSaveStatus(draft.draftId)
        },
        setResumeAccent: (accent) => {
          const draft = get().getActiveDraft()
          get().updateActiveDraft({
            resumeDisplay: {
              ...draft.resumeDisplay,
              theme: {
                ...draft.resumeDisplay.theme,
                accent,
              },
            },
            saveStatus: 'saving',
          })
          scheduleSaveStatus(draft.draftId)
        },
        unpublish: (draftId) => {
          const id = draftId ?? get().activeDraftId
          if (!id) return
          get().updateDraft(id, {
            syncStatus: 'unsaved',
            isPublished: false,
            id: null,
            editSecret: null,
          })
        },
        resetResume: () =>
          get().updateActiveDraft({
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
            resumeDisplay: createResumeDisplay(),
            labelIds: [],
          }),
        createLabel: (name, color) => {
          const id = crypto.randomUUID() as ResumeLabelId
          const now = Date.now()
          const label: ResumeLabel = {
            id,
            name,
            color: color ?? DEFAULT_LABEL_COLOR,
            createdAt: now,
            updatedAt: now,
          }
          set((state) => ({
            labelsById: { ...state.labelsById, [id]: label },
            labelOrder: [...state.labelOrder, id],
          }))
          return id
        },
        updateLabel: (id, updates) => {
          set((state) => {
            const label = state.labelsById[id]
            if (!label) return state
            return {
              labelsById: {
                ...state.labelsById,
                [id]: {
                  ...label,
                  ...updates,
                  updatedAt: Date.now(),
                },
              },
            }
          })
        },
        deleteLabel: (id) => {
          set((state) => {
            const nextLabelsById = { ...state.labelsById }
            delete nextLabelsById[id]
            const nextDraftsById = { ...state.draftsById }
            for (const [draftId, draft] of Object.entries(nextDraftsById)) {
              if (draft.labelIds.includes(id)) {
                nextDraftsById[draftId] = {
                  ...draft,
                  labelIds: draft.labelIds.filter((lid) => lid !== id),
                }
              }
            }
            return {
              labelsById: nextLabelsById,
              labelOrder: state.labelOrder.filter((lid) => lid !== id),
              draftsById: nextDraftsById,
            }
          })
        },
        addLabelToDraft: (draftId, labelId) => {
          set((state) => {
            const draft = state.draftsById[draftId]
            if (!draft || draft.labelIds.includes(labelId)) return state
            return {
              draftsById: {
                ...state.draftsById,
                [draftId]: {
                  ...draft,
                  labelIds: [...draft.labelIds, labelId],
                  updatedAt: Date.now(),
                },
              },
            }
          })
        },
        removeLabelFromDraft: (draftId, labelId) => {
          set((state) => {
            const draft = state.draftsById[draftId]
            if (!draft) return state
            return {
              draftsById: {
                ...state.draftsById,
                [draftId]: {
                  ...draft,
                  labelIds: draft.labelIds.filter((lid) => lid !== labelId),
                  updatedAt: Date.now(),
                },
              },
            }
          })
        },
      }
    },
    {
      name: 'tidyresume-editor',
      version: 9,
      onRehydrateStorage: () => (state) => {
        state?.setSaveStatus('saved')
      },
      migrate: (persistedState) => {
        const state = persistedState as Partial<ResumeState> & {
          id?: ResumeId | null
          slug?: ResumeSlug
          editSecret?: string | null
          resumeTitle?: string
          markdown?: string
          saveStatus?: SaveStatus
          syncStatus?: ResumeDraft['syncStatus']
          isPublished?: boolean
          imageWarning?: string | null
          contentWarning?: string | null
          resumeDisplay?: ResumeDisplaySettings
        }

        const labelsById = state.labelsById ?? {}
        const labelOrder = state.labelOrder ?? []

        if (state.draftsById && state.draftOrder) {
          const normalizedDrafts: Record<ResumeDraftId, ResumeDraft> = {}
          Object.entries(state.draftsById).forEach(([draftId, draft]) => {
            normalizedDrafts[draftId] = createDraftDefaults({
              ...draft,
              draftId,
              labelIds: Array.isArray(draft.labelIds) ? draft.labelIds : [],
              resumeDisplay: {
                themeMode: draft.resumeDisplay?.themeMode ?? 'auto',
                theme: resolveThemeDefaults(draft.resumeDisplay?.theme),
              },
            })
          })
          const normalizedOrder = Array.isArray(state.draftOrder)
            ? state.draftOrder.filter((id) => normalizedDrafts[id])
            : Object.keys(normalizedDrafts)
          let activeDraftId =
            state.activeDraftId && normalizedDrafts[state.activeDraftId]
              ? state.activeDraftId
              : (normalizedOrder[0] ?? null)
          if (!activeDraftId) {
            const fallback = createDraftDefaults()
            normalizedDrafts[fallback.draftId] = fallback
            normalizedOrder.unshift(fallback.draftId)
            activeDraftId = fallback.draftId
          }
          return {
            activeDraftId,
            draftOrder: normalizedOrder,
            draftsById: normalizedDrafts,
            labelsById,
            labelOrder,
          }
        }

        const draft = createDraftDefaults({
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
          resumeDisplay: {
            themeMode: state.resumeDisplay?.themeMode ?? 'auto',
            theme: resolveThemeDefaults(state.resumeDisplay?.theme),
          },
        })

        return {
          activeDraftId: draft.draftId,
          draftOrder: [draft.draftId],
          draftsById: { [draft.draftId]: draft },
          labelsById,
          labelOrder,
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
