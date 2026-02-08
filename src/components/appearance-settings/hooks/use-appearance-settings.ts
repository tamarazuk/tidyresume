import { useCallback, useMemo, useState, type KeyboardEvent } from 'react'
import { useResumeStore } from '@/stores/resume-store'
import {
  DEFAULT_RESUME_MARGINS,
  DEFAULT_RESUME_THEME,
  MIN_MARGIN,
  MAX_MARGIN,
  RESUME_ACCENT_OPTIONS,
  RESUME_BODY_LINE_HEIGHT_OPTIONS,
  RESUME_BODY_LETTER_SPACING_OPTIONS,
  RESUME_BODY_SIZE_OPTIONS,
  RESUME_FONT_OPTIONS,
  RESUME_HEADING_SIZE_OPTIONS,
  resolveResumeAccent,
} from '@/lib/resume-theme'
import type {
  ResumeBodyLineHeight,
  ResumeBodyLetterSpacing,
  ResumeBodySize,
  ResumeFont,
  ResumeHeadingSize,
  ResumeMargins,
} from '@/types/resume'
import { accentHelpText } from '../constants'
import {
  bodyLineHeightLabelByValue,
  bodyLetterSpacingLabelByValue,
  resolveBodySizeLabel,
  resolveBodyLineHeightLabel,
  resolveBodyLetterSpacingLabel,
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
  bodyLineHeight: ResumeBodyLineHeight
  bodyLineHeightOptions: typeof RESUME_BODY_LINE_HEIGHT_OPTIONS
  bodyLetterSpacing: ResumeBodyLetterSpacing
  bodyLetterSpacingOptions: typeof RESUME_BODY_LETTER_SPACING_OPTIONS
  bodySize: ResumeBodySize
  bodySizeOptions: typeof RESUME_BODY_SIZE_OPTIONS
  fontOptions: typeof RESUME_FONT_OPTIONS
  headingFont: ResumeFont
  headingSize: ResumeHeadingSize
  headingSizeOptions: typeof RESUME_HEADING_SIZE_OPTIONS
  resolvedAccent: ReturnType<typeof resolveResumeAccent>
  margins: ResumeMargins
  verticalLocked: boolean
  horizontalLocked: boolean
  marginMin: number
  marginMax: number
  labels: {
    resolveFontLabel: (value: string | null) => string
    resolveHeadingSizeLabel: (value: string | null) => string
    resolveBodySizeLabel: (value: string | null) => string
    resolveBodyLineHeightLabel: (value: string | null) => string
    resolveBodyLetterSpacingLabel: (value: string | null) => string
    fontLabelByValue: typeof fontLabelByValue
    headingSizeLabelByValue: typeof headingSizeLabelByValue
    bodySizeLabelByValue: typeof bodySizeLabelByValue
    bodyLineHeightLabelByValue: typeof bodyLineHeightLabelByValue
    bodyLetterSpacingLabelByValue: typeof bodyLetterSpacingLabelByValue
  }
  actions: {
    setResumeAccent: (accent: (typeof RESUME_ACCENT_OPTIONS)[number]['value']) => void
    setHeadingFont: (value: ResumeFont | null) => void
    setBodyFont: (value: ResumeFont | null) => void
    setHeadingSize: (value: ResumeHeadingSize | null) => void
    setBodySize: (value: ResumeBodySize | null) => void
    setBodyLineHeight: (value: ResumeBodyLineHeight | null) => void
    setBodyLetterSpacing: (value: ResumeBodyLetterSpacing | null) => void
    handleAccentKeyDown: (
      event: KeyboardEvent<HTMLButtonElement>,
      index: number
    ) => void
    setMargin: (side: keyof ResumeMargins, value: number) => void
    toggleVerticalLock: () => void
    toggleHorizontalLock: () => void
  }
}

export const useAppearanceSettings = (): AppearanceSettingsState => {
  const accent = useResumeStore(
    (state) => state.getActiveDraft().resumeDisplay.theme?.accent
  )
  const resumeTheme = useResumeStore(
    (state) => state.getActiveDraft().resumeDisplay.theme
  )
  const setResumeTheme = useResumeStore((state) => state.setResumeTheme)
  const setResumeAccent = useResumeStore((state) => state.setResumeAccent)

  const resolvedAccent = resolveResumeAccent({ accent })
  const accentOptions = RESUME_ACCENT_OPTIONS
  const typography = useMemo(
    () => resumeTheme.typography ?? {},
    [resumeTheme.typography]
  )

  const margins = useMemo(
    () => resumeTheme.margins ?? DEFAULT_RESUME_MARGINS,
    [resumeTheme.margins]
  )

  const [verticalLocked, setVerticalLocked] = useState(
    () => margins.top === margins.bottom
  )
  const [horizontalLocked, setHorizontalLocked] = useState(
    () => margins.left === margins.right
  )

  const headingFont =
    typography.heading ?? DEFAULT_RESUME_THEME.typography?.heading ?? 'geologica'
  const bodyFont =
    typography.body ?? DEFAULT_RESUME_THEME.typography?.body ?? 'noto-sans'
  const headingSize =
    typography.headingSize ?? DEFAULT_RESUME_THEME.typography?.headingSize ?? 'md'
  const bodySize =
    typography.bodySize ?? DEFAULT_RESUME_THEME.typography?.bodySize ?? '15'
  const bodyLineHeight =
    typography.bodyLineHeight ??
    DEFAULT_RESUME_THEME.typography?.bodyLineHeight ??
    '1.6'
  const bodyLetterSpacing =
    typography.bodyLetterSpacing ??
    DEFAULT_RESUME_THEME.typography?.bodyLetterSpacing ??
    '0'

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

  const setBodyLineHeight = useCallback(
    (value: ResumeBodyLineHeight | null) => {
      if (!value) return
      setResumeTheme({
        ...resumeTheme,
        typography: {
          ...typography,
          bodyLineHeight: value,
        },
      })
    },
    [resumeTheme, setResumeTheme, typography]
  )

  const setBodyLetterSpacing = useCallback(
    (value: ResumeBodyLetterSpacing | null) => {
      if (!value) return
      setResumeTheme({
        ...resumeTheme,
        typography: {
          ...typography,
          bodyLetterSpacing: value,
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

  const setMargin = useCallback(
    (side: keyof ResumeMargins, value: number) => {
      const clamped = Math.max(MIN_MARGIN, Math.min(MAX_MARGIN, Math.round(value)))
      const updated = { ...margins }
      updated[side] = clamped

      if (verticalLocked) {
        if (side === 'top') updated.bottom = clamped
        if (side === 'bottom') updated.top = clamped
      }
      if (horizontalLocked) {
        if (side === 'left') updated.right = clamped
        if (side === 'right') updated.left = clamped
      }

      setResumeTheme({ ...resumeTheme, margins: updated })
    },
    [margins, resumeTheme, setResumeTheme, verticalLocked, horizontalLocked]
  )

  const toggleVerticalLock = useCallback(() => {
    setVerticalLocked((prev) => !prev)
  }, [])

  const toggleHorizontalLock = useCallback(() => {
    setHorizontalLocked((prev) => !prev)
  }, [])

  const actions = useMemo(
    () => ({
      setResumeAccent,
      setHeadingFont,
      setBodyFont,
      setHeadingSize,
      setBodySize,
      setBodyLineHeight,
      setBodyLetterSpacing,
      handleAccentKeyDown,
      setMargin,
      toggleVerticalLock,
      toggleHorizontalLock,
    }),
    [
      handleAccentKeyDown,
      setBodyFont,
      setBodyLineHeight,
      setBodyLetterSpacing,
      setBodySize,
      setHeadingFont,
      setHeadingSize,
      setMargin,
      setResumeAccent,
      toggleHorizontalLock,
      toggleVerticalLock,
    ]
  )

  return {
    accentHelpText,
    accentOptions,
    bodyFont,
    bodyLineHeight,
    bodyLineHeightOptions: RESUME_BODY_LINE_HEIGHT_OPTIONS,
    bodyLetterSpacing,
    bodyLetterSpacingOptions: RESUME_BODY_LETTER_SPACING_OPTIONS,
    bodySize,
    bodySizeOptions: RESUME_BODY_SIZE_OPTIONS,
    fontOptions: RESUME_FONT_OPTIONS,
    headingFont,
    headingSize,
    headingSizeOptions: RESUME_HEADING_SIZE_OPTIONS,
    resolvedAccent,
    margins,
    verticalLocked,
    horizontalLocked,
    marginMin: MIN_MARGIN,
    marginMax: MAX_MARGIN,
    labels: {
      resolveFontLabel,
      resolveHeadingSizeLabel,
      resolveBodySizeLabel,
      resolveBodyLineHeightLabel,
      resolveBodyLetterSpacingLabel,
      fontLabelByValue,
      headingSizeLabelByValue,
      bodySizeLabelByValue,
      bodyLineHeightLabelByValue,
      bodyLetterSpacingLabelByValue,
    },
    actions,
  }
}
