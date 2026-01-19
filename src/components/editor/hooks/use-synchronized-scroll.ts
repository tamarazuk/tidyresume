import { useEffect, useRef } from 'react'
import type { ExposeParam } from 'md-editor-rt'
import {
  getScrollAnchors,
  calculateScrollPosition,
  type ScrollAnchor,
} from '../utils/scroll-sync'

/**
 * Hook to synchronize scrolling between the markdown editor and the preview.
 *
 * @param editorRef Reference to the MdEditor instance (ExposeParam)
 * @param isEnabled Whether synchronized scrolling is enabled
 * @param dependency Optional dependency to trigger re-initialization (e.g., view mode)
 */
export function useSynchronizedScroll(
  editorRef: React.RefObject<ExposeParam | null>,
  isEnabled: boolean,
  dependency?: unknown
) {
  // To prevent infinite scroll loops
  const activeScroller = useRef<'editor' | 'preview' | null>(null)
  const timeoutId = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isEnabled) return

    let cleanupFn: (() => void) | undefined
    let pollInterval: NodeJS.Timeout | undefined

    const initialize = () => {
      if (!editorRef.current) return false

      const editorView = editorRef.current.getEditorView()
      if (!editorView) return false

      const editorScroller = editorView.scrollDOM
      // md-editor-rt preview wrapper usually has this class
      const previewScroller = editorScroller
        .closest('.md-editor')
        ?.querySelector('.md-editor-preview-wrapper') as HTMLElement

      if (!previewScroller) return false

      // Cache for scroll anchors to reduce expensive DOM reads
      let cachedAnchors: ScrollAnchor[] | null = null

      const invalidateCache = () => {
        cachedAnchors = null
      }

      // Observe content changes in preview (Markdown rendering updates)
      const mutationObserver = new MutationObserver(invalidateCache)
      mutationObserver.observe(previewScroller, {
        childList: true,
        subtree: true,
        attributes: true, // In case data-line attributes change
      })

      // Observe layout changes (resizing)
      const resizeObserver = new ResizeObserver(invalidateCache)
      resizeObserver.observe(editorScroller)
      resizeObserver.observe(previewScroller)

      const getAnchors = () => {
        if (!cachedAnchors) {
          cachedAnchors = getScrollAnchors(editorView, previewScroller)
        }
        return cachedAnchors
      }

      const clearActiveScroller = () => {
        if (timeoutId.current) clearTimeout(timeoutId.current)
        timeoutId.current = setTimeout(() => {
          activeScroller.current = null
        }, 50)
      }

      let ticking = false

      const handleEditorScroll = () => {
        if (activeScroller.current === 'preview') return
        activeScroller.current = 'editor'

        if (!ticking) {
          requestAnimationFrame(() => {
            const anchors = getAnchors()
            const targetTop = calculateScrollPosition(
              editorScroller.scrollTop,
              anchors,
              'editor'
            )

            previewScroller.scrollTo({ top: targetTop, behavior: 'auto' })
            clearActiveScroller()
            ticking = false
          })
          ticking = true
        }
      }

      const handlePreviewScroll = () => {
        if (activeScroller.current === 'editor') return
        activeScroller.current = 'preview'

        if (!ticking) {
          requestAnimationFrame(() => {
            const anchors = getAnchors()
            const targetTop = calculateScrollPosition(
              previewScroller.scrollTop,
              anchors,
              'preview'
            )

            editorScroller.scrollTo({ top: targetTop, behavior: 'auto' })
            clearActiveScroller()
            ticking = false
          })
          ticking = true
        }
      }

      // Use passive: true for better scroll performance
      editorScroller.addEventListener('scroll', handleEditorScroll, {
        passive: true,
      })
      previewScroller.addEventListener('scroll', handlePreviewScroll, {
        passive: true,
      })

      return () => {
        editorScroller.removeEventListener('scroll', handleEditorScroll)
        previewScroller.removeEventListener('scroll', handlePreviewScroll)
        mutationObserver.disconnect()
        resizeObserver.disconnect()
        if (timeoutId.current) clearTimeout(timeoutId.current)
      }
    }

    // Attempt initialization immediately
    const result = initialize()
    if (result) {
      cleanupFn = result
    } else {
      // If not ready, poll until it is
      pollInterval = setInterval(() => {
        const res = initialize()
        if (res) {
          cleanupFn = res
          clearInterval(pollInterval)
        }
      }, 100)
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval)
      if (cleanupFn) cleanupFn()
    }
  }, [isEnabled, editorRef, dependency])
}
