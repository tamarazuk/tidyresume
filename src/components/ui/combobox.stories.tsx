import type { Meta, StoryObj } from '@storybook/react'
import { useRef, type ComponentType, type ReactNode } from 'react'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from '@/components/ui/combobox'

const meta = {
  title: 'UI/Combobox',
  component: Combobox,
} satisfies Meta<typeof Combobox>

export default meta

type Story = StoryObj<typeof meta>

const options = [
  { value: 'geologica', label: 'Geologica' },
  { value: 'noto-sans', label: 'Noto Sans' },
  { value: 'ibm-plex-sans', label: 'IBM Plex Sans' },
]

function ComboboxPreview() {
  const anchorRef = useRef<HTMLDivElement | null>(null)
  const UnsafeCombobox = Combobox as unknown as ComponentType<{
    defaultValue: (typeof options)[number]
    items: typeof options
    children: ReactNode
  }>

  return (
    <div className="w-72" ref={anchorRef}>
      <UnsafeCombobox defaultValue={options[0]} items={options}>
        <ComboboxInput placeholder="Select font" />
        <ComboboxContent anchor={anchorRef}>
          <ComboboxList>
            <ComboboxEmpty>No options</ComboboxEmpty>
            <ComboboxGroup>
              <ComboboxLabel>Fonts</ComboboxLabel>
              {options.map((item) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
          </ComboboxList>
        </ComboboxContent>
      </UnsafeCombobox>
    </div>
  )
}

export const Default: Story = {
  render: () => <ComboboxPreview />,
}
