import { describe, it, expect, vi } from 'vitest'
import { getScrollAnchors } from '../scroll-sync'

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
      scrollDOM: { scrollTop: 0, scrollHeight: 1000 },
    } as any

    // Mock Preview Element
    const previewEl = document.createElement('div')
    previewEl.innerHTML = `
      <h1 id="header-1" data-line="0">Header 1</h1>
      <p>Some text</p>
      <h2 id="header-2" data-line="9">Header 2</h2>
    `
    // We'll need to mock offsetTop as it's not available in JSDOM easily
    const h1 = previewEl.querySelector('#header-1') as HTMLElement
    const h2 = previewEl.querySelector('#header-2') as HTMLElement
    Object.defineProperty(h1, 'offsetTop', { value: 100 })
    Object.defineProperty(h2, 'offsetTop', { value: 300 })

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
      previewTop: 0, // scrollHeight - clientHeight = 0 - 0 in JSDOM usually
    })
  })
})
