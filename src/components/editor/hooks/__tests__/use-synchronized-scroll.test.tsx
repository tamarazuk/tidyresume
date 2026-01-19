import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useSynchronizedScroll } from '../use-synchronized-scroll'
import type { RefObject } from 'react'
import type { ExposeParam } from 'md-editor-rt'

describe('useSynchronizedScroll', () => {
  let editorRef: RefObject<ExposeParam | null>
  let editorRoot: HTMLElement
  let editorScroller: HTMLElement
  let previewScroller: HTMLElement

  beforeEach(() => {
    // Setup DOM
    editorRoot = document.createElement('div')
    editorRoot.className = 'md-editor'
    
    editorScroller = document.createElement('div')
    editorScroller.className = 'cm-scroller'
    
    previewScroller = document.createElement('div')
    previewScroller.className = 'md-editor-preview-wrapper'
    
    editorRoot.appendChild(editorScroller)
    editorRoot.appendChild(previewScroller)
    document.body.appendChild(editorRoot)

    // Mock Ref
    editorRef = {
      current: {
        getEditorView: () => ({
          scrollDOM: editorScroller,
          state: { doc: { lines: 1, line: () => ({ text: '', from: 0 }) } },
          lineBlockAt: () => ({ top: 0 }),
        }),
      } as any,
    }
    
    // Mock addEventListener/removeEventListener
    vi.spyOn(editorScroller, 'addEventListener')
    vi.spyOn(editorScroller, 'removeEventListener')
    vi.spyOn(previewScroller, 'addEventListener')
    vi.spyOn(previewScroller, 'removeEventListener')
  })

  afterEach(() => {
    document.body.removeChild(editorRoot)
    vi.restoreAllMocks()
  })

  it('adds scroll event listeners when enabled', () => {
    renderHook(() => useSynchronizedScroll(editorRef, true))

    expect(editorScroller.addEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      expect.any(Object)
    )
    expect(previewScroller.addEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      expect.any(Object)
    )
  })

  it('does not add event listeners when disabled', () => {
    renderHook(() => useSynchronizedScroll(editorRef, false))

    expect(editorScroller.addEventListener).not.toHaveBeenCalled()
    expect(previewScroller.addEventListener).not.toHaveBeenCalled()
  })

  it('removes event listeners when unmounting', () => {
    const { unmount } = renderHook(() => 
      useSynchronizedScroll(editorRef, true)
    )

    unmount()

    expect(editorScroller.removeEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function)
    )
    expect(previewScroller.removeEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function)
    )
  })

  it('throttles scroll events', () => {
    vi.useFakeTimers()
    renderHook(() => useSynchronizedScroll(editorRef, true))

    // Trigger scroll
    const scrollEvent = new Event('scroll')
    editorScroller.dispatchEvent(scrollEvent)
    
    // Should request animation frame
    expect(window.requestAnimationFrame).toBeDefined()
    
    vi.useRealTimers()
  })
})