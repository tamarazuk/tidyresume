import { test, expect } from '@playwright/test'

test.describe('Landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('hero heading is visible', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 1, name: /Markdown/ })
    ).toBeVisible()
  })

  test('CTA links to /edit', async ({ page }) => {
    const cta = page.getByRole('link', { name: 'Start Writing Now' })
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute('href', '/edit')
  })

  test('clicking CTA navigates to /edit', async ({ page }) => {
    await page.getByRole('link', { name: 'Start Writing Now' }).click()
    await expect(page).toHaveURL('/edit')
  })

  test('feature grid renders', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Why TidyResume?' })
    ).toBeVisible()
  })

  test('CTA strip renders', async ({ page }) => {
    await expect(
      page.getByRole('heading', {
        name: 'A resume you can actually maintain',
      })
    ).toBeVisible()
  })

  test('support strip renders', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Help this project grow' })
    ).toBeVisible()
  })

  test('footer renders with links', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: 'Privacy Policy' })
    ).toBeVisible()
    await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Github' })).toBeVisible()
  })

  test('header CTA links to /edit', async ({ page }) => {
    const headerCta = page.getByRole('link', { name: 'Start Writing' })
    await expect(headerCta).toBeVisible()
    await expect(headerCta).toHaveAttribute('href', '/edit')
  })
})
