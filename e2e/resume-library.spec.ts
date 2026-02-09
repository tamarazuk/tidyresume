import { test, expect } from '@playwright/test'

test.describe('Resume Library', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.clear()
    })

    // Create a draft
    await page.goto('/edit')
    await page.waitForURL(/\/edit\/[a-zA-Z0-9-]+/)
    await expect(page.getByTestId('markdown-editor')).toBeVisible()

    await page.goto('/resumes')
  })

  test('can create a draft and assign labels in list view', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'List view' }).click()

    // Find the row container by checking for the text "Untitled Resume" inside a "group" div
    // ShelfRow has 'group' class.
    const row = page
      .locator('div.group', { has: page.getByText('Untitled Resume') })
      .first()
    await row.hover()

    const assignLabelsBtn = row.getByLabel('Assign labels')
    await expect(assignLabelsBtn).toBeVisible()
    await assignLabelsBtn.click()

    const createLabelBtn = page.getByRole('button', {
      name: 'Create new label',
    })
    await createLabelBtn.click()

    const labelInput = page.getByLabel('Label name')
    await expect(labelInput).toBeVisible()
    await labelInput.fill('Test Label')
    await page.getByRole('button', { name: 'Save' }).click()

    await expect(
      page.getByRole('button', { name: 'Remove label Test Label' })
    ).toBeVisible()

    await page.mouse.click(0, 0)

    // Verify Label Badge is visible in List View (ShelfRow now shows Badges)
    await expect(row.getByText('Test Label')).toBeVisible()

    await page.getByRole('button', { name: 'Grid view' }).click()
    const card = page.locator('.group.relative').first()

    // Verify Label Dot in Grid View (ResumeCard now shows Dots with title tooltip)
    const labelContainer = card.locator('div[title*="Test Label"]')
    await expect(labelContainer).toBeVisible()
  })
})
