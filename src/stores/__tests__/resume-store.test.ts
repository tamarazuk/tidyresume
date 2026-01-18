import { describe, it, expect, beforeEach } from 'vitest'
import { useResumeStore } from '../resume-store'
import { DEFAULT_RESUME_THEME } from '@/lib/resume-theme'

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
