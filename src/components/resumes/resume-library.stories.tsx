import type { Meta, StoryObj } from '@storybook/react'
import ResumeLibrary from '@/components/resumes/resume-library'
import {
  STORY_RESUME_CONTENT,
  STORY_RESUME_ID,
  STORY_RESUME_TITLE,
} from '@/storybook/fixtures/resume-fixtures'

const meta = {
  title: 'Resumes/Resume Library',
  component: ResumeLibrary,
  parameters: {
    layout: 'fullscreen',
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
} satisfies Meta<typeof ResumeLibrary>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DraftState: Story = {
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
