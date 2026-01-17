import { describe, it, expect, beforeEach } from 'vitest'
import { usePublicViewStore } from '../public-view-store'

describe('usePublicViewStore', () => {
  beforeEach(() => {
    usePublicViewStore.setState({
      publicViewState: { isPreviewMode: false },
    })
  })

  it('should default isPreviewMode to false', () => {
    const state = usePublicViewStore.getState()
    expect(state.publicViewState.isPreviewMode).toBe(false)
  })

  it('should enable preview mode', () => {
    const { setPublicViewState } = usePublicViewStore.getState()
    setPublicViewState({ isPreviewMode: true })
    const state = usePublicViewStore.getState()
    expect(state.publicViewState.isPreviewMode).toBe(true)
  })

  it('should disable preview mode', () => {
    const { setPublicViewState } = usePublicViewStore.getState()
    setPublicViewState({ isPreviewMode: true })
    setPublicViewState({ isPreviewMode: false })
    const state = usePublicViewStore.getState()
    expect(state.publicViewState.isPreviewMode).toBe(false)
  })

  it('should preserve state when merging updates', () => {
    usePublicViewStore.setState({
      publicViewState: { isPreviewMode: true },
    })
    const { setPublicViewState } = usePublicViewStore.getState()
    setPublicViewState({})
    const state = usePublicViewStore.getState()
    expect(state.publicViewState).toEqual({ isPreviewMode: true })
  })
})
