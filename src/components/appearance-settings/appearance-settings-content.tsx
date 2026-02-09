import { useCallback, useEffect, useState } from 'react'
import {
  LinkSimpleIcon,
  LinkSimpleBreakIcon,
  CaretUpIcon,
  CaretDownIcon,
} from '@phosphor-icons/react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
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
import type { ResumeDraftId } from '@/stores/resume-store'

interface AppearanceSettingsContentProps {
  draftId?: ResumeDraftId
}

export function AppearanceSettingsContent({
  draftId,
}: AppearanceSettingsContentProps) {
  const {
    accentHelpText,
    accentOptions,
    bodyFont,
    bodyLineHeight,
    bodyLineHeightOptions,
    bodyLetterSpacing,
    bodyLetterSpacingOptions,
    bodySize,
    bodySizeOptions,
    fontOptions,
    headingFont,
    headingSize,
    headingSizeOptions,
    labels,
    resolvedAccent,
    margins,
    verticalLocked,
    horizontalLocked,
    marginMin,
    marginMax,
    actions,
  } = useAppearanceSettings({ draftId })

  return (
    <>
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
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label
              className="text-muted-foreground text-xs uppercase"
              htmlFor="appearance-heading-font"
            >
              Heading font
            </Label>
            <Select value={headingFont} onValueChange={actions.setHeadingFont}>
              <SelectTrigger id="appearance-heading-font" className="w-full">
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
          </div>
          <div className="grid gap-2">
            <Label
              className="text-muted-foreground text-xs uppercase"
              htmlFor="appearance-heading-size"
            >
              Heading size
            </Label>
            <Select value={headingSize} onValueChange={actions.setHeadingSize}>
              <SelectTrigger id="appearance-heading-size" className="w-full">
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
          <div className="grid gap-2">
            <Label
              className="text-muted-foreground text-xs uppercase"
              htmlFor="appearance-body-font"
            >
              Body font
            </Label>
            <Select value={bodyFont} onValueChange={actions.setBodyFont}>
              <SelectTrigger id="appearance-body-font" className="w-full">
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
          </div>
          <div className="grid gap-2">
            <Label
              className="text-muted-foreground text-xs uppercase"
              htmlFor="appearance-body-size"
            >
              Body size
            </Label>
            <Select value={bodySize} onValueChange={actions.setBodySize}>
              <SelectTrigger id="appearance-body-size" className="w-full">
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
          <div className="grid gap-2">
            <Label
              className="text-muted-foreground text-xs uppercase"
              htmlFor="appearance-body-line-height"
            >
              Body line height
            </Label>
            <Select
              value={bodyLineHeight}
              onValueChange={actions.setBodyLineHeight}
            >
              <SelectTrigger
                id="appearance-body-line-height"
                className="w-full"
              >
                <SelectValue placeholder="Line height">
                  {(value) =>
                    labels.resolveBodyLineHeightLabel(value as string | null)
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent align="start">
                <SelectGroup>
                  {bodyLineHeightOptions.map((option) => (
                    <SelectItem
                      key={`appearance-body-line-height-${option.value}`}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label
              className="text-muted-foreground text-xs uppercase"
              htmlFor="appearance-body-letter-spacing"
            >
              Body letter spacing
            </Label>
            <Select
              value={bodyLetterSpacing}
              onValueChange={actions.setBodyLetterSpacing}
            >
              <SelectTrigger
                id="appearance-body-letter-spacing"
                className="w-full"
              >
                <SelectValue placeholder="Letter spacing">
                  {(value) =>
                    labels.resolveBodyLetterSpacingLabel(
                      value as string | null
                    )
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent align="start">
                <SelectGroup>
                  {bodyLetterSpacingOptions.map((option) => (
                    <SelectItem
                      key={`appearance-body-letter-spacing-${option.value}`}
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
      <Separator />
      <div className="grid gap-4">
        <div className="text-sm font-medium">Page margins</div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          <div className="relative grid gap-3 pr-10">
            <MarginInput
              id="appearance-margin-top"
              label="Top"
              value={margins.top}
              min={marginMin}
              max={marginMax}
              onChange={(v) => actions.setMargin('top', v)}
            />
            <MarginInput
              id="appearance-margin-bottom"
              label="Bottom"
              value={margins.bottom}
              min={marginMin}
              max={marginMax}
              onChange={(v) => actions.setMargin('bottom', v)}
            />
            <div 
              className="absolute right-[18px] top-[22px] bottom-0 flex items-center pointer-events-none"
              aria-hidden="true"
            >
              <div className="h-[74px] w-2.5 border-y border-r border-muted-foreground/20 rounded-r-md" />
            </div>
            <div className="absolute right-1 top-[79px] -translate-y-1/2">
              <Tooltip>
                <TooltipTrigger
                  render={(triggerProps) => (
                    <button
                      {...triggerProps}
                      type="button"
                      aria-label={
                        verticalLocked
                          ? 'Unlock vertical margins'
                          : 'Lock vertical margins'
                      }
                      aria-pressed={verticalLocked}
                      className={cn(
                        'text-muted-foreground hover:text-foreground relative flex size-6 items-center justify-center rounded-full border bg-popover shadow-xs transition hover:scale-110 active:scale-95 pointer-events-auto',
                        verticalLocked && 'text-primary border-primary/30'
                      )}
                      onClick={actions.toggleVerticalLock}
                    >
                      {verticalLocked && (
                        <div className="absolute inset-0 rounded-full bg-primary/10" />
                      )}
                      <div className="relative z-10 flex items-center justify-center">
                        {verticalLocked ? (
                          <LinkSimpleIcon size={12} weight="bold" />
                        ) : (
                          <LinkSimpleBreakIcon size={12} />
                        )}
                      </div>
                    </button>
                  )}
                />
                <TooltipContent side="right">
                  {verticalLocked ? 'Unlock top/bottom' : 'Lock top/bottom'}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="relative grid gap-3 pr-10">
            <MarginInput
              id="appearance-margin-left"
              label="Left"
              value={margins.left}
              min={marginMin}
              max={marginMax}
              onChange={(v) => actions.setMargin('left', v)}
            />
            <MarginInput
              id="appearance-margin-right"
              label="Right"
              value={margins.right}
              min={marginMin}
              max={marginMax}
              onChange={(v) => actions.setMargin('right', v)}
            />
            <div 
              className="absolute right-[18px] top-[22px] bottom-0 flex items-center pointer-events-none"
              aria-hidden="true"
            >
              <div className="h-[74px] w-2.5 border-y border-r border-muted-foreground/20 rounded-r-md" />
            </div>
            <div className="absolute right-1 top-[79px] -translate-y-1/2">
              <Tooltip>
                <TooltipTrigger
                  render={(triggerProps) => (
                    <button
                      {...triggerProps}
                      type="button"
                      aria-label={
                        horizontalLocked
                          ? 'Unlock horizontal margins'
                          : 'Lock horizontal margins'
                      }
                      aria-pressed={horizontalLocked}
                      className={cn(
                        'text-muted-foreground hover:text-foreground relative flex size-6 items-center justify-center rounded-full border bg-popover shadow-xs transition hover:scale-110 active:scale-95 pointer-events-auto',
                        horizontalLocked && 'text-primary border-primary/30'
                      )}
                      onClick={actions.toggleHorizontalLock}
                    >
                      {horizontalLocked && (
                        <div className="absolute inset-0 rounded-full bg-primary/10" />
                      )}
                      <div className="relative z-10 flex items-center justify-center">
                        {horizontalLocked ? (
                          <LinkSimpleIcon size={12} weight="bold" />
                        ) : (
                          <LinkSimpleBreakIcon size={12} />
                        )}
                      </div>
                    </button>
                  )}
                />
                <TooltipContent side="right">
                  {horizontalLocked ? 'Unlock left/right' : 'Lock left/right'}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground text-xs">
          Values in mm. Lock icons sync paired sides.
        </p>
      </div>
    </>
  )
}

function MarginInput({
  id,
  label,
  value,
  min,
  max,
  onChange,
}: {
  id: string
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}) {
  const [inputValue, setInputValue] = useState(() => String(value))

  useEffect(() => {
    setInputValue(String(value))
  }, [value])

  const commitValue = useCallback(() => {
    const parsed = Number.parseInt(inputValue.trim(), 10)
    if (Number.isNaN(parsed)) {
      setInputValue(String(value))
      return
    }

    const clamped = Math.max(min, Math.min(max, parsed))
    setInputValue(String(clamped))
    if (clamped !== value) {
      onChange(clamped)
    }
  }, [inputValue, max, min, onChange, value])

  const increment = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  const decrement = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  return (
    <div className="grid gap-1.5">
      <Label
        className="text-muted-foreground text-xs uppercase"
        htmlFor={id}
      >
        {label}
      </Label>
      <div className="group relative">
        <Input
          id={id}
          type="number"
          min={min}
          max={max}
          step={1}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onBlur={commitValue}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              commitValue()
            }
          }}
          className="hide-spinners pr-16 tabular-nums"
        />
        <div className="absolute right-0 top-0 bottom-0 flex items-center pr-2">
          <span className="text-muted-foreground pointer-events-none text-xs mr-2">
            mm
          </span>
          <div className="flex flex-col border-l pl-1.5 border-border/50">
            <button
              type="button"
              tabIndex={-1}
              className="text-muted-foreground hover:text-foreground flex size-3.5 items-center justify-center rounded-sm transition hover:bg-muted"
              onClick={increment}
              aria-label={`Increase ${label.toLowerCase()} margin`}
            >
              <CaretUpIcon size={10} weight="bold" />
            </button>
            <button
              type="button"
              tabIndex={-1}
              className="text-muted-foreground hover:text-foreground flex size-3.5 items-center justify-center rounded-sm transition hover:bg-muted"
              onClick={decrement}
              aria-label={`Decrease ${label.toLowerCase()} margin`}
            >
              <CaretDownIcon size={10} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
