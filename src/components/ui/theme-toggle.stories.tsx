import type { Meta, StoryObj } from '@storybook/react'
import ThemeToggle from '@/components/ui/theme-toggle'

const meta = {
  title: 'UI/Theme Toggle',
  component: ThemeToggle,
  args: {
    showLabel: true,
    lightLabel: 'Light mode',
    darkLabel: 'Dark mode',
  },
} satisfies Meta<typeof ThemeToggle>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
