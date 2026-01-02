'use client'

import { useTheme } from 'next-themes'
import { MoonIcon, SunIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { useMounted } from '@/hooks/use-mounted'

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()
  const isDark = resolvedTheme === 'dark'

  if (!mounted) {
    return (
      <Button aria-label="Theme toggle loading" size="icon" disabled>
        <MoonIcon className="size-5" />
      </Button>
    )
  }

  return (
    <Button
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? (
        <SunIcon className="size-5" />
      ) : (
        <MoonIcon className="size-5" />
      )}
    </Button>
  )
}
