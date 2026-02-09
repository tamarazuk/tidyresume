import type { Meta, StoryObj } from '@storybook/react'
import SupportSection from '@/components/marketing/support-section'

const meta = {
  title: 'Marketing/Support Section',
  component: SupportSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SupportSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
