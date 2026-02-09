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
          created: true,
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

  test('publish button is disabled while publishing', async ({ page }) => {
    // Mock with a delayed response
    await page.route('**/api/resumes/publish', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-resume-id',
          slug: 'test-slug',
          editSecret: 'test-secret',
          created: true,
        }),
      })
    })

    await page.goto('/edit')

    // Set a title first
    await page.getByRole('button', { name: 'Edit resume title' }).click()
    const titleInput = page.getByRole('textbox', { name: 'Resume title' })
    await titleInput.fill('My Test Resume')
    await titleInput.press('Enter')

    // Click publish
    await page.getByRole('button', { name: 'Publish resume' }).click()

    // Button should be disabled while publishing
    await expect(
      page.getByRole('button', { name: 'Publish resume' })
    ).toBeDisabled()
  })

  test('publish failure shows error toast', async ({ page }) => {
    // Mock publish API to return 500
    await page.route('**/api/resumes/publish', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      })
    )

    await page.goto('/edit')

    // Set a title first
    await page.getByRole('button', { name: 'Edit resume title' }).click()
    const titleInput = page.getByRole('textbox', { name: 'Resume title' })
    await titleInput.fill('My Test Resume')
    await titleInput.press('Enter')

    // Click publish
    await page.getByRole('button', { name: 'Publish resume' }).click()

    // Error toast should appear
    await expect(page.getByText('Failed to publish resume')).toBeVisible()
  })

  test('view link has correct href after publish', async ({ page }) => {
    await page.route('**/api/resumes/publish', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-resume-id',
          slug: 'my-resume',
          editSecret: 'test-secret',
          created: true,
        }),
      })
    )

    await page.goto('/edit')

    await page.getByRole('button', { name: 'Edit resume title' }).click()
    const titleInput = page.getByRole('textbox', { name: 'Resume title' })
    await titleInput.fill('My Test Resume')
    await titleInput.press('Enter')

    await page.getByRole('button', { name: 'Publish resume' }).click()

    // The View link should use the returned slug when provided.
    const viewLink = page.getByRole('link', { name: 'View resume' })
    await expect(viewLink).toHaveAttribute('href', '/r/my-resume')
  })

  test('after publish, View button replaces Publish button', async ({
    page,
  }) => {
    await page.route('**/api/resumes/publish', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-resume-id',
          slug: 'test-slug',
          editSecret: 'test-secret',
          created: true,
        }),
      })
    )

    await page.goto('/edit')

    await page.getByRole('button', { name: 'Edit resume title' }).click()
    const titleInput = page.getByRole('textbox', { name: 'Resume title' })
    await titleInput.fill('My Test Resume')
    await titleInput.press('Enter')

    await page.getByRole('button', { name: 'Publish resume' }).click()

    // View link should be visible
    await expect(
      page.getByRole('link', { name: 'View resume' })
    ).toBeVisible()

    // Publish button should be gone
    await expect(
      page.getByRole('button', { name: 'Publish resume' })
    ).not.toBeVisible()
  })

  test('published state persists across reload', async ({ page }) => {
    await page.route('**/api/resumes/publish', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-resume-id',
          slug: 'test-slug',
          editSecret: 'test-secret',
          created: true,
        }),
      })
    )

    await page.goto('/edit')

    await page.getByRole('button', { name: 'Edit resume title' }).click()
    const titleInput = page.getByRole('textbox', { name: 'Resume title' })
    await titleInput.fill('My Test Resume')
    await titleInput.press('Enter')

    await page.getByRole('button', { name: 'Publish resume' }).click()
    await expect(
      page.getByRole('link', { name: 'View resume' })
    ).toBeVisible()

    // Reload and verify
    await page.reload()
    await expect(
      page.getByRole('link', { name: 'View resume' })
    ).toBeVisible()
  })

  test('"Set title" link in popover focuses title input', async ({ page }) => {
    await page.goto('/edit')

    // Click Publish when untitled — shows popover
    await page.getByRole('button', { name: 'Publish resume' }).click()
    await expect(page.getByText('Set a title to publish')).toBeVisible()

    // Click "Set title" link
    await page.getByRole('button', { name: 'Set title' }).click()

    // Title input should appear and be focused
    const titleInput = page.getByRole('textbox', { name: 'Resume title' })
    await expect(titleInput).toBeVisible()
    await expect(titleInput).toBeFocused()
  })
})
