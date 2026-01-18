import { describe, it, expect } from 'vitest'
import {
  DEFAULT_RESUME_THEME,
  getResumeAccentClassName,
  getResumeAccentSwatch,
  getResumeBodyFontClassName,
  getResumeBodyLineHeightClassName,
  getResumeBodyLetterSpacingClassName,
  getResumeBodySizeClassName,
  getResumeHeadingFontClassName,
  getResumeHeadingSizeClassName,
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

  it('returns typography class names', () => {
    expect(getResumeHeadingFontClassName('geologica')).toBe(
      'resume-font-heading-geologica'
    )
    expect(getResumeBodyFontClassName('noto-sans')).toBe(
      'resume-font-body-noto-sans'
    )
    expect(getResumeHeadingSizeClassName('xs')).toBe('resume-size-heading-xs')
    expect(getResumeHeadingSizeClassName('lg')).toBe('resume-size-heading-lg')
    expect(getResumeHeadingSizeClassName('16')).toBe('resume-size-heading-lg')
    expect(getResumeBodySizeClassName('10')).toBe('resume-size-body-10')
    expect(getResumeBodyLineHeightClassName('1.4')).toBe(
      'resume-leading-body-14'
    )
    expect(getResumeBodyLetterSpacingClassName('-0.025em')).toBe(
      'resume-tracking-body-tight'
    )
  })
})
