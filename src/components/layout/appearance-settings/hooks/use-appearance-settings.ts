import { useCallback, useMemo } from 'react'
import { useResumeStore } from '@/stores/resume-store'
import {
  DEFAULT_RESUME_THEME,
  RESUME_ACCENT_OPTIONS,
  RESUME_BODY_SIZE_OPTIONS,
  RESUME_FONT_OPTIONS,
  RESUME_HEADING_SIZE_OPTIONS,
  resolveResumeAccent,
} from '@/lib/resume-theme'
import type {
  ResumeBodySize,
  ResumeFont,
  ResumeHeadingSize,
} from '@/types/resume'
import {
  accentHelpText,
  bodySizeLabelByValue,
  fontLabelByValue,
  headingSizeLabelByValue,
} from '../constants'
import {
  resolveBodySizeLabel,
  resolveFontLabel,
  resolveHeadingSizeLabel,
} from '../utils'

interface AppearanceSettingsState {
  accentHelpText: string
  accentOptions: typeof RESUME_ACCENT_OPTIONS
  bodyFont: ResumeFont
  bodySize: ResumeBodySize
  bodySizeOptions: typeof RESUME_BODY_SIZE_OPTIONS
  fontOptions: typeof RESUME_FONT_OPTIONS
  headingFont: ResumeFont
  headingSize: ResumeHeadingSize
  headingSizeOptions: typeof RESUME_HEADING_SIZE_OPTIONS
  resolvedAccent: ReturnType<typeof resolveResumeAccent>
  labels: {
    resolveFontLabel: (value: string | null) => string
    resolveHeadingSizeLabel: (value: string | null) => string
    resolveBodySizeLabel: (value: string | null) => string
    fontLabelByValue: typeof fontLabelByValue
    headingSizeLabelByValue: typeof headingSizeLabelByValue
    bodySizeLabelByValue: typeof bodySizeLabelByValue
  }
  actions: {
    setResumeAccent: (accent: (typeof RESUME_ACCENT_OPTIONS)[number]['value']) => void
    setHeadingFont: (value: ResumeFont | null) => void
    setBodyFont: (value: ResumeFont | null) => void
    setHeadingSize: (value: ResumeHeadingSize | null) => void
    setBodySize: (value: ResumeBodySize | null) => void
  }
}

export const useAppearanceSettings = (): AppearanceSettingsState => {
  const accent = useResumeStore((state) => state.resumeDisplay.theme?.accent)
  const resumeTheme = useResumeStore((state) => state.resumeDisplay.theme)
  const setResumeTheme = useResumeStore((state) => state.setResumeTheme)
  const setResumeAccent = useResumeStore((state) => state.setResumeAccent)

  const resolvedAccent = resolveResumeAccent({ accent })
  const typography = useMemo(
    () => resumeTheme.typography ?? {},
    [resumeTheme.typography]
  )

  const headingFont =
    typography.heading ?? DEFAULT_RESUME_THEME.typography?.heading ?? 'geologica'
  const bodyFont =
    typography.body ?? DEFAULT_RESUME_THEME.typography?.body ?? 'noto-sans'
  const headingSize =
    typography.headingSize ?? DEFAULT_RESUME_THEME.typography?.headingSize ?? 'md'
  const bodySize =
    typography.bodySize ?? DEFAULT_RESUME_THEME.typography?.bodySize ?? '15'

  const setHeadingFont = useCallback(
    (value: ResumeFont | null) => {
      if (!value) return
      setResumeTheme({
        ...resumeTheme,
        typography: {
          ...typography,
          heading: value,
        },
      })
    },
    [resumeTheme, setResumeTheme, typography]
  )

  const setBodyFont = useCallback(
    (value: ResumeFont | null) => {
      if (!value) return
      setResumeTheme({
        ...resumeTheme,
        typography: {
          ...typography,
          body: value,
        },
      })
    },
    [resumeTheme, setResumeTheme, typography]
  )

  const setHeadingSize = useCallback(
    (value: ResumeHeadingSize | null) => {
      if (!value) return
      setResumeTheme({
        ...resumeTheme,
        typography: {
          ...typography,
          headingSize: value,
        },
      })
    },
    [resumeTheme, setResumeTheme, typography]
  )

  const setBodySize = useCallback(
    (value: ResumeBodySize | null) => {
      if (!value) return
      setResumeTheme({
        ...resumeTheme,
        typography: {
          ...typography,
          bodySize: value,
        },
      })
    },
    [resumeTheme, setResumeTheme, typography]
  )

  const actions = useMemo(
    () => ({
      setResumeAccent,
      setHeadingFont,
      setBodyFont,
      setHeadingSize,
      setBodySize,
    }),
    [setBodyFont, setBodySize, setHeadingFont, setHeadingSize, setResumeAccent]
  )

  return {
    accentHelpText,
    accentOptions: RESUME_ACCENT_OPTIONS,
    bodyFont,
    bodySize,
    bodySizeOptions: RESUME_BODY_SIZE_OPTIONS,
    fontOptions: RESUME_FONT_OPTIONS,
    headingFont,
    headingSize,
    headingSizeOptions: RESUME_HEADING_SIZE_OPTIONS,
    resolvedAccent,
    labels: {
      resolveFontLabel,
      resolveHeadingSizeLabel,
      resolveBodySizeLabel,
      fontLabelByValue,
      headingSizeLabelByValue,
      bodySizeLabelByValue,
    },
    actions,
  }
}
