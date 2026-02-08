import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { MagicLinkDialog } from '@/components/public-view/magic-link-dialog'
import { STORY_RESUME_ID } from '@/storybook/fixtures/resume-fixtures'

const meta = {
  title: 'Public View/Magic Link Dialog',
  component: MagicLinkDialog,
  args: {
    resumeId: STORY_RESUME_ID,
  },
} satisfies Meta<typeof MagicLinkDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

const createJsonResponse = (body: unknown, status = 200) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const SubmitSuccess: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(document.body)
    const originalFetch = globalThis.fetch
    const fetchMock = fn(async () => createJsonResponse({}))
    globalThis.fetch = fetchMock as typeof fetch

    try {
      await userEvent.click(
        canvas.getByRole('button', { name: /edit on another device/i })
      )
      await userEvent.type(
        page.getByLabelText(/email address/i),
        'owner@example.com'
      )
      await userEvent.click(page.getByRole('button', { name: /send link/i }))

      await waitFor(async () => {
        await expect(fetchMock).toHaveBeenCalledTimes(1)
      })
      await expect(fetchMock).toHaveBeenCalledWith(
        '/api/auth/generate-token',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            resumeId: STORY_RESUME_ID,
            email: 'owner@example.com',
          }),
        })
      )
      await page.findByText('Magic link sent!')
      await waitFor(async () => {
        await expect(
          page.queryByRole('dialog', { name: /edit on another device/i })
        ).not.toBeInTheDocument()
      })
    } finally {
      globalThis.fetch = originalFetch
    }
  },
}

export const SubmitError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(document.body)
    const originalFetch = globalThis.fetch
    const fetchMock = fn(async () =>
      createJsonResponse({ error: 'Failed to send link' }, 500)
    )
    globalThis.fetch = fetchMock as typeof fetch

    try {
      await userEvent.click(
        canvas.getByRole('button', { name: /edit on another device/i })
      )
      await userEvent.type(
        page.getByLabelText(/email address/i),
        'owner@example.com'
      )
      await userEvent.click(page.getByRole('button', { name: /send link/i }))

      await waitFor(async () => {
        await expect(fetchMock).toHaveBeenCalledTimes(1)
      })
      await page.findByText('Error sending link')
      await expect(
        page.getByRole('dialog', { name: /edit on another device/i })
      ).toBeInTheDocument()
    } finally {
      globalThis.fetch = originalFetch
    }
  },
}
