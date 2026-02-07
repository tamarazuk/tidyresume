import { describe, it, expect } from 'vitest'
import {
  DEFAULT_RESUME_MARGINS,
  DEFAULT_RESUME_THEME,
  MIN_MARGIN,
  MAX_MARGIN,
  getResumeAccentClassName,
  getResumeAccentSwatch,
  getResumeBodyFontClassName,
  getResumeBodyLineHeightClassName,
  getResumeBodyLetterSpacingClassName,
  getResumeBodySizeClassName,
  getResumeHeadingFontClassName,
  getResumeHeadingSizeClassName,
  getResumeMarginStyle,
  normalizeResumeMargins,
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

describe('normalizeResumeMargins', () => {
  it('returns defaults for null/undefined input', () => {
    expect(normalizeResumeMargins(null)).toEqual(DEFAULT_RESUME_MARGINS)
    expect(normalizeResumeMargins(undefined)).toEqual(DEFAULT_RESUME_MARGINS)
  })

  it('returns defaults for non-object input', () => {
    expect(normalizeResumeMargins('invalid')).toEqual(DEFAULT_RESUME_MARGINS)
    expect(normalizeResumeMargins(42)).toEqual(DEFAULT_RESUME_MARGINS)
    expect(normalizeResumeMargins([])).toEqual(DEFAULT_RESUME_MARGINS)
  })

  it('preserves valid margin values', () => {
    const margins = { top: 10, right: 20, bottom: 12, left: 25 }
    expect(normalizeResumeMargins(margins)).toEqual(margins)
  })

  it('clamps values below minimum', () => {
    const result = normalizeResumeMargins({ top: 1, right: 2, bottom: 3, left: 4 })
    expect(result.top).toBe(MIN_MARGIN)
    expect(result.right).toBe(MIN_MARGIN)
    expect(result.bottom).toBe(MIN_MARGIN)
    expect(result.left).toBe(MIN_MARGIN)
  })

  it('clamps values above maximum', () => {
    const result = normalizeResumeMargins({ top: 99, right: 50, bottom: 60, left: 100 })
    expect(result.top).toBe(MAX_MARGIN)
    expect(result.right).toBe(MAX_MARGIN)
    expect(result.bottom).toBe(MAX_MARGIN)
    expect(result.left).toBe(MAX_MARGIN)
  })

  it('rounds fractional values', () => {
    const result = normalizeResumeMargins({ top: 15.7, right: 10.3, bottom: 20.5, left: 8.1 })
    expect(result.top).toBe(16)
    expect(result.right).toBe(10)
    expect(result.bottom).toBe(21)
    expect(result.left).toBe(8)
  })

  it('falls back to default for non-numeric fields', () => {
    const result = normalizeResumeMargins({
      top: 'bad',
      right: null,
      bottom: undefined,
      left: NaN,
    })
    expect(result).toEqual(DEFAULT_RESUME_MARGINS)
  })
})

describe('getResumeMarginStyle', () => {
  it('returns default CSS variables when no margins provided', () => {
    const style = getResumeMarginStyle(null)
    expect(style).toEqual({
      '--preview-paper-padding-top': '15mm',
      '--preview-paper-padding-right': '15mm',
      '--preview-paper-padding-bottom': '15mm',
      '--preview-paper-padding-left': '15mm',
    })
  })

  it('returns default CSS variables for undefined input', () => {
    const style = getResumeMarginStyle(undefined)
    expect(style).toEqual({
      '--preview-paper-padding-top': '15mm',
      '--preview-paper-padding-right': '15mm',
      '--preview-paper-padding-bottom': '15mm',
      '--preview-paper-padding-left': '15mm',
    })
  })

  it('returns custom CSS variables for provided margins', () => {
    const style = getResumeMarginStyle({ top: 10, right: 20, bottom: 12, left: 25 })
    expect(style).toEqual({
      '--preview-paper-padding-top': '10mm',
      '--preview-paper-padding-right': '20mm',
      '--preview-paper-padding-bottom': '12mm',
      '--preview-paper-padding-left': '25mm',
    })
  })
})
