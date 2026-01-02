'use client'

import { Button } from '@/components/ui/button'

interface MarketingErrorProps {
  error: Error
  reset: () => void
}

export default function MarketingError({ error, reset }: MarketingErrorProps) {
  return (
    <div className="px-6 py-16 md:py-24">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-foreground text-2xl font-bold">
            Something went wrong
          </h1>
          <p className="text-muted-foreground text-sm">{error.message}</p>
        </div>
        <Button type="button" onClick={reset} size="sm">
          Try again
        </Button>
      </div>
    </div>
  )
}
