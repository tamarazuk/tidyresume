import type { Meta, StoryObj } from '@storybook/react'
import { AppearanceSettingsContent } from '@/components/appearance-settings/appearance-settings-content'
import {
  STORY_RESUME_ID,
  STORY_RESUME_TITLE,
} from '@/storybook/fixtures/resume-fixtures'

const meta = {
  title: 'Appearance/Appearance Settings Content',
  component: AppearanceSettingsContent,
  parameters: {
    tidyresume: {
      stores: {
        resume: {
          id: STORY_RESUME_ID,
          isPublished: true,
          resumeTitle: STORY_RESUME_TITLE,
        },
      },
    },
  },
} satisfies Meta<typeof AppearanceSettingsContent>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
