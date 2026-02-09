import type { Meta, StoryObj } from '@storybook/react'
import NavigationLoadingOverlay from '@/components/ui/navigation-loading-overlay'
import { NavigationLoadingProvider } from '@/providers/navigation-loading-provider'

// Create a mock provider that always shows loading state
function MockNavigationLoadingProvider({
  children,
  isNavigating,
}: {
  children: React.ReactNode
  isNavigating: boolean
}) {
  return (
    <NavigationLoadingProvider>
      {isNavigating ? (
        // Override the context to force loading state
        <div data-navigating="true">{children}</div>
      ) : (
        children
      )}
    </NavigationLoadingProvider>
  )
}

// Component wrapper that shows the overlay in forced loading state
function LoadingOverlayDemo() {
  // Render the skeleton content directly for the story
  return (
    <div className="bg-background min-h-screen">
      <header className="border-border bg-background/80 sticky top-0 z-10 flex items-center justify-between border-b px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="bg-muted size-10 animate-pulse rounded-lg" />
          <div className="space-y-1.5">
            <div className="bg-muted h-5 w-24 animate-pulse rounded" />
            <div className="bg-muted h-3 w-32 animate-pulse rounded" />
          </div>
        </div>
        <div className="bg-muted h-9 w-32 animate-pulse rounded-md" />
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
        <section className="space-y-2">
          <div className="bg-muted h-8 w-48 animate-pulse rounded" />
          <div className="bg-muted h-4 w-64 animate-pulse rounded" />
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="bg-muted/50 flex gap-0.5 rounded-lg p-0.5">
            <div className="bg-muted h-8 w-16 animate-pulse rounded-md" />
            <div className="bg-muted h-8 w-20 animate-pulse rounded-md" />
            <div className="bg-muted h-8 w-16 animate-pulse rounded-md" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="border-border bg-card flex flex-col rounded-xl border p-4"
            >
              <div className="mb-3 flex items-start gap-3">
                <div className="bg-muted size-2 shrink-0 animate-pulse rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
                  <div className="bg-muted h-3 w-1/2 animate-pulse rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

const meta = {
  title: 'UI/Navigation Loading Overlay',
  component: NavigationLoadingOverlay,
  decorators: [
    (Story) => (
      <MockNavigationLoadingProvider isNavigating={false}>
        <Story />
      </MockNavigationLoadingProvider>
    ),
  ],
} satisfies Meta<typeof NavigationLoadingOverlay>

export default meta

type Story = StoryObj<typeof meta>

export const Hidden: Story = {
  name: 'Hidden (Not Navigating)',
}

export const Loading: Story = {
  name: 'Loading State',
  render: () => <LoadingOverlayDemo />,
}
