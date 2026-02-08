import { test, expect } from '@playwright/test'
import { seedPublishedState } from './helpers'

test.describe('Slug settings', () => {
  test('slug settings popover opens when published', async ({ page }) => {
    await seedPublishedState(page)
    await page.goto('/edit')

    // Verify published state
    await expect(
      page.getByRole('link', { name: 'View resume' })
    ).toBeVisible()

    // Open actions menu and click "Edit link"
    await page.getByRole('button', { name: 'Open actions menu' }).click()
    await page.getByRole('button', { name: 'Edit link' }).click()

    // "Custom URL" popover should appear
    await expect(page.getByText('Custom URL')).toBeVisible()
  })

  test('slug saves successfully', async ({ page }) => {
    await seedPublishedState(page)

    await page.route('**/api/resumes/test-resume-id/slug', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ slug: 'my-custom-slug', url: '/r/my-custom-slug' }),
      })
    )

    await page.goto('/edit')

    // Open actions menu → Edit link
    await page.getByRole('button', { name: 'Open actions menu' }).click()
    await page.getByRole('button', { name: 'Edit link' }).click()

    // Type slug and save
    const slugInput = page.locator('#slug')
    await slugInput.fill('my-custom-slug')
    await page.getByRole('button', { name: 'Save' }).click()

    // Verify "Saved!" message
    await expect(page.getByText('Saved!')).toBeVisible()
  })

  test('slug conflict shows error', async ({ page }) => {
    await seedPublishedState(page)

    await page.route('**/api/resumes/test-resume-id/slug', (route) =>
      route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Slug already taken' }),
      })
    )

    await page.goto('/edit')

    // Open actions menu → Edit link
    await page.getByRole('button', { name: 'Open actions menu' }).click()
    await page.getByRole('button', { name: 'Edit link' }).click()

    // Type a taken slug and save
    const slugInput = page.locator('#slug')
    await slugInput.fill('taken-slug')
    await page.getByRole('button', { name: 'Save' }).click()

    // Verify error message
    await expect(page.getByText('Slug already taken')).toBeVisible()
  })
})
