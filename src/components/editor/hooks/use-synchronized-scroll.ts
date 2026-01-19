import { useEffect, type RefObject } from 'react'

/**
 * Hook to synchronize scrolling between the markdown editor and the preview.
 *
 * @param editorRef Reference to the editor container
 * @param previewRef Reference to the preview container
 * @param isEnabled Whether synchronized scrolling is enabled
 */
export const useSynchronizedScroll = (
  editorRef: RefObject<HTMLElement | null>,
  previewRef: RefObject<HTMLElement | null>,
  isEnabled: boolean
) => {
  useEffect(() => {
    if (!isEnabled || !editorRef.current || !previewRef.current) {
      return
    }

    const editorEl = editorRef.current
    const previewEl = previewRef.current

    const handleScroll = (e: Event) => {
      // Placeholder for scroll logic
      // const target = e.target as HTMLElement
      // console.log('Scrolling:', target === editorEl ? 'Editor' : 'Preview')
    }

    // Add passive listeners for better performance
    const options: AddEventListenerOptions = { passive: true }

    editorEl.addEventListener('scroll', handleScroll, options)
    previewEl.addEventListener('scroll', handleScroll, options)

    return () => {
      editorEl.removeEventListener('scroll', handleScroll)
      previewEl.removeEventListener('scroll', handleScroll)
    }
  }, [editorRef, previewRef, isEnabled])
}
