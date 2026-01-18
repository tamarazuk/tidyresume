'use client'

import { PaletteIcon } from '@phosphor-icons/react/dist/ssr'
import type { VariantProps } from 'class-variance-authority'
import { buttonVariants } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { getResumeAccentSwatch } from '@/lib/resume-theme'
import { cn } from '@/lib/utils'
import { useAppearanceSettings } from './hooks/use-appearance-settings'

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
  const {
    accentHelpText,
    accentOptions,
    bodyFont,
    bodySize,
    bodySizeOptions,
    fontOptions,
    headingFont,
    headingSize,
    headingSizeOptions,
    labels,
    resolvedAccent,
    actions,
  } = useAppearanceSettings()

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
        <div className="grid gap-3">
          <Label htmlFor="resume-accent">Accent color</Label>
          <div
            id="resume-accent"
            role="radiogroup"
            aria-label="Accent color"
            className="flex flex-wrap gap-2"
          >
            {accentOptions.map((option, index) => {
              const isSelected = option.value === resolvedAccent
              return (
                <Tooltip key={`appearance-accent-color-${option.value}`}>
                  <TooltipTrigger
                    render={(triggerProps) => (
                      <button
                        {...triggerProps}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={option.label}
                        tabIndex={isSelected ? 0 : -1}
                        className={cn(
                          'border-border size-6 rounded-full border transition focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                          isSelected &&
                            'ring-2 ring-primary/50 ring-offset-2 ring-offset-background'
                        )}
                        style={{
                          backgroundColor: getResumeAccentSwatch(option.value),
                        }}
                        onClick={() => actions.setResumeAccent(option.value)}
                        onKeyDown={(event) =>
                          actions.handleAccentKeyDown(event, index)
                        }
                      />
                    )}
                  />
                  <TooltipContent>{option.label}</TooltipContent>
                </Tooltip>
              )
            })}
          </div>
          <p className="text-muted-foreground text-xs">{accentHelpText}</p>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="text-sm font-medium">Typography</div>
          <div className="grid gap-2">
            <Label className="text-muted-foreground text-xs uppercase">
              Heading
            </Label>
            <div className="flex flex-wrap gap-2">
              <Select value={headingFont} onValueChange={actions.setHeadingFont}>
                <SelectTrigger className="min-w-[160px] flex-1">
                  <SelectValue placeholder="Select font">
                    {(value) => labels.resolveFontLabel(value as string | null)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectGroup>
                    {fontOptions.map((option) => (
                      <SelectItem
                        key={`appearance-heading-font-${option.value}`}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select value={headingSize} onValueChange={actions.setHeadingSize}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Size">
                    {(value) =>
                      labels.resolveHeadingSizeLabel(value as string | null)
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectGroup>
                    {headingSizeOptions.map((option) => (
                      <SelectItem
                        key={`appearance-heading-size-${option.value}`}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label className="text-muted-foreground text-xs uppercase">
              Body
            </Label>
            <div className="flex flex-wrap gap-2">
              <Select value={bodyFont} onValueChange={actions.setBodyFont}>
                <SelectTrigger className="min-w-[160px] flex-1">
                  <SelectValue placeholder="Select font">
                    {(value) => labels.resolveFontLabel(value as string | null)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectGroup>
                    {fontOptions.map((option) => (
                      <SelectItem
                        key={`appearance-body-font-${option.value}`}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select value={bodySize} onValueChange={actions.setBodySize}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Size">
                    {(value) =>
                      labels.resolveBodySizeLabel(value as string | null)
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectGroup>
                    {bodySizeOptions.map((option) => (
                      <SelectItem
                        key={`appearance-body-size-${option.value}`}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
