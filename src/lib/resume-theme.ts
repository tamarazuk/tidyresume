import type { ResumeAccent, ResumeThemeSettings } from '@/lib/resume-types'

export const DEFAULT_RESUME_THEME: ResumeThemeSettings = {
  accent: 'indigo',
  typography: {
    heading: 'geologica',
    body: 'noto-sans',
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

export const RESUME_ACCENT_CLASS_NAMES: Record<ResumeAccent, string> = {
  indigo: 'resume-accent-indigo',
  blue: 'resume-accent-blue',
  teal: 'resume-accent-teal',
  slate: 'resume-accent-slate',
  emerald: 'resume-accent-emerald',
  rose: 'resume-accent-rose',
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
