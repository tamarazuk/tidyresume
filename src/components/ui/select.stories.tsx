import type { Meta, StoryObj } from '@storybook/react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const meta = {
  title: 'UI/Select',
  component: Select,
} satisfies Meta<typeof Select>

export default meta

type Story = StoryObj<typeof meta>

const accentOptions = [
  { value: 'indigo', label: 'Indigo' },
  { value: 'blue', label: 'Blue' },
  { value: 'teal', label: 'Teal' },
] as const

const accentLabels = Object.fromEntries(
  accentOptions.map((option) => [option.value, option.label])
)

export const Default: Story = {
  render: () => (
    <Select defaultValue="indigo">
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select accent">
          {(value) =>
            value == null
              ? 'Select accent'
              : accentLabels[value as keyof typeof accentLabels] ?? value
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {accentOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}
