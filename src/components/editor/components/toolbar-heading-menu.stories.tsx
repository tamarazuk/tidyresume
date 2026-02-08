import type { Meta, StoryObj } from '@storybook/react'
import ToolbarHeadingMenu from '@/components/editor/components/toolbar-heading-menu'

const meta = {
  title: 'Editor/Toolbar Heading Menu',
  component: ToolbarHeadingMenu,
} satisfies Meta<typeof ToolbarHeadingMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onSelect: () => undefined,
  },
}
