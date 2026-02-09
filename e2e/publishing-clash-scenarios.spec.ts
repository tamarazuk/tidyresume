import { expect, test } from '@playwright/test'
import {
  readPersistedResumeStore,
  seedResumeStore,
  type PersistedResumeStore,
} from './helpers'

function getDraftById(store: PersistedResumeStore, draftId: string) {
  return store.state.draftsById[draftId]
}

test.describe('Publishing clash scenarios', () => {
  test('opening draft B public link does not mutate active draft A', async ({
    page,
  }) => {
    await seedResumeStore(page, {
      activeDraftId: 'draft-a',
      drafts: [
        {
          draftId: 'draft-a',
          id: 'remote-a',
          slug: 'resume-a',
          editSecret: 'secret-a',
          resumeTitle: 'Resume A',
          markdown: '# Resume A',
          isPublished: true,
          syncStatus: 'synced',
          createdAt: 1_700_000_000_000,
          updatedAt: 1_700_000_000_000,
        },
        {
          draftId: 'draft-b',
          id: 'remote-b',
          slug: 'resume-b',
          editSecret: 'secret-b',
          resumeTitle: 'Resume B',
          markdown: '# Resume B',
          isPublished: true,
          syncStatus: 'synced',
          createdAt: 1_700_000_100_000,
          updatedAt: 1_700_000_100_000,
        },
      ],
    })

    await page.route('**/api/resumes/remote-a', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'remote-a',
          slug: 'resume-a',
          title: 'Resume A',
          content: '# Resume A',
        }),
      })
    )

    await page.route('**/api/resumes/remote-b', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'remote-b',
          slug: 'resume-b',
          title: 'Resume B',
          content: '# Resume B',
        }),
      })
    )

    // Mock the public resume page to avoid hitting the database
    await page.route('**/r/resume-b', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<html><head><title>Resume B</title></head><body><h1>Resume B</h1></body></html>',
      })
    )

    await page.goto('/edit/draft-a')
    await expect(page).toHaveURL(/\/edit\/draft-a$/)

    await page.goto('/r/resume-b')
    await expect(page).toHaveURL(/\/r\/resume-b$/)

    const persisted = await readPersistedResumeStore(page)
    expect(persisted).not.toBeNull()
    if (!persisted) return

    expect(persisted.state.activeDraftId).toBe('draft-a')
    const draftA = getDraftById(persisted, 'draft-a')
    expect(draftA.id).toBe('remote-a')
    expect(draftA.slug).toBe('resume-a')
    expect(draftA.editSecret).toBe('secret-a')
    expect(draftA.resumeTitle).toBe('Resume A')
    expect(draftA.markdown).toBe('# Resume A')
    expect(draftA.isPublished).toBe(true)
  })

  test('magic link in fresh browser updates only intended draft', async ({
    browser,
  }) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    try {
      await seedResumeStore(page, {
        activeDraftId: 'draft-a',
        drafts: [
          {
            draftId: 'draft-a',
            id: 'remote-a',
            slug: 'resume-a',
            editSecret: 'secret-a',
            resumeTitle: 'Resume A',
            markdown: '# Resume A',
            isPublished: true,
            syncStatus: 'synced',
          },
        ],
      })

      await page.route('**/api/resumes/remote-a', (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'remote-a',
            slug: 'resume-a',
            title: 'Resume A',
            content: '# Resume A',
          }),
        })
      )

      await page.route('**/api/auth/verify-token', (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            resume: {
              id: 'remote-b',
              slug: 'resume-b',
              title: 'Resume B',
              content: '# Resume B',
              editSecret: 'secret-b',
            },
          }),
        })
      )

      await page.goto('/edit?token=fresh-browser-token')

      // Wait for magic link flow to complete before checking URL
      await expect(
        page.getByText('Resume loaded successfully').first()
      ).toBeVisible()

      // Wait for URL redirect with longer timeout since it can take time
      await page.waitForURL(/\/edit\/.+$/, { timeout: 10000 })

      const persisted = await readPersistedResumeStore(page)
      expect(persisted).not.toBeNull()
      if (!persisted) return

      const drafts = Object.values(persisted.state.draftsById)
      expect(drafts).toHaveLength(2)

      const originalDraft = drafts.find((draft) => draft.draftId === 'draft-a')
      expect(originalDraft).toBeDefined()
      expect(originalDraft?.id).toBe('remote-a')
      expect(originalDraft?.resumeTitle).toBe('Resume A')

      const importedDraft = drafts.find((draft) => draft.id === 'remote-b')
      expect(importedDraft).toBeDefined()
      expect(importedDraft?.resumeTitle).toBe('Resume B')
      expect(importedDraft?.editSecret).toBe('secret-b')
      expect(persisted.state.activeDraftId).toBe(importedDraft?.draftId)
    } finally {
      await context.close()
    }
  })

  test('stale id republish rotates remote id and edit secret on the same draft', async ({
    page,
  }) => {
    await seedResumeStore(page, {
      activeDraftId: 'draft-stale',
      drafts: [
        {
          draftId: 'draft-stale',
          id: 'remote-stale',
          slug: 'resume-stale',
          editSecret: 'secret-stale',
          resumeTitle: 'Resume Stale',
          markdown: '# Resume Stale',
          isPublished: false,
          syncStatus: 'error',
        },
      ],
    })

    let publishPayload: Record<string, unknown> | null = null
    let publishSecret: string | undefined

    await page.route('**/api/resumes/publish', (route) => {
      publishPayload = route.request().postDataJSON() as Record<string, unknown>
      publishSecret = route.request().headers()['x-edit-secret']

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'remote-fresh',
          slug: 'resume-fresh',
          editSecret: 'secret-fresh',
          created: true,
        }),
      })
    })

    await page.goto('/edit/draft-stale')
    await expect(page).toHaveURL(/\/edit\/draft-stale$/)

    await page.getByRole('button', { name: 'Publish resume' }).click()
    await expect(page.getByRole('link', { name: 'View resume' })).toBeVisible()

    expect(publishPayload?.id).toBe('remote-stale')
    expect(publishSecret).toBe('secret-stale')

    const persisted = await readPersistedResumeStore(page)
    expect(persisted).not.toBeNull()
    if (!persisted) return

    expect(persisted.state.activeDraftId).toBe('draft-stale')
    const rotatedDraft = getDraftById(persisted, 'draft-stale')
    expect(rotatedDraft.id).toBe('remote-fresh')
    expect(rotatedDraft.slug).toBe('resume-fresh')
    expect(rotatedDraft.editSecret).toBe('secret-fresh')
    expect(rotatedDraft.isPublished).toBe(true)
    expect(rotatedDraft.syncStatus).toBe('synced')
  })
})
