import { useEffect, useRef } from 'react'
import type { ExposeParam } from 'md-editor-rt'
import { getScrollAnchors, calculateScrollPosition } from '../utils/scroll-sync'

/**
 * Hook to synchronize scrolling between the markdown editor and the preview.
 *
 * @param editorRef Reference to the MdEditor instance (ExposeParam)
 * @param isEnabled Whether synchronized scrolling is enabled
 */
export function useSynchronizedScroll(
  editorRef: React.RefObject<ExposeParam | null>,
  isEnabled: boolean
) {
  // To prevent infinite scroll loops
  const activeScroller = useRef<'editor' | 'preview' | null>(null)
  const timeoutId = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isEnabled || !editorRef.current) return

    const editorView = editorRef.current.getEditorView()
    if (!editorView) return

    const editorScroller = editorView.scrollDOM
    // md-editor-rt preview wrapper usually has this class
    const previewScroller = editorScroller.closest('.md-editor')?.querySelector('.md-editor-preview-wrapper') as HTMLElement

    if (!previewScroller) return

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
          const anchors = getScrollAnchors(editorView, previewScroller)
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
          const anchors = getScrollAnchors(editorView, previewScroller)
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
    editorScroller.addEventListener('scroll', handleEditorScroll, { passive: true })
    previewScroller.addEventListener('scroll', handlePreviewScroll, { passive: true })

    return () => {
      editorScroller.removeEventListener('scroll', handleEditorScroll)
      previewScroller.removeEventListener('scroll', handlePreviewScroll)
      if (timeoutId.current) clearTimeout(timeoutId.current)
    }
  }, [isEnabled, editorRef])
}