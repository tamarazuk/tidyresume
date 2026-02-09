import type { Meta, StoryObj } from '@storybook/react'
import TrustSignals from '@/components/marketing/trust-signals'

const meta = {
  title: 'Marketing/Trust Signals',
  component: TrustSignals,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TrustSignals>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
