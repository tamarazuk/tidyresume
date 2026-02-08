import type { Meta, StoryObj } from '@storybook/react'
import { Kbd, KbdGroup } from '@/components/ui/kbd'

const meta = {
  title: 'UI/Kbd',
  component: Kbd,
} satisfies Meta<typeof Kbd>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <KbdGroup>
      <Kbd>Cmd</Kbd>
      <span>+</span>
      <Kbd>P</Kbd>
    </KbdGroup>
  ),
}
