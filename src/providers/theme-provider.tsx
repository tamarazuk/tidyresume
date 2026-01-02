'use client'

import { useEffect } from 'react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes/dist/types'

function ThemeDataAttributeSync() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const mode = resolvedTheme === 'dark' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-color-mode', mode)
  }, [resolvedTheme])

  return null
}

export default function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ThemeDataAttributeSync />
      {children}
    </NextThemesProvider>
  )
}
