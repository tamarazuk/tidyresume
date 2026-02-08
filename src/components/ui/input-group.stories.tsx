import type { Meta, StoryObj } from '@storybook/react'
import { LinkSimpleIcon } from '@phosphor-icons/react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'

const meta = {
  title: 'UI/Input Group',
  component: InputGroup,
} satisfies Meta<typeof InputGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <InputGroup className="max-w-md">
      <InputGroupAddon>
        <InputGroupText>
          <LinkSimpleIcon />
          /r/
        </InputGroupText>
      </InputGroupAddon>
      <InputGroupInput defaultValue="maya-sandoval" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="xs">Copy</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
}
