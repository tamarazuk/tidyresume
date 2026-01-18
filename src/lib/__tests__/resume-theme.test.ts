import { describe, it, expect } from 'vitest'
import {
  DEFAULT_RESUME_THEME,
  getResumeAccentClassName,
  getResumeAccentSwatch,
  resolveResumeAccent,
} from '@/lib/resume-theme'

describe('resume-theme helpers', () => {
  it('falls back to the default accent', () => {
    expect(resolveResumeAccent()).toBe(DEFAULT_RESUME_THEME.accent)
    expect(resolveResumeAccent(null)).toBe(DEFAULT_RESUME_THEME.accent)
  })

  it('returns the expected accent class name', () => {
    expect(getResumeAccentClassName('teal')).toBe('resume-accent-teal')
  })

  it('returns the expected accent swatch token', () => {
    expect(getResumeAccentSwatch('rose')).toBe('var(--resume-accent-rose)')
  })
})
