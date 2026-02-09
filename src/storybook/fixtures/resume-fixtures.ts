import { DEFAULT_RESUME } from '@/components/editor/constants'
import { DEFAULT_RESUME_THEME } from '@/lib/resume-theme'
import type {
  ResumeLabel,
  ResumeLabelId,
  ResumeThemeSettings,
} from '@/types/resume'

export const STORY_RESUME_ID = 'storybook-resume-id'

export const STORY_RESUME_TITLE = 'Maya Sandoval Resume'

export const STORY_RESUME_CONTENT = DEFAULT_RESUME

export const STORY_VISITOR_RESUME_TITLE = 'Jordan Lee Resume'

export const STORY_RESUME_THEME: ResumeThemeSettings = {
  ...DEFAULT_RESUME_THEME,
  typography: DEFAULT_RESUME_THEME.typography
    ? { ...DEFAULT_RESUME_THEME.typography }
    : undefined,
  margins: DEFAULT_RESUME_THEME.margins
    ? { ...DEFAULT_RESUME_THEME.margins }
    : undefined,
}

// Label fixtures for storybook
const now = Date.now()

export const STORY_LABEL_WORK: ResumeLabel = {
  id: 'label-work' as ResumeLabelId,
  name: 'Work',
  color: '#3b82f6', // blue
  createdAt: now,
  updatedAt: now,
}

export const STORY_LABEL_PERSONAL: ResumeLabel = {
  id: 'label-personal' as ResumeLabelId,
  name: 'Personal',
  color: '#22c55e', // green
  createdAt: now,
  updatedAt: now,
}

export const STORY_LABEL_DRAFT: ResumeLabel = {
  id: 'label-draft' as ResumeLabelId,
  name: 'Draft',
  color: '#f59e0b', // amber
  createdAt: now,
  updatedAt: now,
}

export const STORY_LABEL_URGENT: ResumeLabel = {
  id: 'label-urgent' as ResumeLabelId,
  name: 'Urgent',
  color: '#ef4444', // red
  createdAt: now,
  updatedAt: now,
}

export const STORY_LABELS_BY_ID: Record<ResumeLabelId, ResumeLabel> = {
  [STORY_LABEL_WORK.id]: STORY_LABEL_WORK,
  [STORY_LABEL_PERSONAL.id]: STORY_LABEL_PERSONAL,
  [STORY_LABEL_DRAFT.id]: STORY_LABEL_DRAFT,
  [STORY_LABEL_URGENT.id]: STORY_LABEL_URGENT,
}

export const STORY_LABEL_ORDER: ResumeLabelId[] = [
  STORY_LABEL_WORK.id,
  STORY_LABEL_PERSONAL.id,
  STORY_LABEL_DRAFT.id,
  STORY_LABEL_URGENT.id,
]
