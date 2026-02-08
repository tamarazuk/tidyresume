import type { CSSProperties } from 'react'
import { useMemo } from 'react'
import { useResumeStore } from '@/stores/resume-store'
import {
  getResumeAccentClassName,
  getResumeMarginStyle,
  getResumeTypographyClassNames,
} from '@/lib/resume-theme'

interface ResumeAppearanceClasses {
  accentClassName: string
  typographyClassNames: string[]
  marginStyle: CSSProperties
}

export const useResumeAppearanceClasses = (): ResumeAppearanceClasses => {
  const resumeTheme = useResumeStore(
    (state) => state.getActiveDraft().resumeDisplay.theme
  )

  const accentClassName = useMemo(
    () => getResumeAccentClassName(resumeTheme?.accent),
    [resumeTheme?.accent]
  )

  const typographyClassNames = useMemo(
    () => getResumeTypographyClassNames(resumeTheme),
    [resumeTheme]
  )

  const marginStyle = useMemo(
    () => getResumeMarginStyle(resumeTheme?.margins),
    [resumeTheme?.margins]
  )

  return { accentClassName, typographyClassNames, marginStyle }
}
