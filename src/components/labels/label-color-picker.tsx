'use client'

import { LABEL_COLOR_PALETTE } from '@/lib/label-colors'
import { cn } from '@/lib/utils'

interface LabelColorPickerProps {
  value: string
  onChange: (color: string) => void
}

export function LabelColorPicker({ value, onChange }: LabelColorPickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Label color"
      className="grid grid-cols-8 gap-1.5"
    >
      {LABEL_COLOR_PALETTE.map((color) => {
        const isSelected = value === color
        return (
          <button
            key={color}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={color}
            className={cn(
              'focus-visible:ring-primary/40 focus-visible:ring-offset-background size-6 rounded-full border border-transparent transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden',
              isSelected &&
                'ring-primary/50 ring-offset-background ring-2 ring-offset-2'
            )}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
          />
        )
      })}
    </div>
  )
}
