import type { Meta, StoryObj } from '@storybook/react'
import Features from '@/components/marketing/features'

const meta = {
  title: 'Marketing/Features',
  component: Features,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Features>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
