import type { EditorView } from '@codemirror/view'

export interface ScrollAnchor {
  line: number
  editorTop: number
  previewTop: number
}

/**
 * Extracts synchronization anchors by matching markdown lines with preview elements.
 * 
 * @param editorView The CodeMirror EditorView instance
 * @param previewEl The rendered preview container (scroller)
 * @returns Array of ScrollAnchor points
 */
export function getScrollAnchors(
  editorView: EditorView,
  previewEl: HTMLElement
): ScrollAnchor[] {
  const anchors: ScrollAnchor[] = []
  const { doc } = editorView.state

  // 1. Identify potential anchor lines in the markdown source
  const anchorLines: number[] = []
  for (let i = 1; i <= doc.lines; i++) {
    const line = doc.line(i)
    const text = line.text.trim()
    
    // Headers (#), Horizontal Rules (---, ***, ___), and TidyResume custom markers
    if (
      text.startsWith('#') ||
      text === '---' ||
      text === '***' ||
      text === '___' ||
      /^(?:\[\[PAGEBREAK\]\]|\/\/\/|\[\[HR:accent\]\]|\+\+\+)$/i.test(text)
    ) {
      anchorLines.push(i - 1) // 0-indexed for data-line attribute
    }
  }

  // 2. Map these lines to preview elements using data-line attribute
  anchorLines.forEach((lineIdx) => {
    // Look for data-line on the element or its immediate children
    const element = previewEl.querySelector(`[data-line="${lineIdx}"]`) as HTMLElement
    
    if (element) {
      const linePos = doc.line(lineIdx + 1).from
      const editorTop = editorView.lineBlockAt(linePos).top
      
      // Use getBoundingClientRect to account for potential scaling or nested offsetParents
      const previewRect = element.getBoundingClientRect()
      const scrollerRect = previewEl.getBoundingClientRect()
      const previewTop = previewRect.top - scrollerRect.top + previewEl.scrollTop

      anchors.push({
        line: lineIdx,
        editorTop,
        previewTop,
      })
    }
  })

  // 3. Ensure we have top and bottom boundaries as anchors
  if (anchors.length === 0 || anchors[0].line !== 0) {
    anchors.unshift({
      line: 0,
      editorTop: 0,
      previewTop: 0,
    })
  }

  const lastLineIdx = doc.lines - 1
  if (anchors[anchors.length - 1].line !== lastLineIdx) {
    const editorMaxScroll = editorView.scrollDOM.scrollHeight - editorView.scrollDOM.clientHeight
    const previewMaxScroll = previewEl.scrollHeight - previewEl.clientHeight
    
    anchors.push({
      line: lastLineIdx,
      editorTop: Math.max(0, editorMaxScroll),
      previewTop: Math.max(0, previewMaxScroll),
    })
  }

  return anchors
}

/**
 * Calculates the target scroll position based on the current scroll position and anchors.
 * 
 * @param scrollTop The current scroll position in the source container
 * @param anchors Array of synchronization anchors
 * @param source The source of the scroll ('editor' or 'preview')
 * @returns The calculated scroll position for the target container
 */
export function calculateScrollPosition(
  scrollTop: number,
  anchors: ScrollAnchor[],
  source: 'editor' | 'preview'
): number {
  if (anchors.length === 0) return scrollTop

  const sourceKey = source === 'editor' ? 'editorTop' : 'previewTop'
  const targetKey = source === 'editor' ? 'previewTop' : 'editorTop'

  // Clamp to boundaries
  if (scrollTop <= anchors[0][sourceKey]) return anchors[0][targetKey]
  if (scrollTop >= anchors[anchors.length - 1][sourceKey])
    return anchors[anchors.length - 1][targetKey]

  // Find the two nearest anchors
  let startAnchor = anchors[0]
  let endAnchor = anchors[anchors.length - 1]

  for (let i = 0; i < anchors.length - 1; i++) {
    if (
      scrollTop >= anchors[i][sourceKey] &&
      scrollTop <= anchors[i + 1][sourceKey]
    ) {
      startAnchor = anchors[i]
      endAnchor = anchors[i + 1]
      break
    }
  }

  // Linear interpolation
  const sourceRange = endAnchor[sourceKey] - startAnchor[sourceKey]
  if (sourceRange === 0) return startAnchor[targetKey]

  const progress = (scrollTop - startAnchor[sourceKey]) / sourceRange
  const targetRange = endAnchor[targetKey] - startAnchor[targetKey]

  return startAnchor[targetKey] + progress * targetRange
}
