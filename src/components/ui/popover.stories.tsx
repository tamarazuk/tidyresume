import type { Meta, StoryObj } from '@storybook/react'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

const meta = {
  title: 'UI/Popover',
  component: Popover,
} satisfies Meta<typeof Popover>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Popover open>
      <PopoverTrigger render={<Button>Open Popover</Button>} />
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Set a title to publish</PopoverTitle>
          <PopoverDescription>
            Give your resume a unique title before publishing.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
}
