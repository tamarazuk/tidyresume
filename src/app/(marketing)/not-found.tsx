import Link from 'next/link'

export default function MarketingNotFound() {
  return (
    <div className="px-6 py-16 md:py-24">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <h1 className="text-foreground text-2xl font-bold">Page not found</h1>
        <p className="text-muted-foreground text-sm">
          We could not find that page.
        </p>
        <Link className="text-primary text-sm font-semibold" href="/">
          Go back home
        </Link>
      </div>
    </div>
  )
}
