import type { Meta, StoryObj } from '@storybook/react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'

const meta = {
  title: 'UI/Sonner',
  component: Toaster,
  parameters: {
    docs: {
      description: {
        component: 'Use this component once at app shell level.',
      },
    },
  },
} satisfies Meta<typeof Toaster>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Button onClick={() => toast.success('Resume published')}>Show Toast</Button>
  ),
}
