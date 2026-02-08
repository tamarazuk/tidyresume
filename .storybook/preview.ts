import type { Preview } from '@storybook/react'
import { initialize, mswLoader } from 'msw-storybook-addon'
import { withAppProviders } from '@/storybook/decorators/with-app-providers'
import { withStores } from '@/storybook/decorators/with-stores'
import '@/styles/globals.css'

initialize({ onUnhandledRequest: 'bypass' })

const applyBrowserShims = () => {
  if (typeof window === 'undefined') {
    return
  }

  const shimWindow = window as Window & {
    __tidyresumeStorybookShimsApplied?: boolean
  }

  if (shimWindow.__tidyresumeStorybookShimsApplied) {
    return
  }

  shimWindow.__tidyresumeStorybookShimsApplied = true

  window.print = () => undefined

  if (!navigator.clipboard) {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => undefined,
      },
    })
  }

  if (!navigator.share) {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: async () => undefined,
    })
  }

  if (!URL.createObjectURL) {
    URL.createObjectURL = () => 'blob:storybook'
  }

  if (!URL.revokeObjectURL) {
    URL.revokeObjectURL = () => undefined
  }
}

applyBrowserShims()

const preview: Preview = {
  loaders: [mswLoader],
  tags: ['autodocs'],
  parameters: {
    actions: {
      argTypesRegex: '^on[A-Z].*',
    },
    controls: {
      expanded: true,
    },
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [withStores, withAppProviders],
}

export default preview
