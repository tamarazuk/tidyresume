import type { Meta, StoryObj } from '@storybook/react'
import { StartButton } from '@/components/marketing/start-button'

const meta = {
  title: 'Marketing/Start Button',
  component: StartButton,
} satisfies Meta<typeof StartButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ContinueEditing: Story = {
  parameters: {
    tidyresume: {
      stores: {
        resume: {
          id: 'draft-id',
          resumeTitle: 'Existing Draft',
          markdown: '# Existing Draft',
        },
      },
    },
  },
}
