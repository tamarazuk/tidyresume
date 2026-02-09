import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { LabelColorPicker } from '@/components/labels/label-color-picker'
import { DEFAULT_LABEL_COLOR, LABEL_COLOR_PALETTE } from '@/lib/label-colors'

const meta = {
  title: 'Labels/Label Color Picker',
  component: LabelColorPicker,
  args: {
    value: DEFAULT_LABEL_COLOR,
    onChange: fn(),
  },
} satisfies Meta<typeof LabelColorPicker>

export default meta

type Story = StoryObj<typeof meta>

function ColorPickerDemo({ initialColor }: { initialColor: string }) {
  const [color, setColor] = useState(initialColor)
  return (
    <div className="space-y-4">
      <LabelColorPicker value={color} onChange={setColor} />
      <div className="text-muted-foreground text-sm">
        Selected: <span style={{ color }}>{color}</span>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: (args) => <ColorPickerDemo initialColor={args.value} />,
}

export const PreSelected: Story = {
  args: {
    value: LABEL_COLOR_PALETTE[8],
  },
  render: (args) => <ColorPickerDemo initialColor={args.value} />,
}
