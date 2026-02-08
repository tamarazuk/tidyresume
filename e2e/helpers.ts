import type { Page } from '@playwright/test'

interface SeedOverrides {
  id?: string
  slug?: string
  editSecret?: string
  resumeTitle?: string
  markdown?: string
  isPublished?: boolean
}

/**
 * Seeds localStorage with published resume state before navigating.
 * Useful for tests that need the editor to start in a "published" state.
 */
export async function seedPublishedState(
  page: Page,
  overrides: SeedOverrides = {}
) {
  const data = {
    state: {
      id: 'test-resume-id',
      slug: 'test-slug',
      editSecret: 'test-secret',
      resumeTitle: 'My Test Resume',
      markdown: '# Hello',
      saveStatus: 'saved',
      syncStatus: 'synced',
      isPublished: true,
      imageWarning: null,
      contentWarning: null,
      resumeDisplay: {
        themeMode: 'auto',
        theme: {},
      },
      ...overrides,
    },
    version: 8,
  }

  await page.addInitScript((serialized) => {
    localStorage.setItem('tidyresume-editor', JSON.stringify(serialized))
  }, data)
}
