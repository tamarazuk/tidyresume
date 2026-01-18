'use client'

import Link from 'next/link'
import { MdPreview } from 'md-editor-rt'
import { DotsNineIcon, PrinterIcon } from '@phosphor-icons/react/dist/ssr'
import AppIcon from '@/icons/app-icon'
import AppearanceSettings from '@/components/appearance-settings'
import { SlugSettings } from '@/components/layout/slug-settings'
import { UnpublishButton } from '@/components/public-view/unpublish-button'
import { EditableResumeTitle } from '@/components/public-view/editable-resume-title'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import ThemeToggle from '@/components/ui/theme-toggle'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  dropdownMenuItemClassName,
} from '@/components/ui/dropdown-menu'
import { useOwnerCheck } from '@/hooks/use-owner-check'
import usePlatformShortcuts from '@/hooks/use-platform-shortcuts'
import { useResumeTheme } from '@/hooks/use-resume-theme'
import {
  getResumeAccentClassName,
  getResumeTypographyClassNames,
} from '@/lib/resume-theme'
import type { ResumeThemeSettings } from '@/types/resume'
import { cn } from '@/lib/utils'
import { useResumeStore } from '@/stores/resume-store'

import 'md-editor-rt/lib/preview.css'
import '@/components/editor/styles/preview.css'

interface ResumeViewerProps {
  id: string
  title: string
  content: string
  isFullWidth: boolean
  theme?: ResumeThemeSettings | null
}

export function ResumeViewer({
  id,
  title,
  content,
  isFullWidth,
  theme,
}: ResumeViewerProps) {
  const { formatShortcutKeys } = usePlatformShortcuts()
  const { resumeTheme, className: resumeThemeClassName } = useResumeTheme()
  const isOwner = useOwnerCheck(id)
  const resumeDisplayTheme = useResumeStore((state) => state.resumeDisplay.theme)
  const shortcutKeys = formatShortcutKeys(['Mod', 'P'])
  const resolvedTheme = isOwner ? resumeDisplayTheme : theme
  const resumeAccentClassName = getResumeAccentClassName(resolvedTheme?.accent)
  const resumeTypographyClassNames = getResumeTypographyClassNames(resolvedTheme)
  const menuItemClassName = cn(dropdownMenuItemClassName, 'w-full justify-start')

  return (
    <div className="resume-view flex min-h-screen flex-col font-sans">
      <header className="border-border bg-background no-print grid flex-none grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 border-b border-solid px-6 py-3 sm:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          className="text-foreground order-1 flex items-center gap-3 sm:order-1"
          aria-label="TidyResume home"
        >
          <div className="flex size-9 items-center justify-center">
            <AppIcon className="h-full w-full" />
          </div>
          <span className="font-heading text-base font-semibold tracking-[-0.01em]">
            TidyResume
          </span>
        </Link>
        <div className="order-2 flex items-center justify-end gap-2 sm:order-3 sm:justify-self-end">
          <DropdownMenu>
          <DropdownMenuTrigger
            render={(props) => (
              <Button
                {...props}
                variant="ghost"
                size="icon"
                aria-label="Open actions menu"
              >
                <DotsNineIcon size={18} weight="bold" />
              </Button>
            )}
          />
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuItem onClick={() => window.print()}>
                <PrinterIcon size={16} />
                <span>Print</span>
                <div className="ml-auto flex items-center gap-1">
                  {shortcutKeys.map((key) => (
                    <Kbd key={`print-${key}`}>{key}</Kbd>
                  ))}
                </div>
              </DropdownMenuItem>
              {isOwner ? (
                <AppearanceSettings
                  label="Appearance"
                  labelClassName="inline"
                  triggerVariant="ghost"
                  triggerSize="sm"
                  triggerClassName={cn(
                    menuItemClassName,
                    'focus:bg-transparent focus:text-foreground data-[highlighted]:bg-transparent data-[highlighted]:text-foreground'
                  )}
                />
              ) : null}
              {isOwner ? (
                <SlugSettings
                  label="Edit link"
                  labelClassName="inline"
                  variant="ghost"
                  size="sm"
                  className={menuItemClassName}
                />
              ) : null}
              {isOwner ? (
                <UnpublishButton
                  id={id}
                  showTooltip={false}
                  showLabel
                  labelClassName="inline"
                  buttonProps={{
                    variant: 'ghost',
                    size: 'sm',
                    className: menuItemClassName,
                  }}
                />
              ) : null}
              <DropdownMenuSeparator />
              <ThemeToggle
                lightLabel="Switch to dark mode"
                darkLabel="Switch to light mode"
                labelClassName="inline"
                buttonProps={{
                  variant: 'ghost',
                  size: 'sm',
                  className: menuItemClassName,
                }}
              />
            </DropdownMenuContent>
          </DropdownMenu>
          <Tooltip>
            <TooltipTrigger
              render={(props) => (
                <Button
                  {...props}
                  onClick={(event) => {
                    props.onClick?.(event)
                    if (event.defaultPrevented) return
                    window.print()
                  }}
                  aria-label="Print resume"
                >
                  <PrinterIcon size={16} />
                </Button>
              )}
            />
            <TooltipContent>
              Print <Kbd>{shortcutKeys.join('+')}</Kbd>
            </TooltipContent>
          </Tooltip>
        </div>
        <EditableResumeTitle
          id={id}
          title={title}
          content={content}
          className="order-3 col-span-2 sm:order-2 sm:col-span-1 sm:justify-self-center"
        />
      </header>

      <main className="flex-1">
        <MdPreview
          editorId="resume-preview"
          modelValue={content}
          theme={resumeTheme}
          className={cn(
            'resume-preview-theme resume-view font-sans',
            resumeThemeClassName,
            resumeAccentClassName,
            resumeTypographyClassNames,
            isFullWidth && 'resume-view-full'
          )}
        />
      </main>
    </div>
  )
}
