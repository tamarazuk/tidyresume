import { eq, or } from 'drizzle-orm'
import { DrizzleD1Database } from 'drizzle-orm/d1'
import { resumes } from '@/db/schema'
import * as schema from '@/db/schema'
import type { ResumeThemeSettings } from '@/lib/resume-types'

type Db = DrizzleD1Database<typeof schema>

type ResumeRecordWithTheme = Omit<typeof resumes.$inferSelect, 'theme'> & {
  theme: ResumeThemeSettings | null
}

const parseTheme = (theme: string | null): ResumeThemeSettings | null => {
  if (!theme) return null
  try {
    const parsed = JSON.parse(theme) as ResumeThemeSettings
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

const serializeTheme = (theme?: ResumeThemeSettings | null): string | null => {
  if (!theme) return null
  try {
    return JSON.stringify(theme)
  } catch {
    return null
  }
}

export async function getResume(db: Db, idOrSlug: string) {
  // Try finding by ID or Slug
  const resume = await db.query.resumes.findFirst({
    where: or(eq(resumes.id, idOrSlug), eq(resumes.slug, idOrSlug)),
  })

  if (!resume) return resume
  return {
    ...resume,
    theme: parseTheme(resume.theme ?? null),
  } satisfies ResumeRecordWithTheme
}

export async function deleteResume(db: Db, id: string) {
  return db.delete(resumes).where(eq(resumes.id, id))
}

function isUniqueConstraintViolation(error: unknown): boolean {
  if (error instanceof Error) {
    if (
      error.message.includes('UNIQUE constraint failed') ||
      error.message.includes('constraint failed')
    ) {
      return true
    }
    // Check cause if available (D1 often wraps errors)
    if (error.cause && error.cause instanceof Error) {
      return isUniqueConstraintViolation(error.cause)
    }
  }
  return false
}

export async function publishResume(
  db: Db,
  data: {
    id?: string
    title: string
    content: string
    slug?: string | null
    theme?: ResumeThemeSettings | null
  }
) {
  const slugVal = data.slug ?? null
  const themeValue =
    data.theme !== undefined ? serializeTheme(data.theme) : undefined

  // CASE 1: Update existing resume
  if (data.id) {
    try {
      const updateValues: Partial<typeof resumes.$inferInsert> = {
        title: data.title,
        content: data.content,
        slug: slugVal,
        updatedAt: new Date(),
      }
      if (themeValue !== undefined) {
        updateValues.theme = themeValue
      }

      const results = await db
        .update(resumes)
        .set(updateValues)
        .where(eq(resumes.id, data.id))
        .returning({
          id: resumes.id,
          slug: resumes.slug,
          editSecret: resumes.editSecret,
        })

      if (results.length === 0) {
        // Client provided an ID, but it doesn't exist.
        // We do NOT create it. We consider this an invalid update attempt.
        throw new Error('Resume not found')
      }

      return results[0]
    } catch (error) {
      if (isUniqueConstraintViolation(error)) {
        throw new Error('Slug already taken')
      }
      throw error
    }
  }

  // CASE 2: Create new resume
  const resumeId = crypto.randomUUID()
  const editSecret = crypto.randomUUID()
  const insertThemeValue = serializeTheme(data.theme ?? null)

  const values: typeof resumes.$inferInsert = {
    id: resumeId,
    title: data.title,
    content: data.content,
    slug: slugVal,
    theme: insertThemeValue,
    editSecret: editSecret,
  }

  try {
    const results = await db.insert(resumes).values(values).returning({
      id: resumes.id,
      slug: resumes.slug,
      editSecret: resumes.editSecret,
    })

    return results[0]
  } catch (error) {
    if (isUniqueConstraintViolation(error)) {
      throw new Error('Slug already taken')
    }
    throw error
  }
}
