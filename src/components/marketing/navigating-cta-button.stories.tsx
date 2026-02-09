import type { Meta, StoryObj } from '@storybook/react'
import NavigatingCtaButton from '@/components/marketing/navigating-cta-button'
import { NavigationLoadingProvider } from '@/providers/navigation-loading-provider'

const meta = {
  title: 'Marketing/Navigating CTA Button',
  component: NavigatingCtaButton,
  decorators: [
    (Story) => (
      <NavigationLoadingProvider>
        <Story />
      </NavigationLoadingProvider>
    ),
  ],
  args: {
    href: '/edit',
    children: 'Start Building',
  },
} satisfies Meta<typeof NavigatingCtaButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutIcon: Story = {
  args: {
    icon: false,
  },
}

export const CustomClassName: Story = {
  args: {
    className: 'bg-primary text-primary-foreground rounded-lg px-4 py-2',
  },
}
