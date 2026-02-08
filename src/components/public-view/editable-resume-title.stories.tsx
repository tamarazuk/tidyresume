import type { Meta, StoryObj } from '@storybook/react'
import { EditableResumeTitle } from '@/components/public-view/editable-resume-title'
import {
  STORY_RESUME_CONTENT,
  STORY_RESUME_ID,
  STORY_RESUME_TITLE,
} from '@/storybook/fixtures/resume-fixtures'

const meta = {
  title: 'Public View/Editable Resume Title',
  component: EditableResumeTitle,
  args: {
    id: STORY_RESUME_ID,
    title: STORY_RESUME_TITLE,
    content: STORY_RESUME_CONTENT,
  },
} satisfies Meta<typeof EditableResumeTitle>

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
          id: 'different-id',
          isPublished: true,
        },
      },
    },
  },
}
