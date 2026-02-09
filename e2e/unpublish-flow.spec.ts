import { test, expect } from '@playwright/test'
import { seedPublishedState } from './helpers'

test.describe('Unpublish flow', () => {
  // Mock the publish endpoint to prevent auto-sync errors
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/resumes/publish', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-resume-id',
          slug: 'test-slug',
          created: false,
        }),
      })
    )
  })

  test('unpublish resets to Publish button', async ({ page }) => {
    await seedPublishedState(page)

    await page.route('**/api/resumes/test-resume-id', (route) => {
      if (route.request().method() === 'DELETE') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        })
      }
      return route.continue()
    })

    await page.goto('/edit')

    // Verify we start in published state
    await expect(page.getByRole('link', { name: 'View resume' })).toBeVisible()

    // Open actions menu and click Unpublish
    await page.getByRole('button', { name: 'Open actions menu' }).click()

    // Accept the confirm dialog before clicking Unpublish
    page.on('dialog', (dialog) => dialog.accept())

    await page.getByRole('menuitem', { name: 'Unpublish' }).click()

    // Should show success toast
    await expect(
      page.getByText('Resume unpublished successfully')
    ).toBeVisible()

    // Publish button should return
    await expect(
      page.getByRole('button', { name: 'Publish resume' })
    ).toBeVisible()
  })

  test('cancel unpublish keeps published state', async ({ page }) => {
    await seedPublishedState(page)
    await page.goto('/edit')

    // Verify we start in published state
    await expect(page.getByRole('link', { name: 'View resume' })).toBeVisible()

    // Open actions menu and click Unpublish
    await page.getByRole('button', { name: 'Open actions menu' }).click()

    // Dismiss the confirm dialog
    page.on('dialog', (dialog) => dialog.dismiss())

    await page.getByRole('menuitem', { name: 'Unpublish' }).click()

    // View link should still be present
    await expect(page.getByRole('link', { name: 'View resume' })).toBeVisible()
  })
})
