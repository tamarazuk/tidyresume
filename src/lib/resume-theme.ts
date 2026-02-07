import type { CSSProperties } from 'react'
import {
  RESUME_BODY_LETTER_SPACING_VALUES,
  RESUME_BODY_LINE_HEIGHT_VALUES,
} from '@/types/resume'
import type {
  ResumeAccent,
  ResumeBodySize,
  ResumeBodyLineHeight,
  ResumeBodyLetterSpacing,
  ResumeFont,
  ResumeHeadingSize,
  ResumeMargins,
  ResumeThemeSettings,
} from '@/types/resume'

export const DEFAULT_RESUME_MARGINS: ResumeMargins = {
  top: 15,
  right: 15,
  bottom: 15,
  left: 15,
}

export const MIN_MARGIN = 5
export const MAX_MARGIN = 40

export const DEFAULT_RESUME_THEME: ResumeThemeSettings = {
  accent: 'indigo',
  typography: {
    heading: 'geologica',
    body: 'noto-sans',
    headingSize: 'md',
    bodySize: '15',
    bodyLineHeight: '1.6',
    bodyLetterSpacing: '0',
  },
  margins: DEFAULT_RESUME_MARGINS,
}

export const RESUME_ACCENT_OPTIONS: Array<{
  value: ResumeAccent
  label: string
}> = [
  { value: 'indigo', label: 'Indigo' },
  { value: 'blue', label: 'Blue' },
  { value: 'teal', label: 'Teal' },
  { value: 'slate', label: 'Slate' },
  { value: 'emerald', label: 'Emerald' },
  { value: 'rose', label: 'Rose' },
]

export const RESUME_FONT_OPTIONS: Array<{
  value: ResumeFont
  label: string
}> = [
  { value: 'geologica', label: 'Geologica' },
  { value: 'noto-sans', label: 'Noto Sans' },
  { value: 'ibm-plex-sans', label: 'IBM Plex Sans' },
  { value: 'ibm-plex-serif', label: 'IBM Plex Serif' },
  { value: 'source-serif-4', label: 'Source Serif 4' },
]

export const RESUME_HEADING_SIZE_OPTIONS: Array<{
  value: ResumeHeadingSize
  label: string
}> = [
  { value: 'xs', label: 'Extra small' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra large' },
]

export const RESUME_BODY_SIZE_OPTIONS: Array<{
  value: ResumeBodySize
  label: string
}> = [
  { value: '10', label: '10 px' },
  { value: '11', label: '11 px' },
  { value: '12', label: '12 px' },
  { value: '13', label: '13 px' },
  { value: '14', label: '14 px' },
  { value: '15', label: '15 px' },
  { value: '16', label: '16 px' },
]

export const RESUME_BODY_LINE_HEIGHT_OPTIONS: Array<{
  value: ResumeBodyLineHeight
  label: string
}> = RESUME_BODY_LINE_HEIGHT_VALUES.map((value) => ({
  value,
  label: value,
}))

const RESUME_BODY_LETTER_SPACING_LABELS: Record<
  ResumeBodyLetterSpacing,
  string
> = {
  '-0.025em': 'Tight',
  '0': 'Normal',
  '0.025em': 'Relaxed',
  '0.05em': 'Wide',
}

export const RESUME_BODY_LETTER_SPACING_OPTIONS: Array<{
  value: ResumeBodyLetterSpacing
  label: string
}> = RESUME_BODY_LETTER_SPACING_VALUES.map((value) => ({
  value,
  label: RESUME_BODY_LETTER_SPACING_LABELS[value],
}))

export const RESUME_ACCENT_CLASS_NAMES: Record<ResumeAccent, string> = {
  indigo: 'resume-accent-indigo',
  blue: 'resume-accent-blue',
  teal: 'resume-accent-teal',
  slate: 'resume-accent-slate',
  emerald: 'resume-accent-emerald',
  rose: 'resume-accent-rose',
}

const RESUME_HEADING_FONT_CLASS_NAMES: Record<ResumeFont, string> = {
  geologica: 'resume-font-heading-geologica',
  'noto-sans': 'resume-font-heading-noto-sans',
  'ibm-plex-sans': 'resume-font-heading-ibm-plex-sans',
  'ibm-plex-serif': 'resume-font-heading-ibm-plex-serif',
  'source-serif-4': 'resume-font-heading-source-serif-4',
}

const RESUME_BODY_FONT_CLASS_NAMES: Record<ResumeFont, string> = {
  geologica: 'resume-font-body-geologica',
  'noto-sans': 'resume-font-body-noto-sans',
  'ibm-plex-sans': 'resume-font-body-ibm-plex-sans',
  'ibm-plex-serif': 'resume-font-body-ibm-plex-serif',
  'source-serif-4': 'resume-font-body-source-serif-4',
}

const RESUME_HEADING_SIZE_CLASS_NAMES: Record<ResumeHeadingSize, string> = {
  xs: 'resume-size-heading-xs',
  sm: 'resume-size-heading-sm',
  md: 'resume-size-heading-md',
  lg: 'resume-size-heading-lg',
  xl: 'resume-size-heading-xl',
}

const RESUME_BODY_SIZE_CLASS_NAMES: Record<ResumeBodySize, string> = {
  10: 'resume-size-body-10',
  11: 'resume-size-body-11',
  12: 'resume-size-body-12',
  13: 'resume-size-body-13',
  14: 'resume-size-body-14',
  15: 'resume-size-body-15',
  16: 'resume-size-body-16',
}

const RESUME_BODY_LINE_HEIGHT_CLASS_NAMES: Record<ResumeBodyLineHeight, string> =
  {
    '1.2': 'resume-leading-body-12',
    '1.3': 'resume-leading-body-13',
    '1.4': 'resume-leading-body-14',
    '1.5': 'resume-leading-body-15',
    '1.6': 'resume-leading-body-16',
    '1.8': 'resume-leading-body-18',
  }

const RESUME_BODY_LETTER_SPACING_CLASS_NAMES: Record<
  ResumeBodyLetterSpacing,
  string
> = {
  '-0.025em': 'resume-tracking-body-tight',
  '0': 'resume-tracking-body-normal',
  '0.025em': 'resume-tracking-body-relaxed',
  '0.05em': 'resume-tracking-body-wide',
}

type ResumeHeadingSizeInput =
  | ResumeHeadingSize
  | ResumeBodySize
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | null
  | undefined

type ResumeBodySizeInput =
  | ResumeBodySize
  | ResumeHeadingSize
  | 'sm'
  | 'md'
  | 'lg'
  | null
  | undefined

type ResumeBodyLineHeightInput =
  | ResumeBodyLineHeight
  | number
  | string
  | null
  | undefined

type ResumeBodyLetterSpacingInput =
  | ResumeBodyLetterSpacing
  | number
  | string
  | null
  | undefined

const RESUME_BODY_LINE_HEIGHT_VALUE_SET = new Set(RESUME_BODY_LINE_HEIGHT_VALUES)
const RESUME_BODY_LETTER_SPACING_VALUE_SET = new Set(
  RESUME_BODY_LETTER_SPACING_VALUES
)

const normalizeResumeHeadingSize = (
  size: ResumeHeadingSizeInput
): ResumeHeadingSize => {
  if (size === 'xs' || size === 'xl') return size
  if (size === 'sm' || size === 'md' || size === 'lg') return size
  if (size === '14') return 'sm'
  if (size === '15') return 'md'
  if (size === '16') return 'lg'
  return DEFAULT_RESUME_THEME.typography?.headingSize ?? 'md'
}

const normalizeResumeBodySize = (size: ResumeBodySizeInput): ResumeBodySize => {
  if (
    size === '10' ||
    size === '11' ||
    size === '12' ||
    size === '13'
  ) {
    return size
  }
  if (size === '14' || size === '15' || size === '16') return size
  if (size === 'sm') return '14'
  if (size === 'md') return '15'
  if (size === 'lg') return '16'
  return DEFAULT_RESUME_THEME.typography?.bodySize ?? '15'
}

const normalizeResumeBodyLineHeight = (
  value: ResumeBodyLineHeightInput
): ResumeBodyLineHeight => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    const candidate = value.toFixed(1) as ResumeBodyLineHeight
    if (RESUME_BODY_LINE_HEIGHT_VALUE_SET.has(candidate)) {
      return candidate
    }
  }
  if (typeof value === 'string') {
    const trimmed = value.trim() as ResumeBodyLineHeight
    if (RESUME_BODY_LINE_HEIGHT_VALUE_SET.has(trimmed)) {
      return trimmed
    }
  }
  return DEFAULT_RESUME_THEME.typography?.bodyLineHeight ?? '1.6'
}

const normalizeResumeBodyLetterSpacing = (
  value: ResumeBodyLetterSpacingInput
): ResumeBodyLetterSpacing => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    const candidate = `${value}em` as ResumeBodyLetterSpacing
    if (RESUME_BODY_LETTER_SPACING_VALUE_SET.has(candidate)) {
      return candidate
    }
    if (value === 0) return '0'
  }
  if (typeof value === 'string') {
    const trimmed = value.trim() as ResumeBodyLetterSpacing
    if (RESUME_BODY_LETTER_SPACING_VALUE_SET.has(trimmed)) {
      return trimmed
    }
    if (trimmed === '0') return '0'
  }
  return DEFAULT_RESUME_THEME.typography?.bodyLetterSpacing ?? '0'
}

export const resolveResumeAccent = (
  theme?: ResumeThemeSettings | null
): ResumeAccent => {
  return theme?.accent ?? DEFAULT_RESUME_THEME.accent ?? 'indigo'
}

export const getResumeAccentClassName = (
  accent?: ResumeAccent | null
): string => {
  const resolvedAccent = accent ?? DEFAULT_RESUME_THEME.accent ?? 'indigo'
  return RESUME_ACCENT_CLASS_NAMES[resolvedAccent]
}

export const getResumeAccentSwatch = (accent: ResumeAccent): string => {
  return `var(--resume-accent-${accent})`
}

export const getResumeHeadingFontClassName = (
  font?: ResumeFont | null
): string => {
  const resolvedFont = font ?? DEFAULT_RESUME_THEME.typography?.heading ?? 'geologica'
  return RESUME_HEADING_FONT_CLASS_NAMES[resolvedFont]
}

export const getResumeBodyFontClassName = (
  font?: ResumeFont | null
): string => {
  const resolvedFont = font ?? DEFAULT_RESUME_THEME.typography?.body ?? 'noto-sans'
  return RESUME_BODY_FONT_CLASS_NAMES[resolvedFont]
}

export const getResumeHeadingSizeClassName = (
  size?: ResumeHeadingSizeInput
): string => {
  const resolvedSize = normalizeResumeHeadingSize(size ?? null)
  return RESUME_HEADING_SIZE_CLASS_NAMES[resolvedSize]
}

export const getResumeBodySizeClassName = (
  size?: ResumeBodySizeInput
): string => {
  const resolvedSize = normalizeResumeBodySize(size ?? null)
  return RESUME_BODY_SIZE_CLASS_NAMES[resolvedSize]
}

export const getResumeBodyLineHeightClassName = (
  value?: ResumeBodyLineHeightInput
): string => {
  const resolvedValue = normalizeResumeBodyLineHeight(value ?? null)
  return RESUME_BODY_LINE_HEIGHT_CLASS_NAMES[resolvedValue]
}

export const getResumeBodyLetterSpacingClassName = (
  value?: ResumeBodyLetterSpacingInput
): string => {
  const resolvedValue = normalizeResumeBodyLetterSpacing(value ?? null)
  return RESUME_BODY_LETTER_SPACING_CLASS_NAMES[resolvedValue]
}

export const getResumeTypographyClassNames = (
  theme?: ResumeThemeSettings | null
): string[] => {
  const typography = theme?.typography
  return [
    getResumeHeadingFontClassName(typography?.heading ?? null),
    getResumeBodyFontClassName(typography?.body ?? null),
    getResumeHeadingSizeClassName(typography?.headingSize ?? null),
    getResumeBodySizeClassName(typography?.bodySize ?? null),
    getResumeBodyLineHeightClassName(typography?.bodyLineHeight ?? null),
    getResumeBodyLetterSpacingClassName(typography?.bodyLetterSpacing ?? null),
  ]
}

const clampMargin = (value: unknown): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return DEFAULT_RESUME_MARGINS.top
  }
  return Math.max(MIN_MARGIN, Math.min(MAX_MARGIN, Math.round(value)))
}

export const normalizeResumeMargins = (
  margins?: unknown
): ResumeMargins => {
  if (
    margins == null ||
    typeof margins !== 'object' ||
    Array.isArray(margins)
  ) {
    return { ...DEFAULT_RESUME_MARGINS }
  }
  const m = margins as Record<string, unknown>
  return {
    top: clampMargin(m.top),
    right: clampMargin(m.right),
    bottom: clampMargin(m.bottom),
    left: clampMargin(m.left),
  }
}

export const getResumeMarginStyle = (
  margins?: ResumeMargins | null
): CSSProperties => {
  const m = margins ?? DEFAULT_RESUME_MARGINS
  return {
    '--preview-paper-padding-top': `${m.top}mm`,
    '--preview-paper-padding-right': `${m.right}mm`,
    '--preview-paper-padding-bottom': `${m.bottom}mm`,
    '--preview-paper-padding-left': `${m.left}mm`,
  } as CSSProperties
}
