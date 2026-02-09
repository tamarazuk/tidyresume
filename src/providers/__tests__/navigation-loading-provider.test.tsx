import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  NavigationLoadingProvider,
  useNavigationLoading,
} from '../navigation-loading-provider'

// Hoist mockPush
const { mockPush } = vi.hoisted(() => {
  return {
    mockPush: vi.fn(),
  }
})

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Test component that uses the hook
function TestComponent() {
  const { isNavigating, navigateTo } = useNavigationLoading()
  return (
    <div>
      <div data-testid="status">{isNavigating ? 'Navigating...' : 'Idle'}</div>
      <button onClick={() => navigateTo('/test-path')}>Navigate</button>
    </div>
  )
}

describe('NavigationLoadingProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('provides navigation context values', () => {
    render(
      <NavigationLoadingProvider>
        <TestComponent />
      </NavigationLoadingProvider>
    )

    expect(screen.getByTestId('status')).toHaveTextContent('Idle')
  })

  it('calls router.push when navigateTo is called', () => {
    render(
      <NavigationLoadingProvider>
        <TestComponent />
      </NavigationLoadingProvider>
    )

    fireEvent.click(screen.getByText('Navigate'))

    expect(mockPush).toHaveBeenCalledWith('/test-path')
  })

  it('throws error when hook is used outside provider', () => {
    // Suppress console.error for this test since we expect an error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow(
      'useNavigationLoading must be used within NavigationLoadingProvider'
    )

    consoleSpy.mockRestore()
  })
})
