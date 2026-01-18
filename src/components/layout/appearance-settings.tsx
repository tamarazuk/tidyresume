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
import {
  DEFAULT_RESUME_THEME,
  RESUME_ACCENT_OPTIONS,
  RESUME_FONT_OPTIONS,
  RESUME_BODY_SIZE_OPTIONS,
  RESUME_HEADING_SIZE_OPTIONS,
  getResumeAccentSwatch,
  resolveResumeAccent,
} from '@/lib/resume-theme'
import type {
  ResumeBodySize,
  ResumeFont,
  ResumeHeadingSize,
} from '@/lib/resume-types'
import { cn } from '@/lib/utils'
import { useResumeStore } from '@/stores/resume-store'

const accentHelpText = 'Applied to section headings and links.'
const fontLabelByValue = RESUME_FONT_OPTIONS.reduce<
  Record<ResumeFont, string>
>((acc, option) => {
  acc[option.value] = option.label
  return acc
}, {} as Record<ResumeFont, string>)
const headingSizeLabelByValue = RESUME_HEADING_SIZE_OPTIONS.reduce<
  Record<ResumeHeadingSize, string>
>((acc, option) => {
  acc[option.value] = option.label
  return acc
}, {} as Record<ResumeHeadingSize, string>)
const bodySizeLabelByValue = RESUME_BODY_SIZE_OPTIONS.reduce<
  Record<ResumeBodySize, string>
>((acc, option) => {
  acc[option.value] = option.label
  return acc
}, {} as Record<ResumeBodySize, string>)
const legacyHeadingSizeLabelByValue: Record<string, string> = {
  14: 'Small',
  15: 'Medium',
  16: 'Large',
}
const legacyBodySizeLabelByValue: Record<string, string> = {
  sm: '14 px',
  md: '15 px',
  lg: '16 px',
}
const resolveHeadingSizeLabel = (value: string | null): string => {
  if (!value) return 'Size'
  return (
    headingSizeLabelByValue[value as ResumeHeadingSize] ??
    legacyHeadingSizeLabelByValue[value] ??
    'Size'
  )
}
const resolveBodySizeLabel = (value: string | null): string => {
  if (!value) return 'Size'
  return (
    bodySizeLabelByValue[value as ResumeBodySize] ??
    legacyBodySizeLabelByValue[value] ??
    'Size'
  )
}
export default function AppearanceSettings() {
  const accent = useResumeStore((state) => state.resumeDisplay.theme?.accent)
  const resumeTheme = useResumeStore((state) => state.resumeDisplay.theme)
  const setResumeTheme = useResumeStore((state) => state.setResumeTheme)
  const setResumeAccent = useResumeStore((state) => state.setResumeAccent)
  const resolvedAccent = resolveResumeAccent({ accent })
  const typography = resumeTheme.typography ?? {}
  const headingFont =
    typography.heading ?? DEFAULT_RESUME_THEME.typography?.heading ?? 'geologica'
  const bodyFont =
    typography.body ?? DEFAULT_RESUME_THEME.typography?.body ?? 'noto-sans'
  const headingSize =
    typography.headingSize ??
    DEFAULT_RESUME_THEME.typography?.headingSize ??
    'md'
  const bodySize =
    typography.bodySize ??
    DEFAULT_RESUME_THEME.typography?.bodySize ??
    '15'

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
        <div className="grid gap-4">
          <div className="text-sm font-medium">Typography</div>
          <div className="grid gap-2">
            <Label className="text-muted-foreground text-xs uppercase">
              Heading
            </Label>
            <div className="flex flex-wrap gap-2">
              <Select
                value={headingFont}
                onValueChange={(value) =>
                  setResumeTheme({
                    ...resumeTheme,
                    typography: {
                      ...typography,
                      heading: value as ResumeFont,
                    },
                  })
                }
              >
                <SelectTrigger className="min-w-[160px] flex-1">
                  <SelectValue placeholder="Select font">
                    {(value) =>
                      value
                        ? fontLabelByValue[value as ResumeFont]
                        : 'Select font'
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectGroup>
                    {RESUME_FONT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select
                value={headingSize}
                onValueChange={(value) =>
                  setResumeTheme({
                    ...resumeTheme,
                    typography: {
                      ...typography,
                      headingSize: value as ResumeHeadingSize,
                    },
                  })
                }
              >
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Size">
                    {(value) => resolveHeadingSizeLabel(value as string | null)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectGroup>
                    {RESUME_HEADING_SIZE_OPTIONS.map((option) => (
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
              <Select
                value={bodyFont}
                onValueChange={(value) =>
                  setResumeTheme({
                    ...resumeTheme,
                    typography: {
                      ...typography,
                      body: value as ResumeFont,
                    },
                  })
                }
              >
                <SelectTrigger className="min-w-[160px] flex-1">
                  <SelectValue placeholder="Select font">
                    {(value) =>
                      value
                        ? fontLabelByValue[value as ResumeFont]
                        : 'Select font'
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectGroup>
                    {RESUME_FONT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select
                value={bodySize}
                onValueChange={(value) =>
                  setResumeTheme({
                    ...resumeTheme,
                    typography: {
                      ...typography,
                      bodySize: value as ResumeBodySize,
                    },
                  })
                }
              >
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Size">
                    {(value) => resolveBodySizeLabel(value as string | null)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectGroup>
                    {RESUME_BODY_SIZE_OPTIONS.map((option) => (
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
