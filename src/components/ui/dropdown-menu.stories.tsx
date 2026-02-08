import type { Meta, StoryObj } from '@storybook/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const meta = {
  title: 'UI/Dropdown Menu',
  component: DropdownMenu,
} satisfies Meta<typeof DropdownMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <DropdownMenu open>
      <DropdownMenuTrigger render={<Button>Open Menu</Button>} />
      <DropdownMenuContent>
        <DropdownMenuItem>Print</DropdownMenuItem>
        <DropdownMenuItem>Download PDF</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Unpublish</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
