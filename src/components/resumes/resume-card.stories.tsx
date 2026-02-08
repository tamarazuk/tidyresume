import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import ResumeCard from '@/components/resumes/resume-card'
import type { ResumeDraft } from '@/stores/resume-store'
import {
  STORY_RESUME_CONTENT,
  STORY_RESUME_ID,
  STORY_RESUME_TITLE,
} from '@/storybook/fixtures/resume-fixtures'

const now = Date.now()

const createDraft = (
  overrides: Partial<ResumeDraft> = {}
): ResumeDraft => {
  return {
    draftId: overrides.draftId ?? 'storybook-draft',
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
  title: 'Resumes/Resume Card',
  component: ResumeCard,
  args: {
    draft: createDraft(),
    onOpen: fn(),
    onDuplicate: fn(),
    onDelete: fn(),
  },
} satisfies Meta<typeof ResumeCard>

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
