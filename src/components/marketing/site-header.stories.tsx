import type { Meta, StoryObj } from '@storybook/react'
import SiteHeader from '@/components/marketing/site-header'

const meta = {
  title: 'Marketing/Site Header',
  component: SiteHeader,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SiteHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
