import type { Meta, StoryObj } from '@storybook/react'
import { ResumeViewer } from '@/components/public-view/resume-viewer'
import {
  STORY_RESUME_CONTENT,
  STORY_RESUME_ID,
  STORY_RESUME_THEME,
  STORY_RESUME_TITLE,
} from '@/storybook/fixtures/resume-fixtures'

const meta = {
  title: 'Public View/Resume Viewer',
  component: ResumeViewer,
  args: {
    id: STORY_RESUME_ID,
    title: STORY_RESUME_TITLE,
    content: STORY_RESUME_CONTENT,
    isFullWidth: false,
    theme: STORY_RESUME_THEME,
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ResumeViewer>

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
          id: 'local-viewer-id',
          isPublished: false,
        },
      },
    },
  },
}

export const FullWidth: Story = {
  args: {
    isFullWidth: true,
  },
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
