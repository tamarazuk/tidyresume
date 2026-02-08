import { test, expect } from '@playwright/test'
import { seedPublishedState } from './helpers'

test.describe('PDF download', () => {
  test('download PDF is disabled when not published', async ({ page }) => {
    await page.goto('/edit')

    // Open actions menu
    await page.getByRole('button', { name: 'Open actions menu' }).click()

    // "Download PDF" should be disabled (no resumeId)
    const downloadItem = page.getByRole('menuitem', { name: 'Download PDF' })
    await expect(downloadItem).toBeVisible()
    await expect(downloadItem).toHaveAttribute('aria-disabled', 'true')
  })

  test('download PDF triggers API when published', async ({ page }) => {
    await seedPublishedState(page)

    let pdfApiCalled = false
    await page.route('**/api/resumes/test-resume-id/pdf', (route) => {
      pdfApiCalled = true
      return route.fulfill({
        status: 200,
        contentType: 'application/pdf',
        body: Buffer.from('%PDF-1.4 fake content'),
      })
    })

    await page.goto('/edit')

    // Verify published state
    await expect(
      page.getByRole('link', { name: 'View resume' })
    ).toBeVisible()

    // Open actions menu and click Download PDF
    await page.getByRole('button', { name: 'Open actions menu' }).click()
    await page.getByRole('menuitem', { name: 'Download PDF' }).click()

    // Wait for API call
    await page.waitForResponse('**/api/resumes/test-resume-id/pdf')
    expect(pdfApiCalled).toBe(true)
  })
})
