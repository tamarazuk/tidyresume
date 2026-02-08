import type { Meta, StoryObj } from '@storybook/react'
import ButtonLink from '@/components/ui/button-link'

const meta = {
  title: 'UI/Button Link',
  component: ButtonLink,
  args: {
    href: '/edit',
    children: 'Open editor',
  },
} satisfies Meta<typeof ButtonLink>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const External: Story = {
  args: {
    href: 'https://github.com/tamarazuk/tidyresume',
    target: '_blank',
    children: 'Open GitHub',
  },
}
