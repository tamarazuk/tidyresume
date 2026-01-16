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
    vi.mocked(useOwnerCheck).mockReturnValue(false)
    render(<ViralLoopCTA resumeId="test-id" />)
    
    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(screen.getByText(/Tidy up your resume/i)).toBeInTheDocument()
  })

  it('does not render when user is the owner', () => {
    vi.mocked(useOwnerCheck).mockReturnValue(true)
    const { container } = render(<ViralLoopCTA resumeId="test-id" />)
    
    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(container).toBeEmptyDOMElement()
  })

  it('renders only after 2 seconds', () => {
    vi.mocked(useOwnerCheck).mockReturnValue(false)
    
    render(<ViralLoopCTA resumeId="test-id" />)
    
    // Should be invisible immediately
    expect(screen.getByRole('button').parentElement).toHaveClass('opacity-0')
    
    // Advance timers by 1999ms - still should be invisible
    act(() => {
      vi.advanceTimersByTime(1999)
    })
    expect(screen.getByRole('button').parentElement).toHaveClass('opacity-0')

    // Advance to 2000ms
    act(() => {
      vi.advanceTimersByTime(1)
    })
    
    // Should be visible now
    expect(screen.getByRole('button').parentElement).toHaveClass('opacity-100')
  })

  it('applies animation classes when visible', () => {
    vi.mocked(useOwnerCheck).mockReturnValue(false)
    render(<ViralLoopCTA resumeId="test-id" />)
    
    act(() => {
      vi.advanceTimersByTime(2000)
    })

    const container = screen.getByRole('button').parentElement
    expect(container).toHaveClass('translate-y-0', 'opacity-100')
    expect(container).not.toHaveClass('translate-y-10', 'opacity-0')
  })
})
