import type { Meta, StoryObj } from '@storybook/react'
import SyncScrollToggle from '@/components/editor/components/sync-scroll-toggle'

const meta = {
  title: 'Editor/Sync Scroll Toggle',
  component: SyncScrollToggle,
} satisfies Meta<typeof SyncScrollToggle>

export default meta

type Story = StoryObj<typeof meta>

export const Enabled: Story = {
  parameters: {
    tidyresume: {
      stores: {
        editorView: {
          isSyncScrollEnabled: true,
        },
      },
    },
  },
}

export const Disabled: Story = {
  parameters: {
    tidyresume: {
      stores: {
        editorView: {
          isSyncScrollEnabled: false,
        },
      },
    },
  },
}
