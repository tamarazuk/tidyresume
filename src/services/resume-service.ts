import { eq, or } from 'drizzle-orm'
import { DrizzleD1Database } from 'drizzle-orm/d1'
import { resumes } from '@/db/schema'
import * as schema from '@/db/schema'
import { safeJsonParse, safeJsonStringify } from '@/lib/json-utils'
import type { ResumeLabel, ResumeThemeSettings } from '@/types/resume'

type Db = DrizzleD1Database<typeof schema>

type ResumeRecordWithExtras = Omit<
  typeof resumes.$inferSelect,
  'theme' | 'labels'
> & {
  theme: ResumeThemeSettings | null
  labels: ResumeLabel[] | null
}

const isThemeValue = (value: unknown): value is ResumeThemeSettings => {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

const parseTheme = (theme: string | null): ResumeThemeSettings | null => {
  return safeJsonParse(theme, isThemeValue)
}

const serializeTheme = (theme?: ResumeThemeSettings | null): string | null => {
  return safeJsonStringify(theme)
}

const isLabelsValue = (value: unknown): value is ResumeLabel[] => {
  return Array.isArray(value)
}

const parseLabels = (labels: string | null): ResumeLabel[] | null => {
  return safeJsonParse(labels, isLabelsValue)
}

const serializeLabels = (labels?: ResumeLabel[] | null): string | null => {
  return safeJsonStringify(labels)
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
    labels: parseLabels(resume.labels ?? null),
  } satisfies ResumeRecordWithExtras
}

export async function deleteResume(db: Db, id: string) {
  return db.delete(resumes).where(eq(resumes.id, id))
}

export async function updateResumeSlug(
  db: Db,
  data: {
    id: string
    slug?: string | null
  }
) {
  const slugVal = data.slug ?? null

  try {
    const results = await db
      .update(resumes)
      .set({
        slug: slugVal,
        updatedAt: new Date(),
      })
      .where(eq(resumes.id, data.id))
      .returning({
        id: resumes.id,
        slug: resumes.slug,
      })

    if (results.length === 0) {
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

export async function updateResumeTheme(
  db: Db,
  data: {
    id: string
    theme?: ResumeThemeSettings | null
  }
) {
  const themeValue = serializeTheme(data.theme ?? null)

  const results = await db
    .update(resumes)
    .set({
      theme: themeValue,
      updatedAt: new Date(),
    })
    .where(eq(resumes.id, data.id))
    .returning({
      id: resumes.id,
      theme: resumes.theme,
    })

  if (results.length === 0) {
    throw new Error('Resume not found')
  }

  return {
    id: results[0].id,
    theme: parseTheme(results[0].theme ?? null),
  }
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
    labels?: ResumeLabel[] | null
  }
) {
  const slugVal = data.slug ?? null
  const themeValue =
    data.theme !== undefined ? serializeTheme(data.theme) : undefined
  const labelsValue =
    data.labels !== undefined ? serializeLabels(data.labels) : undefined

  const createResumeRecord = async () => {
    const resumeId = crypto.randomUUID()
    const editSecret = crypto.randomUUID()
    const insertThemeValue = serializeTheme(data.theme ?? null)
    const insertLabelsValue = serializeLabels(data.labels ?? null)

    const values: typeof resumes.$inferInsert = {
      id: resumeId,
      title: data.title,
      content: data.content,
      slug: slugVal,
      theme: insertThemeValue,
      labels: insertLabelsValue,
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
      if (labelsValue !== undefined) {
        updateValues.labels = labelsValue
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

      if (results.length > 0) {
        return {
          ...results[0],
          created: false,
        }
      }

      // Stale client ID: create a new remote record and let the client rotate.
      const createdResume = await createResumeRecord()
      return {
        ...createdResume,
        created: true,
      }
    } catch (error) {
      if (isUniqueConstraintViolation(error)) {
        throw new Error('Slug already taken')
      }
      throw error
    }
  }

  // CASE 2: Create new resume
  const createdResume = await createResumeRecord()
  return {
    ...createdResume,
    created: true,
  }
}
