'use client'

import Link from 'next/link'
import { MdPreview } from 'md-editor-rt'
import { PrinterIcon } from '@phosphor-icons/react/dist/ssr'
import AppIcon from '@/icons/app-icon'
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
import usePlatformShortcuts from '@/hooks/use-platform-shortcuts'
import { useResumeTheme } from '@/hooks/use-resume-theme'
import { cn } from '@/lib/utils'

import 'md-editor-rt/lib/preview.css'
import '@/components/editor/styles/preview.css'

interface ResumeViewerProps {
  id: string
  title: string
  content: string
  isFullWidth: boolean
}

export function ResumeViewer({
  id,
  title,
  content,
  isFullWidth,
}: ResumeViewerProps) {
  const { formatShortcutKeys } = usePlatformShortcuts()
  const { resumeTheme, className: resumeThemeClassName } = useResumeTheme()
  const shortcutLabel = formatShortcutKeys(['Mod', 'P']).join('+')

  return (
    <div className="resume-view flex min-h-screen flex-col">
      <header className="border-border bg-background no-print grid flex-none grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 border-b border-solid px-6 py-3 sm:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          className="text-foreground order-1 flex items-center gap-3 sm:order-1"
          aria-label="TidyResume home"
        >
          <div className="flex size-9 items-center justify-center">
            <AppIcon className="h-full w-full" />
          </div>
          <span className="text-base font-semibold tracking-[-0.01em]">
            TidyResume
          </span>
        </Link>
        <div className="order-2 flex items-center justify-end gap-2 sm:order-3 sm:justify-self-end">
          <Tooltip>
            <TooltipTrigger
              render={(props) => (
                <ThemeToggle
                  buttonProps={{
                    ...props,
                    className: cn('text-muted-foreground', props.className),
                  }}
                />
              )}
            />
            <TooltipContent>Toggle theme</TooltipContent>
          </Tooltip>
          <UnpublishButton id={id} />
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
              Print <Kbd>{shortcutLabel}</Kbd>
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
            'resume-preview-theme resume-view',
            resumeThemeClassName,
            isFullWidth && 'resume-view-full'
          )}
        />
      </main>
    </div>
  )
}
