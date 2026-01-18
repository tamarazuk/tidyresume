import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ThemeToggle from '../theme-toggle'

let resolvedTheme = 'light'
const setTheme = vi.fn()

vi.mock('next-themes', () => ({
  useTheme: () => ({
    resolvedTheme,
    setTheme,
  }),
}))

vi.mock('@/hooks/use-mounted', () => ({
  useMounted: () => true,
}))

describe('ThemeToggle', () => {
  it('renders the light-mode label when theme is light', () => {
    resolvedTheme = 'light'

    render(
      <ThemeToggle
        lightLabel="Switch to dark mode"
        darkLabel="Switch to light mode"
      />
    )

    expect(screen.getByText('Switch to dark mode')).toBeInTheDocument()
  })

  it('renders the dark-mode label when theme is dark', () => {
    resolvedTheme = 'dark'

    render(
      <ThemeToggle
        lightLabel="Switch to dark mode"
        darkLabel="Switch to light mode"
      />
    )

    expect(screen.getByText('Switch to light mode')).toBeInTheDocument()
  })
})
