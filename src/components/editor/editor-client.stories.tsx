import type { Meta, StoryObj } from '@storybook/react'
import EditorClient from '@/components/editor/editor-client'
import {
  STORY_RESUME_CONTENT,
  STORY_RESUME_ID,
  STORY_RESUME_TITLE,
} from '@/storybook/fixtures/resume-fixtures'

const meta = {
  title: 'Editor/Editor Client',
  component: EditorClient,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Covers suspense + token handler + dynamically loaded editor. In Storybook it renders without token side effects.',
      },
    },
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
} satisfies Meta<typeof EditorClient>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
