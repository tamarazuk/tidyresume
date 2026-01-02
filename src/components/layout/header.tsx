'use client'

import { useCallback } from 'react'
import Link from 'next/link'
import { PrinterIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import ThemeToggle from '@/components/ui/theme-toggle'
import usePlatformShortcuts from '@/hooks/use-platform-shortcuts'
import ResumeTitleInput from '@/components/layout/resume-title-input'
import AppIcon from '@/icons/app-icon'

interface HeaderProps {
  title?: string
  printLabel?: string
  onPrintClick?: () => void
}

export default function Header({
  title = 'TidyResume Editor',
  printLabel = 'Print',
  onPrintClick,
}: HeaderProps) {
  const { formatShortcutKeys } = usePlatformShortcuts()
  const shortcutLabel = formatShortcutKeys(['Mod', 'P']).join('+')
  const handlePrint = useCallback(() => {
    if (onPrintClick) {
      onPrintClick()
      return
    }

    window.print()
  }, [onPrintClick])

  return (
    <header className="border-border bg-background no-print z-20 flex flex-none items-center justify-between border-b border-solid px-6 py-3 whitespace-nowrap">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex size-10 items-center justify-center"
          aria-label="TidyResume home"
        >
          <AppIcon className="h-full w-full" />
        </Link>
        <div>
          <h2 className="text-foreground text-lg leading-tight font-bold tracking-[-0.015em]">
            {title}
          </h2>
          <ResumeTitleInput />
        </div>
      </div>
      <div className="flex gap-3">
        <ThemeToggle />
        <Tooltip>
          <TooltipTrigger
            render={(props) => {
              const { onClick, ...rest } = props
              return (
                <Button
                  {...rest}
                  onClick={(event) => {
                    event?.preventDefault()
                    event?.stopPropagation()
                    onClick?.(event)
                    handlePrint()
                  }}
                  className="min-w-21 gap-2"
                  aria-label={`${printLabel} (${shortcutLabel})`}
                >
                  <PrinterIcon size={16} aria-hidden />
                  {printLabel}
                </Button>
              )
            }}
          />
          <TooltipContent>{`${printLabel} (${shortcutLabel})`}</TooltipContent>
        </Tooltip>
      </div>
    </header>
  )
}
