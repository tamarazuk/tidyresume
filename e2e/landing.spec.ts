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

  test('CTA button is visible', async ({ page }) => {
    const cta = page.getByRole('button', { name: 'Start Writing' }).first()
    await expect(cta).toBeVisible()
  })

  test('clicking CTA navigates to /resumes', async ({ page }) => {
    await page.getByRole('button', { name: 'Start Writing' }).first().click()
    await expect(page).toHaveURL('/resumes')
  })

  test('features section renders', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Everything you need/ })
    ).toBeVisible()
  })

  test('CTA section renders', async ({ page }) => {
    await expect(
      page.getByRole('heading', {
        name: 'Your next role starts with a better resume',
      })
    ).toBeVisible()
  })

  test('support section renders', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Help TidyResume grow' })
    ).toBeVisible()
  })

  test('footer renders with links', async ({ page }) => {
    const footer = page.getByRole('contentinfo')
    await expect(
      footer.getByRole('link', { name: 'Privacy Policy' })
    ).toBeVisible()
    await expect(footer.getByRole('link', { name: 'Contact' })).toBeVisible()
    await expect(footer.getByRole('link', { name: /github/i })).toBeVisible()
  })

  test('header CTA navigates to /resumes', async ({ page }) => {
    const header = page.getByRole('banner')
    // CTA text depends on whether user has a stored draft
    const headerCta = header.getByRole('button', {
      name: /Start Writing|Continue Writing/,
    })
    await expect(headerCta).toBeVisible()
    // Click and verify navigation works
    await headerCta.click()
    await expect(page).toHaveURL('/resumes')
  })
})
