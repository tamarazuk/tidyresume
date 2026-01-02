import Link from 'next/link'

export default function EditorNotFound() {
  return (
    <main className="editor-page flex h-full w-full flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-foreground text-2xl font-bold">Page not found</h1>
        <p className="text-muted-foreground text-sm">
          We could not find that editor page.
        </p>
        <Link className="text-primary text-sm font-semibold" href="/">
          Go back home
        </Link>
      </div>
    </main>
  )
}
