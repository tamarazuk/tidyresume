import type { Page } from '@playwright/test'

const STORE_KEY = 'tidyresume-editor'
const STORE_VERSION = 8

interface SeedOverrides {
  draftId?: string
  id?: string
  slug?: string
  editSecret?: string
  resumeTitle?: string
  markdown?: string
  isPublished?: boolean
}

export interface SeedResumeDraft {
  draftId: string
  id?: string | null
  slug?: string | null
  editSecret?: string | null
  resumeTitle?: string
  markdown?: string
  saveStatus?: 'saved' | 'saving' | 'unsaved'
  syncStatus?: 'synced' | 'syncing' | 'error' | 'unsaved'
  isPublished?: boolean
  imageWarning?: string | null
  contentWarning?: string | null
  createdAt?: number
  updatedAt?: number
}

interface PersistedResumeDraft {
  draftId: string
  id: string | null
  slug: string | null
  editSecret: string | null
  resumeTitle: string
  markdown: string
  saveStatus: 'saved' | 'saving' | 'unsaved'
  syncStatus: 'synced' | 'syncing' | 'error' | 'unsaved'
  isPublished: boolean
  imageWarning: string | null
  contentWarning: string | null
  resumeDisplay: {
    themeMode: 'auto' | 'light' | 'dark'
    theme: Record<string, unknown>
  }
  createdAt: number
  updatedAt: number
}

interface PersistedResumeStoreState {
  activeDraftId: string | null
  draftOrder: string[]
  draftsById: Record<string, PersistedResumeDraft>
}

export interface PersistedResumeStore {
  state: PersistedResumeStoreState
  version: number
}

interface SeedResumeStoreOptions {
  drafts: SeedResumeDraft[]
  activeDraftId?: string | null
}

function buildDraft(draft: SeedResumeDraft): PersistedResumeDraft {
  const timestamp = draft.updatedAt ?? draft.createdAt ?? Date.now()
  return {
    draftId: draft.draftId,
    id: draft.id ?? null,
    slug: draft.slug ?? null,
    editSecret: draft.editSecret ?? null,
    resumeTitle: draft.resumeTitle ?? 'Untitled Resume',
    markdown: draft.markdown ?? '# Resume',
    saveStatus: draft.saveStatus ?? 'saved',
    syncStatus: draft.syncStatus ?? 'unsaved',
    isPublished: draft.isPublished ?? false,
    imageWarning: draft.imageWarning ?? null,
    contentWarning: draft.contentWarning ?? null,
    resumeDisplay: {
      themeMode: 'auto',
      theme: {},
    },
    createdAt: draft.createdAt ?? timestamp,
    updatedAt: draft.updatedAt ?? timestamp,
  }
}

export async function seedResumeStore(
  page: Page,
  options: SeedResumeStoreOptions
) {
  const drafts = options.drafts.map(buildDraft)
  const draftOrder = drafts.map((draft) => draft.draftId)
  const fallbackActiveDraftId = draftOrder[0] ?? null
  const activeDraftId = options.activeDraftId
    ? draftOrder.includes(options.activeDraftId)
      ? options.activeDraftId
      : fallbackActiveDraftId
    : fallbackActiveDraftId

  const draftsById = drafts.reduce<Record<string, PersistedResumeDraft>>(
    (accumulator, draft) => {
      accumulator[draft.draftId] = draft
      return accumulator
    },
    {}
  )

  const serialized: PersistedResumeStore = {
    state: {
      activeDraftId,
      draftOrder,
      draftsById,
    },
    version: STORE_VERSION,
  }

  await page.addInitScript(
    ([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value))
    },
    [STORE_KEY, serialized] as const
  )
}

export async function readPersistedResumeStore(
  page: Page
): Promise<PersistedResumeStore | null> {
  return page.evaluate(([key]) => {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as PersistedResumeStore
  }, [STORE_KEY] as const)
}

/**
 * Seeds localStorage with published resume state before navigating.
 * Useful for tests that need the editor to start in a "published" state.
 */
export async function seedPublishedState(
  page: Page,
  overrides: SeedOverrides = {}
) {
  const draftId = overrides.draftId ?? 'test-draft-id'
  await seedResumeStore(page, {
    drafts: [
      {
        draftId,
        id: overrides.id ?? 'test-resume-id',
        slug: overrides.slug ?? 'test-slug',
        editSecret: overrides.editSecret ?? 'test-secret',
        resumeTitle: overrides.resumeTitle ?? 'My Test Resume',
        markdown: overrides.markdown ?? '# Hello',
        saveStatus: 'saved',
        syncStatus: 'synced',
        isPublished: overrides.isPublished ?? true,
      },
    ],
    activeDraftId: draftId,
  })
}
