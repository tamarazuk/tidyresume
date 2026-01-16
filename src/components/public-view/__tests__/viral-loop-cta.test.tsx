import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ViralLoopCTA } from '../viral-loop-cta'
import { useOwnerCheck } from '@/hooks/use-owner-check'

vi.mock('@/hooks/use-owner-check', () => ({
  useOwnerCheck: vi.fn(),
}))

describe('ViralLoopCTA', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders when user is not the owner', () => {
    vi.mocked(useOwnerCheck).mockReturnValue(false)
    render(<ViralLoopCTA resumeId="test-id" />)
    expect(screen.getByText(/Tidy up your resume/i)).toBeInTheDocument()
  })

  it('does not render when user is the owner', () => {
    vi.mocked(useOwnerCheck).mockReturnValue(true)
    const { container } = render(<ViralLoopCTA resumeId="test-id" />)
    expect(container).toBeEmptyDOMElement()
  })
})
