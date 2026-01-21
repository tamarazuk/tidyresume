import { useCallback, useMemo, useState, type KeyboardEvent } from 'react'
import { useResumeStore } from '@/stores/resume-store'
import {
  DEFAULT_RESUME_THEME,
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
  margins: NonNullable<NonNullable<typeof DEFAULT_RESUME_THEME.page>['margins']>
  verticalLock: boolean
  horizontalLock: boolean
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
    setMargins: (margins: Partial<NonNullable<NonNullable<typeof DEFAULT_RESUME_THEME.page>['margins']>>) => void
    toggleVerticalLock: () => void
    toggleHorizontalLock: () => void
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
  const [verticalLock, setVerticalLock] = useState(false)
  const [horizontalLock, setHorizontalLock] = useState(false)

  const resolvedAccent = resolveResumeAccent({ accent })
  const accentOptions = RESUME_ACCENT_OPTIONS
  const typography = useMemo(
    () => resumeTheme.typography ?? {},
    [resumeTheme.typography]
  )
  const margins = useMemo(
    () => resumeTheme.page?.margins ?? DEFAULT_RESUME_THEME.page?.margins ?? { top: 15, right: 15, bottom: 15, left: 15 },
    [resumeTheme.page?.margins]
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

  const setMargins = useCallback(
    (newMargins: Partial<typeof margins>) => {
      const updatedMargins = { ...newMargins }

      if (verticalLock) {
        if (typeof newMargins.top === 'number') {
          updatedMargins.bottom = newMargins.top
        } else if (typeof newMargins.bottom === 'number') {
          updatedMargins.top = newMargins.bottom
        }
      }

      if (horizontalLock) {
        if (typeof newMargins.left === 'number') {
          updatedMargins.right = newMargins.left
        } else if (typeof newMargins.right === 'number') {
          updatedMargins.left = newMargins.right
        }
      }

      setResumeTheme({
        ...resumeTheme,
        page: {
          ...resumeTheme.page,
          margins: {
            ...margins,
            ...updatedMargins,
          },
        },
      })
    },
    [margins, resumeTheme, setResumeTheme, verticalLock, horizontalLock]
  )

  const toggleVerticalLock = useCallback(() => {
    setVerticalLock((prev) => {
      const next = !prev
      if (next) {
        // Sync bottom to top
        setMargins({ bottom: margins.top })
      }
      return next
    })
  }, [margins.top, setMargins])

  const toggleHorizontalLock = useCallback(() => {
    setHorizontalLock((prev) => {
      const next = !prev
      if (next) {
        // Sync right to left
        setMargins({ right: margins.left })
      }
      return next
    })
  }, [margins.left, setMargins])

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
      setBodyLineHeight,
      setBodyLetterSpacing,
      setMargins,
      toggleVerticalLock,
      toggleHorizontalLock,
      handleAccentKeyDown,
    }),
    [
      handleAccentKeyDown,
      setBodyFont,
      setBodyLineHeight,
      setBodyLetterSpacing,
      setBodySize,
      setHeadingFont,
      setHeadingSize,
      setMargins,
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
    verticalLock,
    horizontalLock,
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
