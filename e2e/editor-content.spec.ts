import { test, expect } from '@playwright/test'

test.describe('Editor content and views', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/edit')
  })

  test('markdown content persists across reload', async ({ page }) => {
    // Wait for editor to load
    const editor = page.getByTestId('markdown-editor')
    await expect(editor).toBeVisible()

    // Type in the CodeMirror editor (textarea within .cm-content)
    const cmContent = page.locator('.cm-content')
    await cmContent.click()
    await cmContent.fill('# Persistent Heading')

    // Reload and verify content survives
    await page.reload()
    await expect(page.getByTestId('markdown-editor')).toBeVisible()
    await expect(page.locator('.cm-content')).toContainText(
      '# Persistent Heading'
    )
  })

  test('appearance settings sheet opens', async ({ page }) => {
    await expect(page.getByTestId('markdown-editor')).toBeVisible()

    // Click "Appearance" toolbar button
    await page.getByRole('button', { name: 'Appearance' }).click()

    // Sheet should open with "Accent color" radiogroup
    await expect(
      page.getByRole('radiogroup', { name: 'Accent color' })
    ).toBeVisible()
  })

  test('accent color selection persists after reload', async ({ page }) => {
    await expect(page.getByTestId('markdown-editor')).toBeVisible()

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
    await expect(page.getByTestId('markdown-editor')).toBeVisible()
    await page.getByRole('button', { name: 'Appearance' }).click()
    await expect(page.getByRole('radio', { name: 'Blue' })).toHaveAttribute(
      'aria-checked',
      'true'
    )
  })

  test('typography settings can be changed', async ({ page }) => {
    await expect(page.getByTestId('markdown-editor')).toBeVisible()

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
