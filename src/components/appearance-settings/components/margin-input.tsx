import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface MarginInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}

export function MarginInput({
  label,
  value,
  onChange,
  min = 0,
  max = 50,
  step = 1,
  disabled = false,
}: MarginInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-muted-foreground text-xs uppercase" htmlFor={`margin-${label.toLowerCase()}`}>
        {label}
      </Label>
      <div className="relative">
        <Input
          id={`margin-${label.toLowerCase()}`}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="pr-8"
        />
        <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm pointer-events-none">
          mm
        </span>
      </div>
    </div>
  )
}
