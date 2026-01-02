'use client'

import { Button } from '@/components/ui/button'

interface EditorErrorProps {
  error: Error
  reset: () => void
}

export default function EditorError({ error, reset }: EditorErrorProps) {
  return (
    <main className="editor-page flex h-full w-full flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-foreground text-2xl font-bold">
          Editor failed to load
        </h1>
        <p className="text-muted-foreground text-sm">{error.message}</p>
        <Button type="button" onClick={reset} size="sm">
          Try again
        </Button>
      </div>
    </main>
  )
}
