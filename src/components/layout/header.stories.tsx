import type { Meta, StoryObj } from '@storybook/react'
import Header from '@/components/layout/header'
import {
  STORY_RESUME_CONTENT,
  STORY_RESUME_ID,
  STORY_RESUME_TITLE,
} from '@/storybook/fixtures/resume-fixtures'

const meta = {
  title: 'Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Header>

export default meta

type Story = StoryObj<typeof meta>

export const Draft: Story = {
  parameters: {
    tidyresume: {
      stores: {
        resume: {
          id: null,
          isPublished: false,
          resumeTitle: STORY_RESUME_TITLE,
          markdown: STORY_RESUME_CONTENT,
        },
      },
    },
  },
}

export const Published: Story = {
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
