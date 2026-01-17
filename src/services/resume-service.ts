import { eq, or } from 'drizzle-orm'
import { DrizzleD1Database } from 'drizzle-orm/d1'
import { resumes } from '@/db/schema'
import * as schema from '@/db/schema'

type Db = DrizzleD1Database<typeof schema>

export async function getResume(db: Db, idOrSlug: string) {
  // Try finding by ID or Slug
  const resume = await db.query.resumes.findFirst({
    where: or(eq(resumes.id, idOrSlug), eq(resumes.slug, idOrSlug)),
  })

  return resume
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
  }
) {
  const slugVal = data.slug ?? null

  // CASE 1: Update existing resume
  if (data.id) {
    const results = await db
      .update(resumes)
      .set({
        title: data.title,
        content: data.content,
        slug: slugVal,
        updatedAt: new Date(),
      })
      .where(eq(resumes.id, data.id))
      .returning({
        id: resumes.id,
        slug: resumes.slug,
        deleteSecret: resumes.deleteSecret,
      })

    if (results.length === 0) {
      // Client provided an ID, but it doesn't exist.
      // We do NOT create it. We consider this an invalid update attempt.
      throw new Error('Resume not found')
    }

    return results[0]
  }

  // CASE 2: Create new resume
  const resumeId = crypto.randomUUID()
  const deleteSecret = crypto.randomUUID()

  const values: typeof resumes.$inferInsert = {
    id: resumeId,
    title: data.title,
    content: data.content,
    slug: slugVal,
    deleteSecret: deleteSecret,
  }

  try {
    const results = await db
      .insert(resumes)
      .values(values)
      .returning({
        id: resumes.id,
        slug: resumes.slug,
        deleteSecret: resumes.deleteSecret,
      })

    return results[0]
  } catch (error) {
    if (isUniqueConstraintViolation(error)) {
      throw new Error('Slug already taken')
    }
    throw error
  }
}
