import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { LabelAssigner } from '@/components/labels/label-assigner'
import { Button } from '@/components/ui/button'
import {
  STORY_LABELS_BY_ID,
  STORY_LABEL_ORDER,
  STORY_LABEL_WORK,
  STORY_LABEL_PERSONAL,
} from '@/storybook/fixtures/resume-fixtures'

const meta = {
  title: 'Labels/Label Assigner',
  component: LabelAssigner,
  args: {
    draftId: 'storybook-draft',
    children: <Button variant="outline">Assign Labels</Button>,
    onManageLabels: fn(),
  },
} satisfies Meta<typeof LabelAssigner>

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

export const WithAssignedLabels: Story = {
  parameters: {
    tidyresume: {
      stores: {
        resume: {
          labelIds: [STORY_LABEL_WORK.id, STORY_LABEL_PERSONAL.id],
          labelsById: STORY_LABELS_BY_ID,
          labelOrder: STORY_LABEL_ORDER,
        },
      },
    },
  },
}
