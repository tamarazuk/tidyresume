import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { LabelForm } from '@/components/labels/label-form'
import { STORY_LABEL_WORK } from '@/storybook/fixtures/resume-fixtures'

const meta = {
  title: 'Labels/Label Form',
  component: LabelForm,
  args: {
    onSave: fn(),
    onCancel: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LabelForm>

export default meta

type Story = StoryObj<typeof meta>

export const CreateNew: Story = {}

export const EditExisting: Story = {
  args: {
    initialName: STORY_LABEL_WORK.name,
    initialColor: STORY_LABEL_WORK.color,
  },
}
