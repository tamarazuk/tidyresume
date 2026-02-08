'use client'

import { useEffect, useRef, type ComponentProps } from 'react'
import {
  CheckIcon,
  ClipboardTextIcon,
  LinkSimpleIcon,
} from '@phosphor-icons/react/dist/ssr'
import type { VariantProps } from 'class-variance-authority'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

import { useSlugSettings } from '@/hooks/use-slug-settings'
import type { ResumeDraftId } from '@/stores/resume-store'

interface SlugSettingsProps {
  label?: string
  ariaLabel?: string
  labelClassName?: string
  className?: string
  onUrlUpdated?: (url: string) => void
  triggerProps?: ComponentProps<typeof PopoverTrigger>
  variant?: VariantProps<typeof buttonVariants>['variant']
  size?: VariantProps<typeof buttonVariants>['size']
  popoverAlign?: 'start' | 'center' | 'end'
  popoverSide?: 'top' | 'bottom' | 'left' | 'right'
  draftId?: ResumeDraftId
}

export function SlugSettings({
  label,
  ariaLabel,
  labelClassName,
  className,
  onUrlUpdated,
  triggerProps,
  variant = 'ghost',
  size = 'icon',
  popoverAlign = 'end',
  popoverSide = 'bottom',
  draftId,
}: SlugSettingsProps) {
  const {
    id,
    isOpen,
    setIsOpen,
    inputValue,
    setInputValue,
    status,
    errorMessage,
    handleSave,
    copyLink,
  } = useSlugSettings({ onUrlUpdated, draftId })
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!isOpen) return
    requestAnimationFrame(() => {
      inputRef.current?.select()
    })
  }, [isOpen])

  // Only show for published resumes
  if (!id) return null

  const { className: triggerClassName, ...restTriggerProps } =
    triggerProps ?? {}

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        {...restTriggerProps}
        className={cn(
          buttonVariants({ variant, size }),
          'gap-1.5',
          className,
          triggerClassName
        )}
        aria-label={ariaLabel ?? label ?? 'Customize link'}
      >
        <LinkSimpleIcon size={16} />
        {label ? <span className={labelClassName}>{label}</span> : null}
      </PopoverTrigger>
      <PopoverContent className="w-80" align={popoverAlign} side={popoverSide}>
        <PopoverHeader>
          <PopoverTitle>Custom URL</PopoverTitle>
          <PopoverDescription>
            Create a memorable link for your resume.
          </PopoverDescription>
        </PopoverHeader>

        <form onSubmit={handleSave} className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="slug">Link Slug</Label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground shrink-0 text-xs select-none">
                /r/
              </span>
              <Input
                id="slug"
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDownCapture={(event) => {
                  event.stopPropagation()
                }}
                onKeyDown={(event) => {
                  event.stopPropagation()
                }}
                placeholder={id.slice(0, 8)} // Show ID preview as placeholder
                className="h-8"
              />
            </div>
            {errorMessage && (
              <p className="text-destructive text-xs">{errorMessage}</p>
            )}
            {status === 'success' && (
              <p className="text-primary flex items-center gap-1 text-xs">
                <CheckIcon size={12} /> Saved!
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copyLink}
              className="h-8 gap-1.5 text-xs"
            >
              <ClipboardTextIcon size={12} />
              Copy link
            </Button>
            <div className="ml-auto flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={status === 'saving'}
                className="h-8 text-xs"
              >
                Save
              </Button>
            </div>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
