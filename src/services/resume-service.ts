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

  if (!resumeId) {
    resumeId = crypto.randomUUID()
  }

  // Check slug uniqueness if provided
  if (data.slug) {
    const existing = await db.query.resumes.findFirst({
      where: eq(resumes.slug, data.slug),
    })

    // If slug exists and belongs to a DIFFERENT resume, throw error
    if (existing && existing.id !== resumeId) {
      throw new Error('Slug already taken')
    }
  }

  const slugVal = data.slug ?? null

  // Drizzle SQLite upsert
  await db
    .insert(resumes)
    .values({
      id: resumeId,
      title: data.title,
      content: data.content,
      slug: slugVal,
    })
    .onConflictDoUpdate({
      target: resumes.id,
      set: {
        title: data.title,
        content: data.content,
        slug: slugVal,
        updatedAt: new Date(),
      },
    })

  return { id: resumeId, slug: slugVal }
}
