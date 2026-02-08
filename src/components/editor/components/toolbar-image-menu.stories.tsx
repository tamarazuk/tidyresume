import type { Meta, StoryObj } from '@storybook/react'
import ToolbarImageMenu from '@/components/editor/components/toolbar-image-menu'

const meta = {
  title: 'Editor/Toolbar Image Menu',
  component: ToolbarImageMenu,
} satisfies Meta<typeof ToolbarImageMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onInsert: () => undefined,
    onUpload: () => undefined,
  },
}
