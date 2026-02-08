import type { Meta, StoryObj } from '@storybook/react'
import { UnpublishButton } from '@/components/public-view/unpublish-button'
import { STORY_RESUME_ID } from '@/storybook/fixtures/resume-fixtures'

const meta = {
  title: 'Public View/Unpublish Button',
  component: UnpublishButton,
  args: {
    id: STORY_RESUME_ID,
    showLabel: true,
    labelClassName: 'inline',
  },
} satisfies Meta<typeof UnpublishButton>

export default meta

type Story = StoryObj<typeof meta>

export const Owner: Story = {
  parameters: {
    tidyresume: {
      stores: {
        resume: {
          id: STORY_RESUME_ID,
          isPublished: true,
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
