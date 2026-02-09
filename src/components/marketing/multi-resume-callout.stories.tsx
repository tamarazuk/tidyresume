import type { Meta, StoryObj } from '@storybook/react'
import MultiResumeCallout from '@/components/marketing/multi-resume-callout'

const meta = {
  title: 'Marketing/Multi-Resume Callout',
  component: MultiResumeCallout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof MultiResumeCallout>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
