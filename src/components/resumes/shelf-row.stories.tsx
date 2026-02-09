import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import ShelfRow from '@/components/resumes/shelf-row'
import type { ResumeDraft } from '@/stores/resume-store'
import {
  STORY_RESUME_CONTENT,
  STORY_RESUME_ID,
  STORY_RESUME_TITLE,
  STORY_LABELS_BY_ID,
  STORY_LABEL_ORDER,
  STORY_LABEL_WORK,
  STORY_LABEL_PERSONAL,
} from '@/storybook/fixtures/resume-fixtures'

const now = Date.now()

const createDraft = (overrides: Partial<ResumeDraft> = {}): ResumeDraft => {
  return {
    draftId: overrides.draftId ?? 'storybook-draft',
    labelIds: overrides.labelIds ?? [],
    id: overrides.id ?? STORY_RESUME_ID,
    slug: overrides.slug ?? 'maya-sandoval',
    editSecret: overrides.editSecret ?? 'storybook-secret',
    resumeTitle: overrides.resumeTitle ?? STORY_RESUME_TITLE,
    markdown: overrides.markdown ?? STORY_RESUME_CONTENT,
    saveStatus: overrides.saveStatus ?? 'saved',
    syncStatus: overrides.syncStatus ?? 'synced',
    isPublished: overrides.isPublished ?? true,
    imageWarning: overrides.imageWarning ?? null,
    contentWarning: overrides.contentWarning ?? null,
    resumeDisplay: overrides.resumeDisplay ?? {
      themeMode: 'auto',
      theme: {},
    },
    createdAt: overrides.createdAt ?? now,
    updatedAt: overrides.updatedAt ?? now,
  }
}

const meta = {
  title: 'Resumes/Shelf Row',
  component: ShelfRow,
  args: {
    draft: createDraft(),
    onOpen: fn(),
    onDuplicate: fn(),
    onDelete: fn(),
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ShelfRow>

export default meta

type Story = StoryObj<typeof meta>

export const Published: Story = {}

export const DraftOnly: Story = {
  args: {
    draft: createDraft({
      id: null,
      slug: null,
      editSecret: null,
      isPublished: false,
      syncStatus: 'unsaved',
      resumeTitle: 'Frontend Engineer Draft',
    }),
  },
}

export const WithLabels: Story = {
  args: {
    draft: createDraft({
      labelIds: [STORY_LABEL_WORK.id, STORY_LABEL_PERSONAL.id],
    }),
  },
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

export const Untitled: Story = {
  args: {
    draft: createDraft({
      resumeTitle: '',
      id: null,
      slug: null,
      isPublished: false,
    }),
  },
}
