import { describe, it, expect, beforeEach } from 'vitest'
import { useEditorViewStore } from '../editor-view-store'

describe('useEditorViewStore', () => {
  it('should have isPreviewMode defaulting to false', () => {
    const state = useEditorViewStore.getState()
    expect(state.editorViewState.isPreviewMode).toBe(false)
  })

  it('should update isPreviewMode', () => {
    const { setEditorViewState } = useEditorViewStore.getState()
    
    setEditorViewState({ isPreviewMode: true })
    
    const state = useEditorViewStore.getState()
    expect(state.editorViewState.isPreviewMode).toBe(true)
  })
})
