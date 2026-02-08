import type { ResumeThemeSettings } from '@/types/resume'
import type { ResumeSyncStatus, SaveStatus } from '@/stores/resume-store'

export interface StorybookResumeSeed {
  id?: string | null
  slug?: string | null
  editSecret?: string | null
  resumeTitle?: string
  markdown?: string
  saveStatus?: SaveStatus
  syncStatus?: ResumeSyncStatus
  isPublished?: boolean
  imageWarning?: string | null
  contentWarning?: string | null
  resumeDisplay?: {
    themeMode?: 'auto' | 'light' | 'dark'
    theme?: ResumeThemeSettings
  }
}

export interface StorybookEditorViewSeed {
  editorViewState?: {
    preview?: boolean
    previewOnly?: boolean
    htmlPreview?: boolean
  }
  isSyncScrollEnabled?: boolean
}

export interface StorybookPublicViewSeed {
  isPreviewMode?: boolean
}

export interface StorybookStoreSeed {
  resume?: StorybookResumeSeed
  editorView?: StorybookEditorViewSeed
  publicView?: StorybookPublicViewSeed
}

export interface StorybookParameters {
  tidyresume?: {
    stores?: StorybookStoreSeed
  }
}
