import SiteHeader from '@/components/marketing/site-header'
import SiteFooter from '@/components/marketing/site-footer'
import ButtonLink from '@/components/ui/button-link'

export default function GlobalNotFound() {
  return (
    <div className="bg-background text-foreground flex min-h-screen w-full flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center md:py-24">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">404</h1>
            <h2 className="text-xl font-semibold tracking-tight">Page not found</h2>
            <p className="text-muted-foreground">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <ButtonLink href="/">Go back home</ButtonLink>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
