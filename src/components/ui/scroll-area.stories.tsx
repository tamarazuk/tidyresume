import type { Meta, StoryObj } from '@storybook/react'
import { ScrollArea } from '@/components/ui/scroll-area'

const meta = {
  title: 'UI/Scroll Area',
  component: ScrollArea,
} satisfies Meta<typeof ScrollArea>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-48 w-80 rounded-md border">
      <div className="space-y-2 p-4 text-sm">
        {Array.from({ length: 24 }).map((_, index) => (
          <p key={`item-${index}`}>Experience line {index + 1}</p>
        ))}
      </div>
    </ScrollArea>
  ),
}
