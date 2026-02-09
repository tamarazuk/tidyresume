import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { LabelBadge } from '@/components/labels/label-badge'
import {
  STORY_LABEL_WORK,
  STORY_LABEL_PERSONAL,
  STORY_LABEL_DRAFT,
  STORY_LABEL_URGENT,
} from '@/storybook/fixtures/resume-fixtures'

const meta = {
  title: 'Labels/Label Badge',
  component: LabelBadge,
  args: {
    name: STORY_LABEL_WORK.name,
    color: STORY_LABEL_WORK.color,
  },
} satisfies Meta<typeof LabelBadge>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Selected: Story = {
  args: {
    selected: true,
  },
}

export const Clickable: Story = {
  args: {
    onClick: fn(),
  },
}

export const AllColors: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <LabelBadge name={STORY_LABEL_WORK.name} color={STORY_LABEL_WORK.color} />
      <LabelBadge
        name={STORY_LABEL_PERSONAL.name}
        color={STORY_LABEL_PERSONAL.color}
      />
      <LabelBadge
        name={STORY_LABEL_DRAFT.name}
        color={STORY_LABEL_DRAFT.color}
      />
      <LabelBadge
        name={STORY_LABEL_URGENT.name}
        color={STORY_LABEL_URGENT.color}
      />
    </div>
  ),
}
