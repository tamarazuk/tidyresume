import type { Meta, StoryObj } from '@storybook/react'
import { HttpResponse, http } from 'msw'
import { expect, userEvent, waitFor, within } from 'storybook/test'
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

export const SubmitSuccess: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post('/api/auth/generate-token', () => {
          return HttpResponse.json({})
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(document.body)

    await userEvent.click(
      canvas.getByRole('button', { name: /edit on another device/i })
    )
    await userEvent.type(
      page.getByLabelText(/email address/i),
      'owner@example.com'
    )
    await userEvent.click(page.getByRole('button', { name: /send link/i }))

    await page.findByText('Magic link sent!')
    await waitFor(async () => {
      await expect(
        page.queryByRole('dialog', { name: /edit on another device/i })
      ).not.toBeInTheDocument()
    })
  },
}

export const SubmitError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post('/api/auth/generate-token', () => {
          return HttpResponse.json({ error: 'Failed to send link' }, { status: 500 })
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(document.body)

    await userEvent.click(
      canvas.getByRole('button', { name: /edit on another device/i })
    )
    await userEvent.type(
      page.getByLabelText(/email address/i),
      'owner@example.com'
    )
    await userEvent.click(page.getByRole('button', { name: /send link/i }))

    await page.findByText('Error sending link')
    await expect(
      page.getByRole('dialog', { name: /edit on another device/i })
    ).toBeInTheDocument()
  },
}
