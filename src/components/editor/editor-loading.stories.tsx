import type { Meta, StoryObj } from '@storybook/react'
import EditorLoading from '@/components/editor/editor-loading'

const meta = {
  title: 'Editor/Editor Loading',
  component: EditorLoading,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof EditorLoading>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
