import type { Decorator } from '@storybook/react'
import ThemeProvider from '@/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'

export const withAppProviders: Decorator = (Story, context) => {
  const isPublicViewStory = context.title.startsWith('Public View/')
  const containerClassName = isPublicViewStory
    ? 'resume-theme bg-background text-foreground min-h-screen font-sans p-4'
    : 'bg-background text-foreground min-h-screen font-sans p-4'

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className={containerClassName}>
        <Story />
      </div>
      <Toaster />
    </ThemeProvider>
  )
}
