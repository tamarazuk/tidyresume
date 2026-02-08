import type { Meta, StoryObj } from '@storybook/react'
import { PublicResumeView } from '@/components/public-view/public-resume-view'
import {
  STORY_RESUME_CONTENT,
  STORY_RESUME_ID,
  STORY_RESUME_THEME,
  STORY_RESUME_TITLE,
} from '@/storybook/fixtures/resume-fixtures'

const meta = {
  title: 'Public View/Public Resume View',
  component: PublicResumeView,
  args: {
    id: STORY_RESUME_ID,
    title: STORY_RESUME_TITLE,
    content: STORY_RESUME_CONTENT,
    theme: STORY_RESUME_THEME,
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PublicResumeView>

export default meta

type Story = StoryObj<typeof meta>

export const Owner: Story = {
  parameters: {
    tidyresume: {
      stores: {
        resume: {
          id: STORY_RESUME_ID,
          isPublished: true,
          resumeTitle: STORY_RESUME_TITLE,
          markdown: STORY_RESUME_CONTENT,
          resumeDisplay: {
            theme: STORY_RESUME_THEME,
          },
        },
      },
    },
  },
}

export const Visitor: Story = {
  parameters: {
    tidyresume: {
      stores: {
        resume: {
          id: 'visitor-local-id',
          isPublished: false,
        },
      },
    },
  },
}
