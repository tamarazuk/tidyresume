import { render, screen, fireEvent, cleanup, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import AppearanceSettings, { AppearanceSettingsSheet } from '..'
import { useResumeStore } from '@/stores/resume-store'

describe('AppearanceSettings', () => {
  beforeEach(() => {
    useResumeStore.persist?.clearStorage?.()
    useResumeStore.getState().resetResume()
    const draft = useResumeStore.getState().getActiveDraft()
    useResumeStore.getState().updateDraft(draft.draftId, {
      resumeDisplay: {
        ...draft.resumeDisplay,
        theme: {
          ...draft.resumeDisplay.theme,
          accent: 'indigo',
        },
      },
    })
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

    expect(
      useResumeStore.getState().getActiveDraft().resumeDisplay.theme.accent
    ).toBe('teal')
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

describe('AppearanceSettingsSheet', () => {
  beforeEach(() => {
    useResumeStore.persist?.clearStorage?.()
    useResumeStore.getState().resetResume()
    const draft = useResumeStore.getState().getActiveDraft()
    useResumeStore.getState().updateDraft(draft.draftId, {
      resumeDisplay: {
        ...draft.resumeDisplay,
        theme: {
          ...draft.resumeDisplay.theme,
          accent: 'indigo',
        },
      },
    })
  })

  afterEach(() => {
    cleanup()
  })

  it('renders settings content when open', () => {
    render(
      <AppearanceSettingsSheet open={true} onOpenChange={() => {}} />
    )

    expect(screen.getByText('Appearance')).toBeInTheDocument()
    expect(screen.getByText('Typography')).toBeInTheDocument()
    expect(screen.getByText('Page margins')).toBeInTheDocument()
  })

  it('does not render content when closed', () => {
    render(
      <AppearanceSettingsSheet open={false} onOpenChange={() => {}} />
    )

    expect(screen.queryByText('Typography')).not.toBeInTheDocument()
  })

  it('calls onOpenChange when close button is clicked', () => {
    const onOpenChange = vi.fn()
    render(
      <AppearanceSettingsSheet open={true} onOpenChange={onOpenChange} />
    )

    fireEvent.click(
      screen.getByRole('button', { name: /close appearance panel/i })
    )

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('defers margin updates until blur and clamps values', () => {
    render(
      <AppearanceSettingsSheet open={true} onOpenChange={() => {}} />
    )

    const topMarginInput = screen.getByLabelText('Top')
    fireEvent.change(topMarginInput, { target: { value: '45' } })

    expect(
      useResumeStore.getState().getActiveDraft().resumeDisplay.theme.margins?.top
    ).toBe(15)

    fireEvent.blur(topMarginInput)

    expect(
      useResumeStore.getState().getActiveDraft().resumeDisplay.theme.margins?.top
    ).toBe(40)
  })

  it('commits margin updates when Enter is pressed', () => {
    render(
      <AppearanceSettingsSheet open={true} onOpenChange={() => {}} />
    )

    const leftMarginInput = screen.getByLabelText('Left')
    fireEvent.change(leftMarginInput, { target: { value: '18' } })

    expect(
      useResumeStore.getState().getActiveDraft().resumeDisplay.theme.margins?.left
    ).toBe(15)

    fireEvent.keyDown(leftMarginInput, { key: 'Enter' })

    expect(
      useResumeStore.getState().getActiveDraft().resumeDisplay.theme.margins?.left
    ).toBe(18)
  })
})
