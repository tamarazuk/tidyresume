import { useCallback, useMemo, type KeyboardEvent } from 'react'
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
import { accentHelpText } from '../constants'
import {
  resolveBodySizeLabel,
  resolveFontLabel,
  resolveHeadingSizeLabel,
  bodySizeLabelByValue,
  fontLabelByValue,
  headingSizeLabelByValue,
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
    handleAccentKeyDown: (
      event: KeyboardEvent<HTMLButtonElement>,
      index: number
    ) => void
  }
}

export const useAppearanceSettings = (): AppearanceSettingsState => {
  const accent = useResumeStore((state) => state.resumeDisplay.theme?.accent)
  const resumeTheme = useResumeStore((state) => state.resumeDisplay.theme)
  const setResumeTheme = useResumeStore((state) => state.setResumeTheme)
  const setResumeAccent = useResumeStore((state) => state.setResumeAccent)

  const resolvedAccent = resolveResumeAccent({ accent })
  const accentOptions = RESUME_ACCENT_OPTIONS
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

  const handleAccentKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault()
        const nextIndex = (index + 1) % accentOptions.length
        setResumeAccent(accentOptions[nextIndex].value)
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault()
        const prevIndex =
          (index - 1 + accentOptions.length) % accentOptions.length
        setResumeAccent(accentOptions[prevIndex].value)
      }
      if (event.key === 'Home') {
        event.preventDefault()
        setResumeAccent(accentOptions[0].value)
      }
      if (event.key === 'End') {
        event.preventDefault()
        setResumeAccent(accentOptions[accentOptions.length - 1].value)
      }
    },
    [accentOptions, setResumeAccent]
  )

  const actions = useMemo(
    () => ({
      setResumeAccent,
      setHeadingFont,
      setBodyFont,
      setHeadingSize,
      setBodySize,
      handleAccentKeyDown,
    }),
    [
      handleAccentKeyDown,
      setBodyFont,
      setBodySize,
      setHeadingFont,
      setHeadingSize,
      setResumeAccent,
    ]
  )

  return {
    accentHelpText,
    accentOptions,
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
