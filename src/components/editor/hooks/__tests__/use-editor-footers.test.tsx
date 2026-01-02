import { describe, it, expect } from 'vitest'
import { render, renderHook, screen } from '@testing-library/react'
import type { FooterLayoutItem } from '../footer-items'
import { useEditorFooters } from '../use-editor-footers'

describe('useEditorFooters', () => {
  it('renders word and character counts', () => {
    const layout: FooterLayoutItem[] = [
      { type: 'custom', id: 'wordCount' },
      { type: 'custom', id: 'characterCount' },
    ]

    const { result } = renderHook(() =>
      useEditorFooters({ value: 'Hello world', layout })
    )

    render(<>{result.current.defFooters}</>)

    expect(screen.getByText('Words:')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('Characters:')).toBeInTheDocument()
    expect(screen.getByText('11')).toBeInTheDocument()
  })

  it('renders save status and warnings when provided', () => {
    const layout: FooterLayoutItem[] = [
      { type: 'custom', id: 'saveStatus' },
      { type: 'custom', id: 'warning' },
    ]

    const { result } = renderHook(() =>
      useEditorFooters({
        value: '',
        layout,
        saveStatus: 'saved',
        warningMessage: 'Image too large',
      })
    )

    render(<>{result.current.defFooters}</>)

    expect(screen.getByText('Saved locally')).toBeInTheDocument()
    expect(screen.getByText('Image too large')).toBeInTheDocument()
  })
})
