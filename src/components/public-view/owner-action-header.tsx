'use client'

import Link from 'next/link'
import {
  ArrowsInSimpleIcon,
  ArrowsOutSimpleIcon,
  PencilSimpleIcon,
  ShareFatIcon,
  SpinnerGapIcon,
  TrashIcon,
} from '@phosphor-icons/react/dist/ssr'

import { SlugSettings } from '@/components/layout/slug-settings'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useOwnerActionHeader } from '@/hooks/use-owner-action-header'
import { useEditorViewStore } from '@/stores/editor-view-store'
import { cn } from '@/lib/utils'

import { MagicLinkDialog } from '@/components/public-view/magic-link-dialog'

interface OwnerActionHeaderProps {
  id: string
  isFullWidth: boolean
  onToggleWidth: () => void
}

export function OwnerActionHeader({
  id,
  isFullWidth,
  onToggleWidth,
}: OwnerActionHeaderProps) {
  const { isOwner, isDeleting, handleDelete, handleShare, handleUrlUpdated } =
    useOwnerActionHeader({ id })
  const isPreviewMode = useEditorViewStore(
    (state) => state.editorViewState.isPreviewMode
  )
  const WidthIcon = isFullWidth ? ArrowsInSimpleIcon : ArrowsOutSimpleIcon
  const widthLabel = isFullWidth ? 'Page width' : 'Full width'
  const widthText = isFullWidth ? 'Page' : 'Full'

  if (!isOwner || isPreviewMode) return null

  return (
    <>
      {isDeleting ? (
        <div className="no-print bg-background/80 fixed inset-0 z-60 flex items-center justify-center px-4 backdrop-blur-sm">
          <div
            className="border-border bg-background text-foreground flex max-w-sm items-center gap-3 rounded-lg border px-4 py-3 shadow-lg"
            role="status"
            aria-live="polite"
          >
            <SpinnerGapIcon size={20} className="text-primary animate-spin" />
            <div className="space-y-0.5 text-sm">
              <p className="font-medium">Deleting resume...</p>
              <p className="text-muted-foreground text-xs">
                You will be redirected shortly.
              </p>
            </div>
          </div>
        </div>
      ) : null}
      <div className="no-print border-border bg-background/80 fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border px-3 py-2 shadow-sm backdrop-blur-md sm:top-1/2 sm:right-4 sm:bottom-auto sm:left-auto sm:translate-x-0 sm:-translate-y-1/2 sm:flex-col sm:rounded-2xl sm:px-2 sm:py-3">
        <Tooltip>
          <TooltipTrigger
            render={(props) => {
              const { className: triggerClassName, ...rest } = props
              return (
                <Link
                  {...rest}
                  href={`/edit`} // Since it's local storage based, /edit implies editing 'current'
                  className={cn(
                    buttonVariants({ variant: 'default', size: 'sm' }),
                    'gap-1.5',
                    triggerClassName
                  )}
                  aria-label="Edit resume"
                >
                  <PencilSimpleIcon size={16} />
                  <span className="sm:hidden">Edit</span>
                </Link>
              )
            }}
          />
          <TooltipContent side="right" align="center" sideOffset={8}>
            Edit
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={(props) => (
              <SlugSettings
                label="Link"
                ariaLabel="Edit link"
                labelClassName="sm:hidden"
                variant="secondary"
                size="sm"
                popoverSide="right"
                popoverAlign="start"
                triggerProps={props}
                onUrlUpdated={handleUrlUpdated}
              />
            )}
          />
          <TooltipContent side="right" align="center" sideOffset={8}>
            Edit link
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={(props) => (
              <MagicLinkDialog resumeId={id} triggerProps={props} />
            )}
          />
          <TooltipContent side="right" align="center" sideOffset={8}>
            Edit on another device
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={(props) => {
              const { className: triggerClassName, onClick, ...rest } = props
              return (
                <Button
                  {...rest}
                  variant="secondary"
                  size="sm"
                  className={cn('gap-1.5', triggerClassName)}
                  onClick={(event) => {
                    onClick?.(event)
                    handleShare()
                  }}
                  aria-label="Share resume"
                >
                  <ShareFatIcon size={16} />
                  <span className="sm:hidden">Share</span>
                </Button>
              )
            }}
          />
          <TooltipContent side="right" align="center" sideOffset={8}>
            Share
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={(props) => {
              const { className: triggerClassName, onClick, ...rest } = props
              return (
                <Button
                  {...rest}
                  variant="secondary"
                  size="sm"
                  className={cn('gap-1.5', triggerClassName)}
                  onClick={(event) => {
                    onClick?.(event)
                    onToggleWidth()
                  }}
                  aria-label={widthLabel}
                  aria-pressed={isFullWidth}
                >
                  <WidthIcon size={16} />
                  <span className="sm:hidden">{widthText}</span>
                </Button>
              )
            }}
          />
          <TooltipContent side="right" align="center" sideOffset={8}>
            {widthLabel}
          </TooltipContent>
        </Tooltip>
        <div className="bg-border mx-1 h-4 w-px sm:h-px sm:w-6" />
        <Tooltip>
          <TooltipTrigger
            render={(props) => {
              const { className: triggerClassName, onClick, ...rest } = props
              return (
                <Button
                  {...rest}
                  variant="ghost" // Use ghost for destructive to be less aggressive until hover
                  size="icon-sm"
                  className={cn(
                    'text-muted-foreground hover:bg-destructive/10 hover:text-destructive',
                    triggerClassName
                  )}
                  onClick={(event) => {
                    onClick?.(event)
                    handleDelete()
                  }}
                  disabled={isDeleting}
                  aria-label="Delete resume"
                >
                  <TrashIcon size={16} />
                </Button>
              )
            }}
          />
          <TooltipContent side="right" align="center" sideOffset={8}>
            Delete
          </TooltipContent>
        </Tooltip>
      </div>
    </>
  )
}
