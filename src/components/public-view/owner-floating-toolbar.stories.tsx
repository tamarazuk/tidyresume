import type { Meta, StoryObj } from '@storybook/react'
import {
  OwnerFloatingToolbar,
  OwnerViewInfo,
  PreviewToggle,
} from '@/components/public-view/owner-floating-toolbar'
import { STORY_RESUME_ID } from '@/storybook/fixtures/resume-fixtures'

const meta = {
  title: 'Public View/Owner Floating Toolbar',
  component: OwnerFloatingToolbar,
  args: {
    id: STORY_RESUME_ID,
    isFullWidth: false,
    onToggleWidth: () => undefined,
  },
} satisfies Meta<typeof OwnerFloatingToolbar>

export default meta

type Story = StoryObj<typeof meta>

export const Owner: Story = {
  parameters: {
    layout: 'fullscreen',
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

export const PreviewMode: Story = {
  parameters: {
    layout: 'fullscreen',
    tidyresume: {
      stores: {
        resume: {
          id: STORY_RESUME_ID,
          isPublished: true,
        },
        publicView: {
          isPreviewMode: true,
        },
      },
    },
  },
}

export const Subcomponents: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <PreviewToggle />
      <OwnerViewInfo />
    </div>
  ),
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
