import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { UnpublishButton } from '@/components/public-view/unpublish-button'
import { STORY_RESUME_ID } from '@/storybook/fixtures/resume-fixtures'

const meta = {
  title: 'Public View/Unpublish Button',
  component: UnpublishButton,
  args: {
    id: STORY_RESUME_ID,
    showLabel: true,
    labelClassName: 'inline',
  },
} satisfies Meta<typeof UnpublishButton>

export default meta

type Story = StoryObj<typeof meta>

const createJsonResponse = (body: unknown, status = 200) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const Owner: Story = {
  parameters: {
    tidyresume: {
      stores: {
        resume: {
          id: STORY_RESUME_ID,
          isPublished: true,
        },
      },
    },
  },
}

export const Visitor: Story = {
  parameters: {
    tidyresume: {
      stores: {
        resume: {
          id: 'different-id',
          isPublished: true,
        },
      },
    },
  },
}

export const OwnerCancel: Story = {
  parameters: {
    tidyresume: {
      stores: {
        resume: {
          id: STORY_RESUME_ID,
          isPublished: true,
        },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const originalConfirm = window.confirm
    const originalFetch = globalThis.fetch
    const confirmMock = fn(() => false)
    const fetchMock = fn(async () => createJsonResponse({ success: true }))
    window.confirm = confirmMock as typeof window.confirm
    globalThis.fetch = fetchMock as typeof fetch

    try {
      await userEvent.click(canvas.getByRole('button', { name: /unpublish/i }))
      await expect(confirmMock).toHaveBeenCalledTimes(1)
      await expect(fetchMock).toHaveBeenCalledTimes(0)
    } finally {
      window.confirm = originalConfirm
      globalThis.fetch = originalFetch
    }
  },
}

export const OwnerConfirm: Story = {
  parameters: {
    tidyresume: {
      stores: {
        resume: {
          id: STORY_RESUME_ID,
          isPublished: true,
        },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(document.body)
    const originalConfirm = window.confirm
    const originalFetch = globalThis.fetch
    const confirmMock = fn(() => true)
    const fetchMock = fn(async () => createJsonResponse({ success: true }))
    window.confirm = confirmMock as typeof window.confirm
    globalThis.fetch = fetchMock as typeof fetch

    try {
      await userEvent.click(canvas.getByRole('button', { name: /unpublish/i }))
      await waitFor(async () => {
        await expect(confirmMock).toHaveBeenCalledTimes(1)
        await expect(fetchMock).toHaveBeenCalledTimes(1)
      })
      await expect(fetchMock).toHaveBeenCalledWith(
        `/api/resumes/${STORY_RESUME_ID}`,
        expect.objectContaining({
          method: 'DELETE',
        })
      )
      await page.findByText('Resume unpublished successfully')
    } finally {
      window.confirm = originalConfirm
      globalThis.fetch = originalFetch
    }
  },
}
