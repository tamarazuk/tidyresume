import type { Meta, StoryObj } from '@storybook/react'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

const meta = {
  title: 'UI/Field',
  component: Field,
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <FieldGroup className="max-w-lg">
      <Field>
        <FieldLabel htmlFor="story-title">Resume title</FieldLabel>
        <FieldContent>
          <Input id="story-title" defaultValue="Maya Sandoval Resume" />
          <FieldDescription>
            This appears in your editor and public resume header.
          </FieldDescription>
        </FieldContent>
      </Field>
      <Field>
        <FieldTitle>Slug</FieldTitle>
        <FieldContent>
          <FieldError errors={[{ message: 'Slug already taken' }]} />
        </FieldContent>
      </Field>
    </FieldGroup>
  ),
}
