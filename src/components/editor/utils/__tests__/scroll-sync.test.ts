import { describe, it, expect, vi } from 'vitest'
import type { EditorView } from '@codemirror/view'
import { getScrollAnchors, calculateScrollPosition, type ScrollAnchor } from '../scroll-sync'

describe('scroll-sync utils', () => {
  describe('getScrollAnchors', () => {
    it('identifies headers in the editor and finds them in the preview', () => {
      // Mock EditorView
      const mockEditorView = {
        state: {
          doc: {
            lines: 100,
            line: (n: number) => ({ from: n * 10, text: `Line ${n}` }),
          },
        },
        lineBlockAt: (pos: number) => ({ top: pos }),
        scrollDOM: { scrollTop: 0, scrollHeight: 1000, clientHeight: 0 },
      } as unknown as EditorView

      // Mock Preview Element
      const previewEl = document.createElement('div')
      previewEl.innerHTML = `
        <h1 id="header-1" data-line="0">Header 1</h1>
        <p>Some text</p>
        <h2 id="header-2" data-line="9">Header 2</h2>
      `
      // We'll need to mock getBoundingClientRect as it's not available in JSDOM easily
      const h1 = previewEl.querySelector('#header-1') as HTMLElement
      const h2 = previewEl.querySelector('#header-2') as HTMLElement
      
      vi.spyOn(previewEl, 'getBoundingClientRect').mockReturnValue({ top: 0 } as DOMRect)
      vi.spyOn(h1, 'getBoundingClientRect').mockReturnValue({ top: 100 } as DOMRect)
      vi.spyOn(h2, 'getBoundingClientRect').mockReturnValue({ top: 300 } as DOMRect)
      previewEl.scrollTop = 0

      // Mock the markdown content to match
      mockEditorView.state.doc.line = vi.fn().mockImplementation((n: number) => {
        if (n === 1) return { from: 0, text: '# Header 1' }
        if (n === 10) return { from: 100, text: '## Header 2' }
        return { from: n * 10, text: 'other' }
      })

      const anchors = getScrollAnchors(mockEditorView, previewEl)

      expect(anchors).toHaveLength(3)
      expect(anchors[0]).toMatchObject({
        line: 0, // 0-indexed
        editorTop: 0,
        previewTop: 100,
      })
      expect(anchors[1]).toMatchObject({
        line: 9, // 0-indexed
        editorTop: 100,
        previewTop: 300,
      })
      expect(anchors[2]).toMatchObject({
        line: 99,
        previewTop: 0,
      })
    })
  })

  describe('calculateScrollPosition', () => {
    const anchors: ScrollAnchor[] = [
      { line: 0, editorTop: 0, previewTop: 0 },
      { line: 10, editorTop: 200, previewTop: 400 },
      { line: 20, editorTop: 500, previewTop: 800 },
    ]

    it('interpolates correctly from editor to preview', () => {
      // Middle of first range (100 is half of 200) -> should be 200 (half of 400)
      expect(calculateScrollPosition(100, anchors, 'editor')).toBe(200)
      
      // 3/4 of second range: 200 + 0.75 * (500-200) = 200 + 0.75 * 300 = 425
      // Target: 400 + 0.75 * (800-400) = 400 + 0.75 * 400 = 700
      expect(calculateScrollPosition(425, anchors, 'editor')).toBe(700)
    })

    it('interpolates correctly from preview to editor', () => {
      // Middle of first range (200 is half of 400) -> should be 100 (half of 200)
      expect(calculateScrollPosition(200, anchors, 'preview')).toBe(100)
    })

    it('handles exact anchor positions', () => {
      expect(calculateScrollPosition(200, anchors, 'editor')).toBe(400)
      expect(calculateScrollPosition(800, anchors, 'preview')).toBe(500)
    })

    it('clamps to boundaries', () => {
      expect(calculateScrollPosition(-10, anchors, 'editor')).toBe(0)
      expect(calculateScrollPosition(1000, anchors, 'editor')).toBe(800)
    })
  })
})