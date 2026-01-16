import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { OwnerViewBadge } from '../owner-view-badge'
import { TooltipProvider } from '@/components/ui/tooltip'

describe('OwnerViewBadge', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders correctly with the "Owner View" text', () => {
    render(
      <TooltipProvider>
        <OwnerViewBadge />
      </TooltipProvider>
    )
    expect(screen.getByText(/Owner View/i)).toBeDefined()
  })

  it('is visible when rendered', () => {
    render(
      <TooltipProvider>
        <OwnerViewBadge />
      </TooltipProvider>
    )
    const badge = screen.getByRole('status')
    expect(badge).toBeDefined()
  })
})
