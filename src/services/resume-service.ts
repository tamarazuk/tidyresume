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
  let resumeId = data.id
  let deleteSecret: string | undefined

  if (!resumeId) {
    resumeId = crypto.randomUUID()
    deleteSecret = crypto.randomUUID()
  }

  const slugVal = data.slug ?? null

  const values: typeof resumes.$inferInsert = {
    id: resumeId,
    title: data.title,
    content: data.content,
    slug: slugVal,
  }

  if (deleteSecret) {
    values.deleteSecret = deleteSecret
  }

  try {
    // Drizzle SQLite upsert
    await db
      .insert(resumes)
      .values(values)
      .onConflictDoUpdate({
        target: resumes.id,
        set: {
          title: data.title,
          content: data.content,
          slug: slugVal,
          updatedAt: new Date(),
        },
      })
  } catch (error) {
    if (isUniqueConstraintViolation(error)) {
      throw new Error('Slug already taken')
    }
    throw error
  }

  return { id: resumeId, slug: slugVal, deleteSecret }
}
