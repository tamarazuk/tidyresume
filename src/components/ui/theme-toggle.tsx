'use client'

import type { ComponentProps } from 'react'
import { useTheme } from 'next-themes'
import { MoonIcon, SunIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { useMounted } from '@/hooks/use-mounted'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  buttonProps?: ComponentProps<typeof Button>
}

export default function ThemeToggle({ buttonProps }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()
  const isDark = resolvedTheme === 'dark'
  const {
    className: buttonClassName,
    onClick,
    variant,
    size,
    ...restButtonProps
  } = buttonProps ?? {}

  if (!mounted) {
    return (
      <Button
        {...restButtonProps}
        aria-label="Theme toggle loading"
        size={size ?? 'icon'}
        variant={variant ?? 'ghost'}
        disabled
        className={cn(buttonClassName)}
      >
        <MoonIcon className="size-5" />
      </Button>
    )
  }

  return (
    <Button
      {...restButtonProps}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      variant={variant ?? 'ghost'}
      size={size ?? 'icon'}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        setTheme(isDark ? 'light' : 'dark')
      }}
      className={cn(buttonClassName)}
    >
      {isDark ? (
        <SunIcon className="size-5" />
      ) : (
        <MoonIcon className="size-5" />
      )}
    </Button>
  )
}
