import type { Meta, StoryObj } from '@storybook/react'
import { Providers } from '@/components/providers'

const meta = {
  title: 'Infrastructure/Providers',
  component: Providers,
  parameters: {
    docs: {
      description: {
        component:
          'App-level wrapper around `next-themes`. It is non-visual by itself.',
      },
    },
  },
} satisfies Meta<typeof Providers>

export default meta

type Story = StoryObj<typeof meta>

export const NonVisual: Story = {
  render: () => (
    <Providers>
      <div className="rounded border p-4 text-sm">Provider children render here.</div>
    </Providers>
  ),
}
