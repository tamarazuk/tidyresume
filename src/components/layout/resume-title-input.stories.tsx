import type { Meta, StoryObj } from '@storybook/react'
import ResumeTitleInput from '@/components/layout/resume-title-input'
import { STORY_RESUME_TITLE } from '@/storybook/fixtures/resume-fixtures'

const meta = {
  title: 'Layout/Resume Title Input',
  component: ResumeTitleInput,
  parameters: {
    tidyresume: {
      stores: {
        resume: {
          resumeTitle: STORY_RESUME_TITLE,
        },
      },
    },
  },
} satisfies Meta<typeof ResumeTitleInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
