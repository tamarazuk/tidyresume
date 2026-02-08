import type { Meta, StoryObj } from '@storybook/react'
import AppearanceSettings, {
  AppearanceSettingsSheet,
} from '@/components/appearance-settings'
import {
  STORY_RESUME_ID,
  STORY_RESUME_TITLE,
} from '@/storybook/fixtures/resume-fixtures'

const meta = {
  title: 'Appearance/Appearance Settings',
  component: AppearanceSettings,
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
} satisfies Meta<typeof AppearanceSettings>

export default meta

type Story = StoryObj<typeof meta>

export const PopoverTrigger: Story = {}

export const SheetOpen: Story = {
  render: () => <AppearanceSettingsSheet open onOpenChange={() => undefined} />,
}
