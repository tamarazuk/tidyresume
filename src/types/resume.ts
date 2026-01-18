export type ResumeId = string
export type ResumeSlug = string | null

export type ResumeAccent = 'indigo' | 'blue' | 'teal' | 'slate' | 'emerald' | 'rose'

export type ResumeFont =
  | 'geologica'
  | 'noto-sans'
  | 'source-serif-4'
  | 'ibm-plex-sans'
  | 'ibm-plex-serif'

export type ResumeHeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ResumeBodySize = '10' | '11' | '12' | '13' | '14' | '15' | '16'

export interface ResumeThemeSettings {
  accent?: ResumeAccent
  typography?: {
    heading?: ResumeFont
    body?: ResumeFont
    headingSize?: ResumeHeadingSize
    bodySize?: ResumeBodySize
  }
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
