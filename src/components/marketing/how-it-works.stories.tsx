import type { Meta, StoryObj } from '@storybook/react'
import HowItWorks from '@/components/marketing/how-it-works'

const meta = {
  title: 'Marketing/How It Works',
  component: HowItWorks,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof HowItWorks>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
