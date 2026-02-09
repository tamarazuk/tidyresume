import { render, screen, cleanup, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ViralLoopCTA } from '../viral-loop-cta'
import { useOwnerCheck } from '@/hooks/use-owner-check'

vi.mock('@/hooks/use-owner-check', () => ({
  useOwnerCheck: vi.fn(),
}))

describe('ViralLoopCTA', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('renders when user is not the owner after delay', () => {
    vi.mocked(useOwnerCheck).mockReturnValue({ isOwner: false })
    render(<ViralLoopCTA resumeId="test-id" />)
    
    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(screen.getByText(/Tidy up your resume/i)).toBeInTheDocument()
  })

  it('does not render when user is the owner', () => {
    vi.mocked(useOwnerCheck).mockReturnValue({ isOwner: true })
    const { container } = render(<ViralLoopCTA resumeId="test-id" />)
    
    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(container).toBeEmptyDOMElement()
  })

  it('renders only after 2 seconds', () => {
    vi.mocked(useOwnerCheck).mockReturnValue({ isOwner: false })
    
    render(<ViralLoopCTA resumeId="test-id" />)
    
    // Should be invisible immediately
    const cta = screen.getByText(/Tidy up your resume/i).closest('div.fixed')
    expect(cta).toHaveClass('opacity-0')
    
    // Advance timers by 1999ms - still should be invisible
    act(() => {
      vi.advanceTimersByTime(1999)
    })
    expect(cta).toHaveClass('opacity-0')

    // Advance to 2000ms
    act(() => {
      vi.advanceTimersByTime(1)
    })
    
    // Should be visible now
    expect(cta).toHaveClass('opacity-100')
  })

  it('applies animation classes when visible', () => {
    vi.mocked(useOwnerCheck).mockReturnValue({ isOwner: false })
    render(<ViralLoopCTA resumeId="test-id" />)
    
    act(() => {
      vi.advanceTimersByTime(2000)
    })

    const cta = screen.getByText(/Tidy up your resume/i).closest('div.fixed')
    expect(cta).toHaveClass('translate-y-0', 'opacity-100')
    expect(cta).not.toHaveClass('translate-y-10', 'opacity-0')
  })

  it('links to /resumes and opens in a new tab', () => {
    vi.mocked(useOwnerCheck).mockReturnValue({ isOwner: false })
    render(<ViralLoopCTA resumeId="test-id" />)
    
    act(() => {
      vi.advanceTimersByTime(2000)
    })

    const link = screen.getByText(/Tidy up your resume/i).closest('a')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/resumes')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('shows tooltip on hover', async () => {
    vi.mocked(useOwnerCheck).mockReturnValue({ isOwner: false })
    render(<ViralLoopCTA resumeId="test-id" />)
    
    act(() => {
      vi.advanceTimersByTime(2000)
    })

    const trigger = screen.getByText(/Tidy up your resume/i).closest('[data-slot="tooltip-trigger"]')
    expect(trigger).toBeInTheDocument()
    
    // Tooltip should not be visible initially
    expect(screen.queryByText(/It's free and takes minutes/i)).not.toBeInTheDocument()

    // Trigger hover
    await act(async () => {
      trigger!.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    })

    // Advance timers for tooltip
    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(screen.getByText(/It's free and takes minutes/i)).toBeInTheDocument()
  })

  it('is hidden during print', () => {
    vi.mocked(useOwnerCheck).mockReturnValue({ isOwner: false })
    render(<ViralLoopCTA resumeId="test-id" />)
    
    act(() => {
      vi.advanceTimersByTime(2000)
    })

    const cta = screen.getByText(/Tidy up your resume/i).closest('div.fixed')
    expect(cta).toHaveClass('print:hidden')
  })
})
