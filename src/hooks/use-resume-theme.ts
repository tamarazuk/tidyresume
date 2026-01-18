import { useMemo } from 'react'
import { useTheme } from '@/hooks/use-theme'
import { useMounted } from '@/hooks/use-mounted'
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
  const mounted = useMounted()
  const uiTheme = useTheme()
  const themeMode = useResumeStore((state) => state.resumeDisplay.themeMode)
  const resolvedThemeMode = mounted ? themeMode : 'auto'
  const resolvedUiTheme = mounted ? uiTheme : 'light'

  const resumeTheme = useMemo<ResolvedResumeTheme>(() => {
    if (resolvedThemeMode === 'light' || resolvedThemeMode === 'dark') {
      return resolvedThemeMode
    }
    return resolvedUiTheme
  }, [resolvedThemeMode, resolvedUiTheme])

  const className = useMemo<ResumeThemeClassName>(() => {
    return resumeTheme === 'dark' ? 'resume-theme-dark' : 'resume-theme-light'
  }, [resumeTheme])

  return {
    resumeTheme,
    className,
    isDark: resumeTheme === 'dark',
  }
}
