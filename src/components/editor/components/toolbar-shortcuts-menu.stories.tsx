import type { Meta, StoryObj } from '@storybook/react'
import EditorShortcutsMenu from '@/components/editor/components/toolbar-shortcuts-menu'

const meta = {
  title: 'Editor/Toolbar Shortcuts Menu',
  component: EditorShortcutsMenu,
} satisfies Meta<typeof EditorShortcutsMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
