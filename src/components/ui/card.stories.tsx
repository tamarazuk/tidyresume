import type { Meta, StoryObj } from '@storybook/react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const meta = {
  title: 'UI/Card',
  component: Card,
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Senior Software Engineer</CardTitle>
        <CardDescription>Stripe, 2022 - Present</CardDescription>
        <CardAction>
          <Button size="sm" variant="outline">
            Edit
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        Built resilient publishing workflows and improved release confidence.
      </CardContent>
      <CardFooter className="justify-end">
        <Button size="sm">View details</Button>
      </CardFooter>
    </Card>
  ),
}
