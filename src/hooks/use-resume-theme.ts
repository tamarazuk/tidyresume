import { useMemo } from 'react'
import { useTheme } from '@/hooks/use-theme'
import type { Theme } from '@/types'
import { useResumeStore } from '@/stores/resume-store'

type ResolvedResumeTheme = Theme
type ResumeThemeClassName = 'resume-theme-light' | 'resume-theme-dark'

interface UseResumeThemeResult {
  resumeTheme: ResolvedResumeTheme
  className: ResumeThemeClassName
  isDark: boolean
}

export const useResumeTheme = (): UseResumeThemeResult => {
  const uiTheme = useTheme()
  const themeMode = useResumeStore((state) => state.resumeDisplay.themeMode)

  const resumeTheme = useMemo<ResolvedResumeTheme>(() => {
    if (themeMode === 'light' || themeMode === 'dark') {
      return themeMode
    }
    return uiTheme
  }, [themeMode, uiTheme])

  const className = useMemo<ResumeThemeClassName>(() => {
    return resumeTheme === 'dark' ? 'resume-theme-dark' : 'resume-theme-light'
  }, [resumeTheme])

  return {
    resumeTheme,
    className,
    isDark: resumeTheme === 'dark',
  }
}
