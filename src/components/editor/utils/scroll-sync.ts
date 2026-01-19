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
      
      // We use offsetTop relative to the preview scroller
      const previewTop = element.offsetTop

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
