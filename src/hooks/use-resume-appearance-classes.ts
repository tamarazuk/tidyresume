import { useMemo } from 'react'
import { useResumeStore } from '@/stores/resume-store'
import {
  getResumeAccentClassName,
  getResumeTypographyClassNames,
} from '@/lib/resume-theme'

interface ResumeAppearanceClasses {
  accentClassName: string
  typographyClassNames: string[]
}

export const useResumeAppearanceClasses = (): ResumeAppearanceClasses => {
  const resumeTheme = useResumeStore((state) => state.resumeDisplay.theme)

  const accentClassName = useMemo(
    () => getResumeAccentClassName(resumeTheme?.accent),
    [resumeTheme?.accent]
  )

  const typographyClassNames = useMemo(
    () => getResumeTypographyClassNames(resumeTheme),
    [resumeTheme]
  )

  return { accentClassName, typographyClassNames }
}
