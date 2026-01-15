import { FileMagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr'
import SiteHeader from '@/components/marketing/site-header'
import SiteFooter from '@/components/marketing/site-footer'
import ButtonLink from '@/components/ui/button-link'

export default function ResumeNotFound() {
  return (
    <div className="bg-background text-foreground flex min-h-screen w-full flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center md:py-24">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="flex justify-center">
            <div className="bg-primary rounded-full p-4 shadow-sm">
              <FileMagnifyingGlassIcon
                size={64}
                className="text-primary-foreground"
              />
            </div>
          </div>{' '}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Oops! Resume not found
            </h1>
            <p className="text-muted-foreground text-lg">
              The resume you are looking for doesn&apos;t exist or has been
              deleted. Don&apos;t worry, you can create your own in minutes!
            </p>
          </div>
          <div className="flex flex-col justify-center gap-2 pt-4 min-[400px]:flex-row">
            <ButtonLink href="/" variant="default" size="lg">
              Build your resume
            </ButtonLink>
            <ButtonLink href="/" variant="outline" size="lg">
              Back to home
            </ButtonLink>
          </div>
          <p className="text-muted-foreground pt-4 text-sm">
            Have questions?{' '}
            <a
              href="mailto:tidyresume@tzuk.app"
              className="text-primary hover:underline"
            >
              Contact us
            </a>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
