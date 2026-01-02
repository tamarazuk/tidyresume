import { useTheme as useThemeNext } from 'next-themes'
import { Theme } from '@/types'

export const useTheme = () => {
  const { resolvedTheme } = useThemeNext()
  if (resolvedTheme === 'dark' || resolvedTheme === 'light') {
    return resolvedTheme as Theme
  }

  if (typeof document !== 'undefined') {
    return document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light'
  }

  return 'light'
}
