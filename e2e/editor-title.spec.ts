import { test, expect } from '@playwright/test'

test.describe('Editor title', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/edit')
  })

  test('escape exits title editing mode', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit resume title' }).click()
    const titleInput = page.getByRole('textbox', { name: 'Resume title' })
    await expect(titleInput).toBeVisible()

    // Type a new title
    await titleInput.fill('New Title')

    // Press Escape to exit editing
    await titleInput.press('Escape')

    // Should exit editing mode (input disappears, button returns)
    await expect(titleInput).not.toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Edit resume title' })
    ).toBeVisible()
  })

  test('title input has max length of 120', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit resume title' }).click()
    const titleInput = page.getByRole('textbox', { name: 'Resume title' })
    await expect(titleInput).toBeVisible()

    await expect(titleInput).toHaveAttribute('maxlength', '120')
  })

  test('clicking outside saves title via blur', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit resume title' }).click()
    const titleInput = page.getByRole('textbox', { name: 'Resume title' })
    await titleInput.fill('Blur Saved Title')

    // Click elsewhere to blur
    await page
      .getByRole('heading', { level: 2, name: 'TidyResume Editor' })
      .click()

    // Title input should disappear
    await expect(titleInput).not.toBeVisible()

    // The new title should be displayed in the main title button
    await expect(
      page.getByRole('button', { name: 'Edit resume title' })
    ).toContainText('Blur Saved Title')
  })
})
