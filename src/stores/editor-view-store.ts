import { create } from 'zustand'

interface EditorViewState {
  preview: boolean
  previewOnly: boolean
  htmlPreview: boolean
}

interface EditorViewStore {
  editorViewState: EditorViewState
  setEditorViewState: (next: Partial<EditorViewState>) => void
}

export const useEditorViewStore = create<EditorViewStore>((set) => ({
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
}))
