import { test, expect } from '@playwright/test'

test.describe('Privacy policy', () => {
  test('privacy policy page renders heading', async ({ page }) => {
    await page.goto('/privacy-policy')

    await expect(
      page.getByRole('heading', { level: 1, name: 'Privacy Policy' })
    ).toBeVisible()
  })

  test('footer link navigates from landing page', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'Privacy Policy' }).click()

    await expect(page).toHaveURL('/privacy-policy')
    await expect(
      page.getByRole('heading', { level: 1, name: 'Privacy Policy' })
    ).toBeVisible()
  })
})
