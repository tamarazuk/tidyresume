import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useSynchronizedScroll } from '../use-synchronized-scroll'
import type { RefObject } from 'react'

describe('useSynchronizedScroll', () => {
  let editorRef: RefObject<HTMLElement | null>
  let previewRef: RefObject<HTMLElement | null>
  let editorElement: HTMLElement
  let previewElement: HTMLElement

  beforeEach(() => {
    editorElement = document.createElement('div')
    previewElement = document.createElement('div')
    editorRef = { current: editorElement }
    previewRef = { current: previewElement }
    
    // Mock addEventListener/removeEventListener
    vi.spyOn(editorElement, 'addEventListener')
    vi.spyOn(editorElement, 'removeEventListener')
    vi.spyOn(previewElement, 'addEventListener')
    vi.spyOn(previewElement, 'removeEventListener')
  })

  it('adds scroll event listeners when enabled', () => {
    renderHook(() => useSynchronizedScroll(editorRef, previewRef, true))

    expect(editorElement.addEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      expect.any(Object)
    )
    expect(previewElement.addEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      expect.any(Object)
    )
  })

  it('does not add event listeners when disabled', () => {
    renderHook(() => useSynchronizedScroll(editorRef, previewRef, false))

    expect(editorElement.addEventListener).not.toHaveBeenCalled()
    expect(previewElement.addEventListener).not.toHaveBeenCalled()
  })

  it('removes event listeners when unmounting', () => {
    const { unmount } = renderHook(() => 
      useSynchronizedScroll(editorRef, previewRef, true)
    )

    unmount()

    expect(editorElement.removeEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function)
    )
    expect(previewElement.removeEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function)
    )
  })

  it('removes event listeners when disabled dynamically', () => {
    const { rerender } = renderHook(
      ({ isEnabled }) => useSynchronizedScroll(editorRef, previewRef, isEnabled),
      { initialProps: { isEnabled: true } }
    )

    // Should have added listeners initially
    expect(editorElement.addEventListener).toHaveBeenCalledTimes(1)

    // Rerender with disabled
    rerender({ isEnabled: false })

    // Should have removed listeners
    expect(editorElement.removeEventListener).toHaveBeenCalled()
    
    // Should not have added listeners again
    expect(editorElement.addEventListener).toHaveBeenCalledTimes(1)
  })
})
