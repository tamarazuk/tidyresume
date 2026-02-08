import { test, expect } from '@playwright/test'

test.describe('Editor page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/edit')
  })

  test('header renders with heading', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 2, name: 'TidyResume Editor' })
    ).toBeVisible()
  })

  test('publish button is visible', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: 'Publish resume' })
    ).toBeVisible()
  })

  test('markdown editor loads', async ({ page }) => {
    await expect(page.locator('.md-editor')).toBeVisible()
  })

  test('resume title is editable', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit resume title' }).click()
    const titleInput = page.getByRole('textbox', { name: 'Resume title' })
    await expect(titleInput).toBeVisible()
    await titleInput.fill('My Custom Resume')
    await titleInput.press('Enter')
  })

  test('state persists across reload', async ({ page }) => {
    // Edit title
    await page.getByRole('button', { name: 'Edit resume title' }).click()
    const titleInput = page.getByRole('textbox', { name: 'Resume title' })
    await titleInput.fill('Persisted Title')
    await titleInput.press('Enter')

    // Reload and verify
    await page.reload()
    await expect(page.getByText('Persisted Title')).toBeVisible()
  })

  test('home link navigates to /', async ({ page }) => {
    await page.getByRole('link', { name: 'TidyResume home' }).click()
    await expect(page).toHaveURL('/')
  })
})
