import type { Meta, StoryObj } from '@storybook/react'
import CtaStrip from '@/components/marketing/cta-strip'

const meta = {
  title: 'Marketing/CTA Strip',
  component: CtaStrip,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CtaStrip>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
