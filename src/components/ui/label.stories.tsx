import type { Meta, StoryObj } from '@storybook/react'
import { Label } from '@/components/ui/label'

const meta = {
  title: 'UI/Label',
  component: Label,
  args: {
    children: 'Resume title',
    htmlFor: 'story-label-input',
  },
} satisfies Meta<typeof Label>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
