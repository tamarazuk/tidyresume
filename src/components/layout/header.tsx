'use client'

import Link from 'next/link'

import {
  CloudArrowUpIcon,
  CloudSlashIcon,
  DotsNineIcon,
  PrinterIcon,
  SpinnerGapIcon,
} from '@phosphor-icons/react/dist/ssr'

import AppIcon from '@/icons/app-icon'
import AppearanceSettings from '@/components/appearance-settings'
import ResumeTitleInput from '@/components/layout/resume-title-input'
import { SlugSettings } from '@/components/layout/slug-settings'
import { Button, buttonVariants } from '@/components/ui/button'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { usePublish } from '@/hooks/use-publish'
import usePlatformShortcuts from '@/hooks/use-platform-shortcuts'
import { useResumeStore } from '@/stores/resume-store'
import { cn, getResumeUrl } from '@/lib/utils'
import { DEFAULT_RESUME_TITLE, FOCUS_TITLE_EVENT } from '@/lib/constants'

interface HeaderProps {
  title?: string
}

export default function Header({ title = 'TidyResume Editor' }: HeaderProps) {
  const { isPublishing, isUnpublishing, publishResume, unpublishResume } =
    usePublish()
  const { formatShortcutKeys } = usePlatformShortcuts()
  const resumeId = useResumeStore((state) => state.id)
  const isPublished = useResumeStore((state) => state.isPublished)
  const resumeTitle = useResumeStore((state) => state.resumeTitle)
  const isUntitled = resumeTitle === DEFAULT_RESUME_TITLE
  const printShortcutKeys = formatShortcutKeys(['Mod', 'P'])

  return (
    <header className="border-border bg-background no-print z-20 flex flex-none items-center justify-between border-b border-solid px-6 py-3 whitespace-nowrap">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex size-12 items-center justify-center"
          aria-label="TidyResume home"
        >
          <AppIcon className="h-full w-full" />
        </Link>
        <div>
          <h2 className="font-heading text-foreground text-lg leading-tight font-bold tracking-[-0.015em]">
            {title}
          </h2>
          <ResumeTitleInput />
        </div>
      </div>
      <div className="flex items-center gap-2">
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
                {printShortcutKeys.map((key) => (
                  <Kbd key={`print-${key}`}>{key}</Kbd>
                ))}
              </div>
            </DropdownMenuItem>
            <AppearanceSettings
              label="Appearance"
              labelClassName="inline"
              triggerVariant="ghost"
              triggerSize="sm"
              triggerClassName={cn(
                dropdownMenuItemClassName,
                'w-full justify-start focus:bg-transparent focus:text-foreground data-[highlighted]:bg-transparent data-[highlighted]:text-foreground'
              )}
            />
            <SlugSettings
              label="Edit link"
              labelClassName="inline"
              variant="ghost"
              size="sm"
              className={cn(dropdownMenuItemClassName, 'w-full justify-start')}
            />
            {isPublished ? (
              <DropdownMenuItem
                variant="destructive"
                onClick={() => unpublishResume()}
                disabled={isUnpublishing}
              >
                {isUnpublishing ? (
                  <SpinnerGapIcon size={16} className="animate-spin" />
                ) : (
                  <CloudSlashIcon size={16} />
                )}
                <span>Unpublish</span>
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuSeparator />
            <ThemeToggle
              lightLabel="Switch to dark mode"
              darkLabel="Switch to light mode"
              labelClassName="inline"
              buttonProps={{
                variant: 'ghost',
                size: 'sm',
                className: cn(
                  dropdownMenuItemClassName,
                  'w-full justify-start'
                ),
              }}
            />
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-2">
          {isPublished ? (
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger
                  render={(props) => (
                    <Link
                      {...props}
                      href={getResumeUrl(
                        resumeId,
                        useResumeStore.getState().slug
                      )}
                      className={cn(
                        buttonVariants({ variant: 'default' }),
                        'gap-2'
                      )}
                      aria-label="View resume"
                    >
                      View
                    </Link>
                  )}
                />
                <TooltipContent>View</TooltipContent>
              </Tooltip>
            </div>
          ) : isUntitled ? (
            <Popover>
              <PopoverTrigger
                render={(props) => (
                  <Button
                    {...props}
                    className="gap-2"
                    aria-label="Publish resume"
                  >
                    <CloudArrowUpIcon size={16} />
                    Publish
                  </Button>
                )}
              />
              <PopoverContent align="end" className="w-80">
                <div className="flex flex-col gap-2">
                  <p className="font-medium">Set a title to publish</p>
                  <p className="text-muted-foreground text-sm">
                    Please give your resume a unique title before publishing.
                  </p>
                  <Button
                    variant="link"
                    className="h-auto justify-start p-0"
                    onClick={() => {
                      window.dispatchEvent(new Event(FOCUS_TITLE_EVENT))
                    }}
                  >
                    Set title
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Tooltip>
              <TooltipTrigger
                render={(props) => (
                  <Button
                    {...props}
                    onClick={publishResume}
                    disabled={isPublishing}
                    className="gap-2"
                    aria-label="Publish resume"
                  >
                    {isPublishing ? (
                      <SpinnerGapIcon size={16} className="animate-spin" />
                    ) : (
                      <CloudArrowUpIcon size={16} />
                    )}
                    Publish
                  </Button>
                )}
              />
              <TooltipContent>Publish</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </header>
  )
}
