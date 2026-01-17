import { describe, it, expect } from 'vitest'
import { useEditorViewStore } from '../editor-view-store'

describe('useEditorViewStore', () => {
  it('should initialize editor view defaults', () => {
    const state = useEditorViewStore.getState()

    expect(state.editorViewState).toEqual({
      preview: true,
      previewOnly: false,
      htmlPreview: false,
    })
  })

  it('should merge state updates', () => {
    const { setEditorViewState } = useEditorViewStore.getState()

    setEditorViewState({ preview: false })

    const state = useEditorViewStore.getState()
    expect(state.editorViewState).toEqual({
      preview: false,
      previewOnly: false,
      htmlPreview: false,
    })
  })
})
