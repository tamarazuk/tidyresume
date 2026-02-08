import type { Meta, StoryObj } from '@storybook/react'
import HeaderCta from '@/components/marketing/header-cta'

const meta = {
  title: 'Marketing/Header CTA',
  component: HeaderCta,
} satisfies Meta<typeof HeaderCta>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithDraft: Story = {
  parameters: {
    tidyresume: {
      stores: {
        resume: {
          id: 'draft-id',
          resumeTitle: 'Draft Resume',
          markdown: '# Draft Resume',
        },
      },
    },
  },
}
