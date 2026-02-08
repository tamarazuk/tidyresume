import { test, expect } from '@playwright/test'

test.describe('Publish flow', () => {
  test('untitled resume shows "Set a title" popover', async ({ page }) => {
    await page.goto('/edit')

    await page.getByRole('button', { name: 'Publish resume' }).click()
    await expect(page.getByText('Set a title to publish')).toBeVisible()
  })

  test('publish succeeds with mocked API and shows View link', async ({
    page,
  }) => {
    // Mock the publish API
    await page.route('**/api/resumes/publish', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-resume-id',
          slug: 'test-slug',
          editSecret: 'test-secret',
        }),
      })
    )

    await page.goto('/edit')

    // Set a title first so the publish button triggers the real action
    await page.getByRole('button', { name: 'Edit resume title' }).click()
    const titleInput = page.getByRole('textbox', { name: 'Resume title' })
    await titleInput.fill('My Test Resume')
    await titleInput.press('Enter')

    // Click publish
    await page.getByRole('button', { name: 'Publish resume' }).click()

    // View link should appear after successful publish
    await expect(
      page.getByRole('link', { name: 'View resume' })
    ).toBeVisible()
  })
})
