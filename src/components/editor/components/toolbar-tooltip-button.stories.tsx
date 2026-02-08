import type { Meta, StoryObj } from '@storybook/react'
import { ArrowsDownUpIcon } from '@phosphor-icons/react'
import { fn } from 'storybook/test'
import ToolbarTooltipButton from '@/components/editor/components/toolbar-tooltip-button'

const meta = {
  title: 'Editor/Toolbar Tooltip Button',
  component: ToolbarTooltipButton,
} satisfies Meta<typeof ToolbarTooltipButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Toggle sync scroll',
    tooltip: 'Turn Sync Scroll On',
    icon: <ArrowsDownUpIcon size={14} className="shrink-0" />,
    onClick: fn(),
  },
}
