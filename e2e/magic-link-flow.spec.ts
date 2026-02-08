import { test, expect } from '@playwright/test'

test.describe('Magic link flow', () => {
  test('valid token loads resume', async ({ page }) => {
    await page.route('**/api/auth/verify-token', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          resume: {
            id: 'loaded-resume-id',
            slug: 'loaded-slug',
            title: 'Loaded Resume',
            content: '# Loaded content',
            editSecret: 'loaded-secret',
          },
        }),
      })
    )

    await page.goto('/edit?token=valid-token')

    // Should show success toast (loading toast is transient and may resolve before assertion)
    await expect(page.getByText('Resume loaded successfully')).toBeVisible()

    // Title should be displayed
    await expect(page.getByText('Loaded Resume')).toBeVisible()

    // URL should be rewritten to /edit (no token param)
    await expect(page).toHaveURL('/edit')
  })

  test('invalid token shows error', async ({ page }) => {
    await page.route('**/api/auth/verify-token', (route) =>
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid token' }),
      })
    )

    await page.goto('/edit?token=bad-token')

    await expect(page.getByText('Invalid or expired link')).toBeVisible()
    await expect(page).toHaveURL('/edit')
  })

  test('expired token shows error', async ({ page }) => {
    await page.route('**/api/auth/verify-token', (route) =>
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Token expired' }),
      })
    )

    await page.goto('/edit?token=expired-token')

    await expect(page.getByText('Invalid or expired link')).toBeVisible()
    await expect(page).toHaveURL('/edit')
  })
})
