import type { Meta, StoryObj } from '@storybook/react'
import { CloudArrowUpIcon } from '@phosphor-icons/react'
import { fn } from 'storybook/test'
import { Button } from '@/components/ui/button'

const baseArgs = {
  variant: 'default',
  size: 'default',
  disabled: false,
  onClick: fn(),
} as const

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    ...baseArgs,
    children: 'Button',
  },
  argTypes: {
    className: {
      control: false,
    },
    children: {
      control: false,
    },
    onClick: {
      control: false,
    },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Secondary: Story = {
  args: {
    ...baseArgs,
    variant: 'secondary',
    children: 'Secondary',
  },
}

export const Outline: Story = {
  args: {
    ...baseArgs,
    variant: 'outline',
    children: 'Outline',
  },
}

export const Ghost: Story = {
  args: {
    ...baseArgs,
    variant: 'ghost',
    children: 'Ghost',
  },
}

export const Destructive: Story = {
  args: {
    ...baseArgs,
    variant: 'destructive',
    children: 'Destructive',
  },
}

export const Link: Story = {
  args: {
    ...baseArgs,
    variant: 'link',
    children: 'Link',
  },
}

export const Icon: Story = {
  args: {
    ...baseArgs,
    size: 'icon',
    'aria-label': 'Publish',
  },
  render: (args) => (
    <Button {...args}>
      <CloudArrowUpIcon />
    </Button>
  ),
}

export const VariantsShowcase: Story = {
  render: () => (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="xs">XS</Button>
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" aria-label="Publish">
          <CloudArrowUpIcon />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button disabled>Disabled</Button>
      </div>
    </div>
  ),
}
