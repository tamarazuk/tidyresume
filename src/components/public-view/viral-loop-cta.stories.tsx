import type { Meta, StoryObj } from '@storybook/react'
import { ViralLoopCTA } from '@/components/public-view/viral-loop-cta'
import { STORY_RESUME_ID } from '@/storybook/fixtures/resume-fixtures'

const meta = {
  title: 'Public View/Viral Loop CTA',
  component: ViralLoopCTA,
  args: {
    resumeId: STORY_RESUME_ID,
  },
} satisfies Meta<typeof ViralLoopCTA>

export default meta

type Story = StoryObj<typeof meta>

export const Visitor: Story = {
  parameters: {
    tidyresume: {
      stores: {
        resume: {
          id: 'visitor-id',
          isPublished: false,
        },
      },
    },
  },
}

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
