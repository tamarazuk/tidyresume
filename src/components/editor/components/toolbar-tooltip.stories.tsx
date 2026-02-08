import type { Meta, StoryObj } from '@storybook/react'
import ToolbarTooltip from '@/components/editor/components/toolbar-tooltip'
import { Button } from '@/components/ui/button'

const meta = {
  title: 'Editor/Toolbar Tooltip',
  component: ToolbarTooltip,
} satisfies Meta<typeof ToolbarTooltip>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Publish',
    children: <Button size="sm">Publish</Button>,
  },
}
