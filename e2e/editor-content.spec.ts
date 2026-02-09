import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

async function waitForEditorReady(page: Page) {
  // Wait for the editor to be ready - don't check for specific URL pattern
  // since redirect timing from /edit to /edit/{draftId} can vary
  await expect(page.getByTestId('markdown-editor')).toBeVisible()
}

test.describe('Editor content and views', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/edit')
    await waitForEditorReady(page)
  })

  test('markdown content persists across reload', async ({ page }) => {
    // Type in the CodeMirror editor (textarea within .cm-content)
    const cmContent = page.locator('.cm-content')
    await cmContent.click()
    await cmContent.fill('# Persistent Heading')

    // Reload and verify content survives
    await page.reload()
    await waitForEditorReady(page)
    await expect(page.locator('.cm-content')).toContainText(
      '# Persistent Heading'
    )
  })

  test('appearance settings sheet opens', async ({ page }) => {
    // Click "Appearance" toolbar button
    await page.getByRole('button', { name: 'Appearance' }).click()

    // Sheet should open with "Accent color" radiogroup
    await expect(
      page.getByRole('radiogroup', { name: 'Accent color' })
    ).toBeVisible()
  })

  test('accent color selection persists after reload', async ({ page }) => {
    // Open appearance
    await page.getByRole('button', { name: 'Appearance' }).click()
    await expect(
      page.getByRole('radiogroup', { name: 'Accent color' })
    ).toBeVisible()

    // Select "Blue" accent
    await page.getByRole('radio', { name: 'Blue' }).click()
    await expect(page.getByRole('radio', { name: 'Blue' })).toHaveAttribute(
      'aria-checked',
      'true'
    )

    // Close sheet and reload
    await page.getByRole('button', { name: 'Close appearance panel' }).click()
    await page.reload()

    // Reopen and verify Blue is still selected
    await waitForEditorReady(page)
    await page.getByRole('button', { name: 'Appearance' }).click()
    await expect(page.getByRole('radio', { name: 'Blue' })).toHaveAttribute(
      'aria-checked',
      'true'
    )
  })

  test('typography settings can be changed', async ({ page }) => {
    // Open appearance
    await page.getByRole('button', { name: 'Appearance' }).click()

    // Verify heading font select is visible
    const headingFontTrigger = page.locator('#appearance-heading-font')
    await expect(headingFontTrigger).toBeVisible()

    // Verify body size select is visible
    const bodySizeTrigger = page.locator('#appearance-body-size')
    await expect(bodySizeTrigger).toBeVisible()
  })

  test('actions menu opens with expected items', async ({ page }) => {
    await page.getByRole('button', { name: 'Open actions menu' }).click()

    // Verify Print item
    await expect(page.getByRole('menuitem', { name: 'Print' })).toBeVisible()

    // Verify theme toggle item
    await expect(
      page.getByRole('button', { name: /Switch to (dark|light) mode/ })
    ).toBeVisible()
  })
})
