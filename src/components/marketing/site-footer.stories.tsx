import type { Meta, StoryObj } from '@storybook/react'
import SiteFooter from '@/components/marketing/site-footer'

const meta = {
  title: 'Marketing/Site Footer',
  component: SiteFooter,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SiteFooter>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
