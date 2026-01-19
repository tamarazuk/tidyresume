import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface EditorViewState {
  preview: boolean
  previewOnly: boolean
  htmlPreview: boolean
}

interface EditorViewStore {
  editorViewState: EditorViewState
  setEditorViewState: (next: Partial<EditorViewState>) => void
  isSyncScrollEnabled: boolean
  toggleSyncScroll: () => void
}

export const useEditorViewStore = create<EditorViewStore>()(
  persist(
    (set) => ({
      editorViewState: {
        preview: true,
        previewOnly: false,
        htmlPreview: false,
      },
      setEditorViewState: (next) =>
        set((state) => ({
          editorViewState: {
            ...state.editorViewState,
            ...next,
          },
        })),
      isSyncScrollEnabled: true,
      toggleSyncScroll: () =>
        set((state) => ({ isSyncScrollEnabled: !state.isSyncScrollEnabled })),
    }),
    {
      name: 'editor-view-storage',
      partialize: (state) => ({
        isSyncScrollEnabled: state.isSyncScrollEnabled,
        // We only persist sync scroll setting for now as per requirements, 
        // but we can add others if needed.
        // The original file didn't persist editorViewState, so I'll keep it that way for now unless requested.
      }),
    }
  )
)