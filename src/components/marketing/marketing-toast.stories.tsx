import type { Meta, StoryObj } from '@storybook/react'
import MarketingToast from '@/components/marketing/marketing-toast'

const meta = {
  title: 'Marketing/Marketing Toast',
  component: MarketingToast,
  parameters: {
    docs: {
      description: {
        component:
          'Non-visual client component that reacts to `toast` query params.',
      },
    },
  },
} satisfies Meta<typeof MarketingToast>

export default meta

type Story = StoryObj<typeof meta>

export const NonVisual: Story = {
  render: () => <MarketingToast />,
}
