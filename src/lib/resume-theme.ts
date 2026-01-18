import type {
  ResumeAccent,
  ResumeBodySize,
  ResumeFont,
  ResumeHeadingSize,
  ResumeThemeSettings,
} from '@/lib/resume-types'

export const DEFAULT_RESUME_THEME: ResumeThemeSettings = {
  accent: 'indigo',
  typography: {
    heading: 'geologica',
    body: 'noto-sans',
    headingSize: 'md',
    bodySize: '15',
  },
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
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
]

export const RESUME_BODY_SIZE_OPTIONS: Array<{
  value: ResumeBodySize
  label: string
}> = [
  { value: '14', label: '14 px' },
  { value: '15', label: '15 px' },
  { value: '16', label: '16 px' },
]

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
  sm: 'resume-size-heading-sm',
  md: 'resume-size-heading-md',
  lg: 'resume-size-heading-lg',
}

const RESUME_BODY_SIZE_CLASS_NAMES: Record<ResumeBodySize, string> = {
  14: 'resume-size-body-14',
  15: 'resume-size-body-15',
  16: 'resume-size-body-16',
}

type ResumeHeadingSizeInput =
  | ResumeHeadingSize
  | ResumeBodySize
  | 'sm'
  | 'md'
  | 'lg'
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

const normalizeResumeHeadingSize = (
  size: ResumeHeadingSizeInput
): ResumeHeadingSize => {
  if (size === 'sm' || size === 'md' || size === 'lg') return size
  if (size === '14') return 'sm'
  if (size === '15') return 'md'
  if (size === '16') return 'lg'
  return DEFAULT_RESUME_THEME.typography?.headingSize ?? 'md'
}

const normalizeResumeBodySize = (size: ResumeBodySizeInput): ResumeBodySize => {
  if (size === '14' || size === '15' || size === '16') return size
  if (size === 'sm') return '14'
  if (size === 'md') return '15'
  if (size === 'lg') return '16'
  return DEFAULT_RESUME_THEME.typography?.bodySize ?? '15'
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

export const getResumeTypographyClassNames = (
  theme?: ResumeThemeSettings | null
): string[] => {
  const typography = theme?.typography
  return [
    getResumeHeadingFontClassName(typography?.heading ?? null),
    getResumeBodyFontClassName(typography?.body ?? null),
    getResumeHeadingSizeClassName(typography?.headingSize ?? null),
    getResumeBodySizeClassName(typography?.bodySize ?? null),
  ]
}
