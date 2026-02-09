import type { Meta, StoryObj } from '@storybook/react'
import CtaSection from '@/components/marketing/cta-section'

const meta = {
  title: 'Marketing/CTA Section',
  component: CtaSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CtaSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
