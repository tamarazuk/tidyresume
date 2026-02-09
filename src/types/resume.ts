export type ResumeId = string
export type ResumeSlug = string | null

export type ResumeLabelId = string

export interface ResumeLabel {
  id: ResumeLabelId
  name: string
  color: string
  createdAt: number
  updatedAt: number
}

export type ResumeAccent =
  | 'indigo'
  | 'blue'
  | 'teal'
  | 'slate'
  | 'emerald'
  | 'rose'

export type ResumeFont =
  | 'geologica'
  | 'noto-sans'
  | 'source-serif-4'
  | 'ibm-plex-sans'
  | 'ibm-plex-serif'

export type ResumeHeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ResumeBodySize = '10' | '11' | '12' | '13' | '14' | '15' | '16'

export const RESUME_BODY_LINE_HEIGHT_VALUES = [
  '1.2',
  '1.3',
  '1.4',
  '1.5',
  '1.6',
  '1.8',
] as const
export type ResumeBodyLineHeight =
  (typeof RESUME_BODY_LINE_HEIGHT_VALUES)[number]

export const RESUME_BODY_LETTER_SPACING_VALUES = [
  '-0.025em',
  '0',
  '0.025em',
  '0.05em',
] as const
export type ResumeBodyLetterSpacing =
  (typeof RESUME_BODY_LETTER_SPACING_VALUES)[number]

export interface ResumeMargins {
  top: number
  right: number
  bottom: number
  left: number
}

export interface ResumeThemeSettings {
  accent?: ResumeAccent
  typography?: {
    heading?: ResumeFont
    body?: ResumeFont
    headingSize?: ResumeHeadingSize
    bodySize?: ResumeBodySize
    bodyLineHeight?: ResumeBodyLineHeight
    bodyLetterSpacing?: ResumeBodyLetterSpacing
  }
  margins?: ResumeMargins
  fontScale?: string
}

export interface ResumeRecord {
  id: ResumeId
  title: string
  content: string
  slug: ResumeSlug
  createdAt: string
  updatedAt: string
  theme?: ResumeThemeSettings | null
}
