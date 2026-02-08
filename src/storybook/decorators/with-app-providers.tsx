import type { Decorator } from '@storybook/react'
import ThemeProvider from '@/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'

export const withAppProviders: Decorator = (Story) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="bg-background text-foreground min-h-screen font-sans p-4">
        <Story />
      </div>
      <Toaster />
    </ThemeProvider>
  )
}
