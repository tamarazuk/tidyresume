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
import { Separator } from '@/components/ui/separator'
import {
  RESUME_ACCENT_OPTIONS,
  getResumeAccentSwatch,
  resolveResumeAccent,
} from '@/lib/resume-theme'
import { cn } from '@/lib/utils'
import { useResumeStore } from '@/stores/resume-store'

const accentHelpText = 'Applied to section headings and links.'
export default function AppearanceSettings() {
  const accent = useResumeStore((state) => state.resumeDisplay.theme?.accent)
  const setResumeAccent = useResumeStore((state) => state.setResumeAccent)
  const resolvedAccent = resolveResumeAccent({ accent })

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
            Customize your resume's visual style.
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
            {RESUME_ACCENT_OPTIONS.map((option, index) => {
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
                        onClick={() => setResumeAccent(option.value)}
                        onKeyDown={(event) => {
                          if (
                            event.key === 'ArrowRight' ||
                            event.key === 'ArrowDown'
                          ) {
                            event.preventDefault()
                            const nextIndex =
                              (index + 1) % RESUME_ACCENT_OPTIONS.length
                            setResumeAccent(RESUME_ACCENT_OPTIONS[nextIndex].value)
                          }
                          if (
                            event.key === 'ArrowLeft' ||
                            event.key === 'ArrowUp'
                          ) {
                            event.preventDefault()
                            const prevIndex =
                              (index - 1 + RESUME_ACCENT_OPTIONS.length) %
                              RESUME_ACCENT_OPTIONS.length
                            setResumeAccent(RESUME_ACCENT_OPTIONS[prevIndex].value)
                          }
                          if (event.key === 'Home') {
                            event.preventDefault()
                            setResumeAccent(RESUME_ACCENT_OPTIONS[0].value)
                          }
                          if (event.key === 'End') {
                            event.preventDefault()
                            setResumeAccent(
                              RESUME_ACCENT_OPTIONS[
                                RESUME_ACCENT_OPTIONS.length - 1
                              ].value
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
        <div className="grid gap-2">
          <div className="text-sm font-medium">Typography</div>
          <p className="text-muted-foreground text-xs">
            Heading and body font controls are coming next.
          </p>
        </div>
        <Separator />
        <div className="grid gap-2">
          <div className="text-sm font-medium">Size</div>
          <p className="text-muted-foreground text-xs">
            Font size controls will follow the font update.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
