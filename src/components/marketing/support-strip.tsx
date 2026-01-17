import Link from 'next/link'
import ButtonLink from '@/components/ui/button-link'

export default function SupportStrip() {
  return (
    <section className="border-border bg-card/60 border-t px-6 py-16 dark:bg-[#16202a]">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 text-center">
        <div className="space-y-3">
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">
            Support TidyResume
          </p>
          <h2 className="text-foreground text-3xl leading-tight font-bold md:text-4xl">
            Help this project grow
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
            TidyResume is open source and built with care. If it helped you,
            consider contributing code or supporting development to keep new
            features shipping.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <ButtonLink
            href="https://github.com/sponsors/tamarazuk"
            size="lg"
            className="shadow-primary/20 px-6 py-3 text-base font-semibold shadow-lg"
            target="_blank"
          >
            Sponsor on GitHub
          </ButtonLink>
          <ButtonLink
            href="https://buymeacoffee.com/tamarazuk"
            size="lg"
            variant="outline"
            className="px-6 py-3 text-base font-semibold"
            target="_blank"
          >
            Buy me a coffee
          </ButtonLink>
        </div>

        <div className="text-muted-foreground text-sm">
          Want to contribute?{' '}
          <Link
            className="text-primary font-semibold underline-offset-4 hover:underline"
            href="https://github.com/tamarazuk/tidyresume"
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore the repo
          </Link>
          .
        </div>
      </div>
    </section>
  )
}
