'use client'

import { PaletteIcon } from '@phosphor-icons/react/dist/ssr'
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

export default function AppearanceSettings() {
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
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'gap-2'
        )}
        aria-label="Customize appearance"
      >
        <PaletteIcon size={16} />
        <span className="hidden sm:inline">Appearance</span>
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
                <Tooltip key={option.value}>
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
                        onKeyDown={(event) => {
                          if (
                            event.key === 'ArrowRight' ||
                            event.key === 'ArrowDown'
                          ) {
                            event.preventDefault()
                            const nextIndex = (index + 1) % accentOptions.length
                            actions.setResumeAccent(accentOptions[nextIndex].value)
                          }
                          if (
                            event.key === 'ArrowLeft' ||
                            event.key === 'ArrowUp'
                          ) {
                            event.preventDefault()
                            const prevIndex =
                              (index - 1 + accentOptions.length) %
                              accentOptions.length
                            actions.setResumeAccent(accentOptions[prevIndex].value)
                          }
                          if (event.key === 'Home') {
                            event.preventDefault()
                            actions.setResumeAccent(accentOptions[0].value)
                          }
                          if (event.key === 'End') {
                            event.preventDefault()
                            actions.setResumeAccent(
                              accentOptions[accentOptions.length - 1].value
                            )
                          }
                        }}
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
                      <SelectItem key={option.value} value={option.value}>
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
                      <SelectItem key={option.value} value={option.value}>
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
                      <SelectItem key={option.value} value={option.value}>
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
                      <SelectItem key={option.value} value={option.value}>
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
