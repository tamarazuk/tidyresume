import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations, sql } from 'drizzle-orm'

export const resumes = sqliteTable('resumes', {
  id: text('id').primaryKey(),
  slug: text('slug').unique(),
  title: text('title').notNull(),
  content: text('content').notNull(), // Markdown content
  theme: text('theme'), // JSON theme settings
  labels: text('labels'), // JSON label data
  userEmail: text('user_email'),
  editSecret: text('edit_secret'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date()),
})

export const resumesRelations = relations(resumes, ({ many }) => ({
  authTokens: many(authTokens),
}))

export const authTokens = sqliteTable('auth_tokens', {
  id: text('id').primaryKey(),
  token: text('token').unique().notNull(),
  resumeId: text('resume_id')
    .notNull()
    .references(() => resumes.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  usedAt: integer('used_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})

export const authTokensRelations = relations(authTokens, ({ one }) => ({
  resume: one(resumes, {
    fields: [authTokens.resumeId],
    references: [resumes.id],
  }),
}))
