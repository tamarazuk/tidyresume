import type { Meta, StoryObj } from '@storybook/react'
import { MagicLinkDialog } from '@/components/public-view/magic-link-dialog'
import { STORY_RESUME_ID } from '@/storybook/fixtures/resume-fixtures'

const meta = {
  title: 'Public View/Magic Link Dialog',
  component: MagicLinkDialog,
  args: {
    resumeId: STORY_RESUME_ID,
  },
} satisfies Meta<typeof MagicLinkDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
