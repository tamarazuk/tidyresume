import type { Meta, StoryObj } from '@storybook/react'
import ResumeSwitcher from '@/components/layout/resume-switcher'
import {
  STORY_RESUME_CONTENT,
  STORY_RESUME_ID,
  STORY_RESUME_TITLE,
} from '@/storybook/fixtures/resume-fixtures'

const meta = {
  title: 'Layout/Resume Switcher',
  component: ResumeSwitcher,
  parameters: {
    tidyresume: {
      stores: {
        resume: {
          id: STORY_RESUME_ID,
          slug: 'maya-sandoval',
          isPublished: true,
          resumeTitle: STORY_RESUME_TITLE,
          markdown: STORY_RESUME_CONTENT,
        },
      },
    },
  },
} satisfies Meta<typeof ResumeSwitcher>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DraftOnly: Story = {
  parameters: {
    tidyresume: {
      stores: {
        resume: {
          id: null,
          slug: null,
          isPublished: false,
          resumeTitle: 'Untitled Resume',
          markdown: STORY_RESUME_CONTENT,
        },
      },
    },
  },
}
