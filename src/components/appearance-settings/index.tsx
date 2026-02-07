'use client'

import { PaletteIcon, XIcon } from '@phosphor-icons/react'
import type { VariantProps } from 'class-variance-authority'
import { buttonVariants } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { AppearanceSettingsContent } from './appearance-settings-content'

interface AppearanceSettingsProps {
  label?: string
  showLabel?: boolean
  labelClassName?: string
  ariaLabel?: string
  triggerClassName?: string
  triggerVariant?: VariantProps<typeof buttonVariants>['variant']
  triggerSize?: VariantProps<typeof buttonVariants>['size']
}

export default function AppearanceSettings({
  label = 'Appearance',
  showLabel = true,
  labelClassName = 'hidden sm:inline',
  ariaLabel = 'Customize appearance',
  triggerClassName,
  triggerVariant = 'ghost',
  triggerSize = 'sm',
}: AppearanceSettingsProps) {
  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: triggerVariant, size: triggerSize }),
          'gap-2',
          triggerClassName
        )}
        aria-label={ariaLabel}
      >
        <PaletteIcon size={16} />
        {showLabel ? <span className={labelClassName}>{label}</span> : null}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <PopoverHeader>
          <PopoverTitle>Appearance</PopoverTitle>
          <PopoverDescription>
            Customize your resume&apos;s visual style.
          </PopoverDescription>
        </PopoverHeader>
        <Separator />
        <AppearanceSettingsContent />
      </PopoverContent>
    </Popover>
  )
}

interface AppearanceSettingsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AppearanceSettingsSheet({
  open,
  onOpenChange,
}: AppearanceSettingsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={(nextOpen) => onOpenChange(nextOpen)}>
      <SheetContent>
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Appearance</SheetTitle>
            <SheetClose
              className="text-muted-foreground hover:text-foreground rounded-sm p-1 transition hover:bg-muted"
              aria-label="Close appearance panel"
            >
              <XIcon className="size-4" />
            </SheetClose>
          </div>
          <SheetDescription>
            Customize your resume&apos;s visual style.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 overflow-y-auto p-4">
          <AppearanceSettingsContent />
        </div>
      </SheetContent>
    </Sheet>
  )
}
