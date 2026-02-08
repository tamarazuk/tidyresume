import { test, expect } from '@playwright/test'

test.describe('Theme toggle', () => {
  test('theme toggle switches between dark and light mode', async ({
    page,
  }) => {
    await page.goto('/edit')

    // Open actions menu
    await page.getByRole('button', { name: 'Open actions menu' }).click()

    // Click "Switch to dark mode"
    await page
      .getByRole('button', { name: 'Switch to dark mode' })
      .click()

    // Verify dark class on html element
    await expect(page.locator('html')).toHaveClass(/dark/)

    // Wait for the dropdown to fully close before re-opening
    await expect(
      page.getByRole('button', { name: 'Switch to dark mode' })
    ).not.toBeVisible()

    // Open menu again and toggle back.
    // The theme change re-renders the dropdown, so the button can be
    // intercepted by the editor overlay. Use evaluate() to invoke click
    // directly on the DOM node so the React handler fires reliably.
    await page.getByRole('button', { name: 'Open actions menu' }).click()
    const lightBtn = page.getByRole('button', { name: 'Switch to light mode' })
    await expect(lightBtn).toBeVisible()
    await lightBtn.evaluate((el: HTMLElement) => el.click())

    // Verify dark class is removed
    await expect(page.locator('html')).not.toHaveClass(/dark/)
  })
})
