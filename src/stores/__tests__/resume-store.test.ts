import { describe, it, expect, beforeEach } from 'vitest'
import { useResumeStore } from '../resume-store'
import { DEFAULT_RESUME_MARGINS, DEFAULT_RESUME_THEME } from '@/lib/resume-theme'

describe('useResumeStore (theme)', () => {
  beforeEach(() => {
    useResumeStore.persist?.clearStorage?.()
    useResumeStore.getState().resetResume()
  })

  it('initializes with the default theme', () => {
    const state = useResumeStore.getState()
    expect(state.resumeDisplay.theme.accent).toBe(DEFAULT_RESUME_THEME.accent)
    expect(state.resumeDisplay.theme.typography?.headingSize).toBe(
      DEFAULT_RESUME_THEME.typography?.headingSize
    )
    expect(state.resumeDisplay.theme.typography?.bodySize).toBe(
      DEFAULT_RESUME_THEME.typography?.bodySize
    )
  })

  it('updates the accent color', () => {
    useResumeStore.getState().setResumeAccent('teal')
    const state = useResumeStore.getState()
    expect(state.resumeDisplay.theme.accent).toBe('teal')
  })

  it('merges theme defaults', () => {
    useResumeStore.getState().setResumeTheme({
      accent: 'rose',
      typography: { headingSize: 'lg' },
    })
    const state = useResumeStore.getState()
    expect(state.resumeDisplay.theme.accent).toBe('rose')
    expect(state.resumeDisplay.theme.typography?.heading).toBe(
      DEFAULT_RESUME_THEME.typography?.heading
    )
    expect(state.resumeDisplay.theme.typography?.headingSize).toBe('lg')
  })
})

describe('useResumeStore (margins)', () => {
  beforeEach(() => {
    useResumeStore.persist?.clearStorage?.()
    useResumeStore.getState().resetResume()
  })

  it('initializes with default margins', () => {
    const state = useResumeStore.getState()
    expect(state.resumeDisplay.theme.margins).toEqual(DEFAULT_RESUME_MARGINS)
  })

  it('persists custom margin values', () => {
    const customMargins = { top: 10, right: 20, bottom: 12, left: 25 }
    useResumeStore.getState().setResumeTheme({ margins: customMargins })
    const state = useResumeStore.getState()
    expect(state.resumeDisplay.theme.margins).toEqual(customMargins)
  })

  it('merges partial margin updates with existing values', () => {
    useResumeStore.getState().setResumeTheme({
      margins: { top: 10, right: 20, bottom: 12, left: 25 },
    })
    useResumeStore.getState().setResumeTheme({
      margins: { top: 8 },
    })
    const state = useResumeStore.getState()
    expect(state.resumeDisplay.theme.margins?.top).toBe(8)
    expect(state.resumeDisplay.theme.margins?.right).toBe(20)
    expect(state.resumeDisplay.theme.margins?.bottom).toBe(12)
    expect(state.resumeDisplay.theme.margins?.left).toBe(25)
  })

  it('preserves margins when updating other theme properties', () => {
    const customMargins = { top: 10, right: 20, bottom: 12, left: 25 }
    useResumeStore.getState().setResumeTheme({ margins: customMargins })
    useResumeStore.getState().setResumeAccent('teal')
    const state = useResumeStore.getState()
    expect(state.resumeDisplay.theme.margins).toEqual(customMargins)
  })

  it('restores default margins on reset', () => {
    useResumeStore.getState().setResumeTheme({
      margins: { top: 10, right: 20, bottom: 12, left: 25 },
    })
    useResumeStore.getState().resetResume()
    const state = useResumeStore.getState()
    expect(state.resumeDisplay.theme.margins).toEqual(DEFAULT_RESUME_MARGINS)
  })

  it('clamps out-of-range margin values', () => {
    useResumeStore.getState().setResumeTheme({
      margins: { top: 1, right: 99, bottom: -5, left: 200 },
    })
    const state = useResumeStore.getState()
    expect(state.resumeDisplay.theme.margins?.top).toBe(5)
    expect(state.resumeDisplay.theme.margins?.right).toBe(40)
    expect(state.resumeDisplay.theme.margins?.bottom).toBe(5)
    expect(state.resumeDisplay.theme.margins?.left).toBe(40)
  })
})
