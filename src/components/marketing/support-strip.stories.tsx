import type { Meta, StoryObj } from '@storybook/react'
import SupportStrip from '@/components/marketing/support-strip'

const meta = {
  title: 'Marketing/Support Strip',
  component: SupportStrip,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SupportStrip>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
