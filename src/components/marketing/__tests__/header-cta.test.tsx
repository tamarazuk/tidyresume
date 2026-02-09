import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import HeaderCta from '../header-cta'

// Hoist mocks to ensure they are available
const { mockUseResumeDraftStatus, mockNavigateTo } = vi.hoisted(() => {
  return {
    mockUseResumeDraftStatus: vi.fn(),
    mockNavigateTo: vi.fn(),
  }
})

vi.mock('@/hooks/use-resume-draft-status', () => ({
  useResumeDraftStatus: mockUseResumeDraftStatus,
}))

vi.mock('@/providers/navigation-loading-provider', () => ({
  useNavigationLoading: () => ({
    navigateTo: mockNavigateTo,
  }),
}))

describe('HeaderCta', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseResumeDraftStatus.mockReturnValue(false)
  })

  afterEach(() => {
    cleanup()
  })

  it('renders "Start Writing" when no draft is stored', () => {
    mockUseResumeDraftStatus.mockReturnValue(false)
    render(<HeaderCta />)

    expect(screen.getByText('Start Writing')).toBeInTheDocument()
    expect(screen.queryByText('Continue Writing')).not.toBeInTheDocument()
  })

  it('renders "Continue Writing" when a draft is stored', () => {
    mockUseResumeDraftStatus.mockReturnValue(true)
    render(<HeaderCta />)

    expect(screen.getByText('Continue Writing')).toBeInTheDocument()
    expect(screen.queryByText('Start Writing')).not.toBeInTheDocument()
  })

  it('navigates to /resumes when clicked', () => {
    render(<HeaderCta />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockNavigateTo).toHaveBeenCalledWith('/resumes')
  })
})
