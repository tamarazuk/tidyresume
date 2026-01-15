'use client'

import Link from 'next/link'
import {
  CloudArrowUpIcon,
  EyeIcon,
  SpinnerGapIcon,
} from '@phosphor-icons/react/dist/ssr'

import AppIcon from '@/icons/app-icon'
import ResumeTitleInput from '@/components/layout/resume-title-input'
import { Button, buttonVariants } from '@/components/ui/button'
import ThemeToggle from '@/components/ui/theme-toggle'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { usePublish } from '@/hooks/use-publish'
import { useResumeStore } from '@/stores/resume-store'
import { cn, getResumeUrl } from '@/lib/utils'

interface HeaderProps {
  title?: string
}

export default function Header({ title = 'TidyResume Editor' }: HeaderProps) {
  const { isPublishing, publishResume } = usePublish()
  const resumeId = useResumeStore((state) => state.id)

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
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger
            render={(props) => <ThemeToggle buttonProps={props} />}
          />
          <TooltipContent>Toggle theme</TooltipContent>
        </Tooltip>
        <div className="ml-1 flex items-center gap-2 sm:ml-3">
          {resumeId ? (
            <Tooltip>
              <TooltipTrigger
                render={(props) => (
                  <Link
                    {...props}
                    href={getResumeUrl(
                      resumeId,
                      useResumeStore.getState().slug
                    )}
                    target="_blank"
                    className={cn(
                      buttonVariants({ variant: 'default' }),
                      'gap-2'
                    )}
                    aria-label="View resume"
                  >
                    <EyeIcon size={16} />
                    View
                  </Link>
                )}
              />
              <TooltipContent>View</TooltipContent>
            </Tooltip>
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
