import { test, expect } from '@playwright/test'

test.describe('Theme toggle', () => {
  test('theme toggle switches to dark mode', async ({ page }) => {
    await page.goto('/edit')

    // Open actions menu
    await page.getByRole('button', { name: 'Open actions menu' }).click()

    // Click "Switch to dark mode"
    await page
      .getByRole('button', { name: 'Switch to dark mode' })
      .click()

    // Verify dark class on html element
    await expect(page.locator('html')).toHaveClass(/dark/)
  })
})
