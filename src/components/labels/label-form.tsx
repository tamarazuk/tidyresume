'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DEFAULT_LABEL_COLOR } from '@/lib/label-colors'
import { LabelColorPicker } from './label-color-picker'

interface LabelFormProps {
  initialName?: string
  initialColor?: string
  onSave: (name: string, color: string) => void
  onCancel: () => void
}

const MAX_LABEL_NAME_LENGTH = 40

export function LabelForm({
  initialName = '',
  initialColor = DEFAULT_LABEL_COLOR,
  onSave,
  onCancel,
}: LabelFormProps) {
  const [name, setName] = useState(initialName)
  const [color, setColor] = useState(initialColor)

  const trimmedName = name.trim()
  const canSave = trimmedName.length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (canSave) {
      onSave(trimmedName, color)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <Input
        value={name}
        onChange={(e) =>
          setName(e.target.value.slice(0, MAX_LABEL_NAME_LENGTH))
        }
        placeholder="Label name"
        autoFocus
        aria-label="Label name"
      />
      <LabelColorPicker value={color} onChange={setColor} />
      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" size="xs" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="xs" disabled={!canSave}>
          Save
        </Button>
      </div>
    </form>
  )
}
