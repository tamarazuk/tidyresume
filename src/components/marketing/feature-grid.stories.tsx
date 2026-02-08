import type { Meta, StoryObj } from '@storybook/react'
import FeatureGrid from '@/components/marketing/feature-grid'

const meta = {
  title: 'Marketing/Feature Grid',
  component: FeatureGrid,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof FeatureGrid>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
