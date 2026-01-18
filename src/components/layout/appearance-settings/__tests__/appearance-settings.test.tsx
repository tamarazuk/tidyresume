import { render, screen, fireEvent, cleanup, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import AppearanceSettings from '..'
import { useResumeStore } from '@/stores/resume-store'

describe('AppearanceSettings', () => {
  beforeEach(() => {
    useResumeStore.persist?.clearStorage?.()
    useResumeStore.setState((state) => ({
      resumeDisplay: {
        ...state.resumeDisplay,
        theme: {
          ...state.resumeDisplay.theme,
          accent: 'indigo',
        },
      },
    }))
  })

  afterEach(() => {
    cleanup()
  })

  it('renders accent swatches and marks the selected accent', () => {
    render(<AppearanceSettings />)

    fireEvent.click(
      screen.getByRole('button', { name: /customize appearance/i })
    )

    const indigo = screen.getByRole('radio', { name: 'Indigo' })
    const teal = screen.getByRole('radio', { name: 'Teal' })

    expect(indigo).toHaveAttribute('aria-checked', 'true')
    expect(teal).toHaveAttribute('aria-checked', 'false')
  })

  it('updates the accent when a swatch is clicked', () => {
    render(<AppearanceSettings />)

    fireEvent.click(
      screen.getByRole('button', { name: /customize appearance/i })
    )

    fireEvent.click(screen.getByRole('radio', { name: 'Teal' }))

    expect(useResumeStore.getState().resumeDisplay.theme.accent).toBe('teal')
  })

  it('shows a tooltip on hover', () => {
    render(<AppearanceSettings />)

    fireEvent.click(
      screen.getByRole('button', { name: /customize appearance/i })
    )

    const teal = screen.getByRole('radio', { name: 'Teal' })

    expect(screen.queryByText('Teal')).not.toBeInTheDocument()

    act(() => {
      teal.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    })

    expect(screen.getByText('Teal')).toBeInTheDocument()
  })

  it('renders typography controls', () => {
    render(<AppearanceSettings />)

    fireEvent.click(
      screen.getByRole('button', { name: /customize appearance/i })
    )

    expect(screen.getByText('Typography')).toBeInTheDocument()
    expect(screen.getByText('Heading')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('shows heading and body size options', () => {
    render(<AppearanceSettings />)

    fireEvent.click(
      screen.getByRole('button', { name: /customize appearance/i })
    )

    const triggers = Array.from(
      document.querySelectorAll('[data-slot="select-trigger"]')
    )
    expect(triggers).toHaveLength(4)

    fireEvent.click(triggers[1])
    expect(screen.getAllByText('Small').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Medium').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Large').length).toBeGreaterThan(0)

    fireEvent.click(triggers[3])
    expect(screen.getAllByText('14 px').length).toBeGreaterThan(0)
    expect(screen.getAllByText('15 px').length).toBeGreaterThan(0)
    expect(screen.getAllByText('16 px').length).toBeGreaterThan(0)
  })
})
