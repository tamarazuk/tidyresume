import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { PreviewToggle } from '../preview-toggle'
import { useEditorViewStore } from '@/stores/editor-view-store'

// Mock the store
vi.mock('@/stores/editor-view-store', () => ({
  useEditorViewStore: vi.fn(),
}))

describe('PreviewToggle', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders correctly', () => {
    // @ts-expect-error - mock
    useEditorViewStore.mockImplementation((selector) =>
      selector({
        editorViewState: { isPreviewMode: false },
        setEditorViewState: vi.fn(),
      })
    )

    render(<PreviewToggle />)
    expect(screen.getByLabelText(/Preview as visitor/i)).toBeDefined()
  })

  it('calls setEditorViewState when clicked', () => {
    const setEditorViewState = vi.fn()
    // @ts-expect-error - mock
    useEditorViewStore.mockImplementation((selector) =>
      selector({
        editorViewState: { isPreviewMode: false },
        setEditorViewState,
      })
    )

    render(<PreviewToggle />)
    const button = screen.getByLabelText(/Preview as visitor/i)
    fireEvent.click(button)

    expect(setEditorViewState).toHaveBeenCalledWith({ isPreviewMode: true })
  })
})
