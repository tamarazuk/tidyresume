import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import SyncScrollToggle from '../sync-scroll-toggle'
import { useEditorViewStore } from '@/stores/editor-view-store'

// Mock the Tooltip component since it might rely on contexts not present in tests
vi.mock('@/components/ui/tooltip', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipTrigger: ({ children, onClick, 'aria-label': ariaLabel, className }: any) => (
    <button onClick={onClick} aria-label={ariaLabel} className={className}>
      {children}
    </button>
  ),
  TooltipContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('SyncScrollToggle', () => {
  beforeEach(() => {
    // Reset store state
    useEditorViewStore.setState({
      isSyncScrollEnabled: true,
      toggleSyncScroll: () => useEditorViewStore.setState(s => ({ isSyncScrollEnabled: !s.isSyncScrollEnabled }))
    })
  })

  afterEach(() => {
    cleanup()
  })

  it('renders correctly when enabled', () => {
    render(<SyncScrollToggle />)
    const button = screen.getByRole('button', { name: /disable sync scroll/i })
    expect(button).toBeInTheDocument()
    // Check if it has the active class (simplified check)
    expect(button.className).toContain('text-brand-primary')
  })

  it('renders correctly when disabled', () => {
    useEditorViewStore.setState({ isSyncScrollEnabled: false })
    render(<SyncScrollToggle />)
    const button = screen.getByRole('button', { name: /enable sync scroll/i })
    expect(button).toBeInTheDocument()
    expect(button.className).toContain('text-muted-foreground/50')
  })

  it('toggles state on click', () => {
    render(<SyncScrollToggle />)
    const button = screen.getByRole('button')
    
    // Initially enabled
    expect(useEditorViewStore.getState().isSyncScrollEnabled).toBe(true)
    
    // Click to disable
    fireEvent.click(button)
    expect(useEditorViewStore.getState().isSyncScrollEnabled).toBe(false)
    
    // Click to enable
    fireEvent.click(button)
    expect(useEditorViewStore.getState().isSyncScrollEnabled).toBe(true)
  })
})
