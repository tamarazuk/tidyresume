import { DEFAULT_RESUME } from '@/components/editor/constants'
import { DEFAULT_RESUME_THEME } from '@/lib/resume-theme'
import type { ResumeThemeSettings } from '@/types/resume'

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
