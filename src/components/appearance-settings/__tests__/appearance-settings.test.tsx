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
    expect(screen.getByText('Heading font')).toBeInTheDocument()
    expect(screen.getByText('Heading size')).toBeInTheDocument()
    expect(screen.getByText('Body font')).toBeInTheDocument()
    expect(screen.getByText('Body size')).toBeInTheDocument()
    expect(screen.getByText('Body line height')).toBeInTheDocument()
    expect(screen.getByText('Body letter spacing')).toBeInTheDocument()
  })

  it('shows heading and body size options', () => {
    render(<AppearanceSettings />)

    fireEvent.click(
      screen.getByRole('button', { name: /customize appearance/i })
    )

    const triggers = Array.from(
      document.querySelectorAll('[data-slot="select-trigger"]')
    )
    expect(triggers).toHaveLength(6)

    fireEvent.click(triggers[1])
    expect(screen.getAllByText('Extra small').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Small').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Medium').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Large').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Extra large').length).toBeGreaterThan(0)

    fireEvent.click(triggers[3])
    expect(screen.getAllByText('10 px').length).toBeGreaterThan(0)
    expect(screen.getAllByText('12 px').length).toBeGreaterThan(0)
    expect(screen.getAllByText('16 px').length).toBeGreaterThan(0)

    fireEvent.click(triggers[4])
    expect(screen.getAllByText('1.2').length).toBeGreaterThan(0)
    expect(screen.getAllByText('1.4').length).toBeGreaterThan(0)
    expect(screen.getAllByText('1.8').length).toBeGreaterThan(0)

    fireEvent.click(triggers[5])
    expect(screen.getAllByText('Tight').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Normal').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Wide').length).toBeGreaterThan(0)
  })
})
