import type { Meta, StoryObj } from '@storybook/react'
import Editor from '@/components/editor/editor'
import {
  STORY_RESUME_CONTENT,
  STORY_RESUME_ID,
  STORY_RESUME_TITLE,
} from '@/storybook/fixtures/resume-fixtures'

const meta = {
  title: 'Editor/Editor',
  component: Editor,
  parameters: {
    layout: 'fullscreen',
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
} satisfies Meta<typeof Editor>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
