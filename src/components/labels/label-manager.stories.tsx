import type { Meta, StoryObj } from '@storybook/react'
import { LabelManager } from '@/components/labels/label-manager'
import { Button } from '@/components/ui/button'
import {
  STORY_LABELS_BY_ID,
  STORY_LABEL_ORDER,
} from '@/storybook/fixtures/resume-fixtures'

const meta = {
  title: 'Labels/Label Manager',
  component: LabelManager,
  args: {
    children: <Button variant="outline">Manage Labels</Button>,
  },
} satisfies Meta<typeof LabelManager>

export default meta

type Story = StoryObj<typeof meta>

export const Empty: Story = {
  parameters: {
    tidyresume: {
      stores: {
        resume: {},
      },
    },
  },
}

export const WithLabels: Story = {
  parameters: {
    tidyresume: {
      stores: {
        resume: {
          labelsById: STORY_LABELS_BY_ID,
          labelOrder: STORY_LABEL_ORDER,
        },
      },
    },
  },
}
