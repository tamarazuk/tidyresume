import { useSyncExternalStore } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_RESUME } from '@/components/editor/constants'

type SaveStatus = 'saved' | 'saving' | 'unsaved'

const MAX_MARKDOWN_LENGTH = 3_000_000
const CONTENT_TOO_LARGE_WARNING = 'Content too large to store'

interface ResumeState {
  resumeTitle: string
  markdown: string
  saveStatus: SaveStatus
  imageWarning: string | null
  contentWarning: string | null
  setResumeTitle: (resumeTitle: string) => void
  setMarkdown: (markdown: string) => void
  setSaveStatus: (saveStatus: SaveStatus) => void
  setImageWarning: (imageWarning: string | null) => void
  setContentWarning: (contentWarning: string | null) => void
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
        resumeTitle: 'Untitled Resume',
        markdown: DEFAULT_RESUME,
        saveStatus: 'saved',
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
        setImageWarning: (imageWarning) => set({ imageWarning }),
        setContentWarning: (contentWarning) => set({ contentWarning }),
      }
    },
    {
      name: 'tidyresume-editor',
      version: 1,
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
