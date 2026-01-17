export type ResumeId = string
export type ResumeSlug = string | null

export interface ResumeRecord {
  id: ResumeId
  title: string
  content: string
  slug: ResumeSlug
  createdAt: string
  updatedAt: string
}
