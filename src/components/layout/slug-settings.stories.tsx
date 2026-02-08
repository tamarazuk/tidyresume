import type { Meta, StoryObj } from '@storybook/react'
import { SlugSettings } from '@/components/layout/slug-settings'
import {
  STORY_RESUME_ID,
  STORY_RESUME_TITLE,
} from '@/storybook/fixtures/resume-fixtures'

const meta = {
  title: 'Layout/Slug Settings',
  component: SlugSettings,
  args: {
    label: 'Edit link',
    labelClassName: 'inline',
  },
  parameters: {
    tidyresume: {
      stores: {
        resume: {
          id: STORY_RESUME_ID,
          slug: 'maya-resume',
          isPublished: true,
          resumeTitle: STORY_RESUME_TITLE,
        },
      },
    },
  },
} satisfies Meta<typeof SlugSettings>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
