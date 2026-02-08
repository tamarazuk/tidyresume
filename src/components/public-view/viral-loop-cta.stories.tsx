import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('link', { name: /tidy up your resume/i })
    ).not.toBeInTheDocument()
  },
}
