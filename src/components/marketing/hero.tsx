import Link from 'next/link'
import { GithubLogoIcon } from '@phosphor-icons/react/dist/ssr'
import NavigatingCtaButton from '@/components/marketing/navigating-cta-button'

function EditorMockup() {
  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border shadow-xl">
      <div className="bg-muted border-border flex items-center gap-2 border-b px-5 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-400/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
          <div className="h-3 w-3 rounded-full bg-green-400/80" />
        </div>
        <span className="text-muted-foreground flex-1 text-center font-mono text-xs">
          resume.md
        </span>
      </div>
      <div className="grid md:grid-cols-2">
        {/* Editor side */}
        <div className="border-border bg-background p-8 font-mono text-sm md:border-r">
          <div className="text-primary"># Maya Sandoval</div>
          <div className="text-muted-foreground">
            ## Senior Software Engineer
          </div>
          <div className="text-muted-foreground mt-3">
            San Francisco, CA ・ maya@example.com ・ portfolio.example.dev
          </div>
          <div className="text-muted-foreground mt-4">+++</div>
          <div className="text-muted-foreground mt-3 leading-relaxed">
            Product-minded senior engineer with 7+ years building reliable,
            user-friendly web platforms. Strong in TypeScript/React, backend
            APIs, and performance.
          </div>
          <div className="text-muted-foreground mt-5">## Experience</div>
          <div className="mt-3 text-blue-500">
            **Senior Software Engineer** @ Stripe || *2022 — Present*
          </div>
          <div className="text-muted-foreground mt-2">
            - Architected a real-time fraud detection pipeline processing 10M+
            transactions daily
          </div>
          <div className="text-muted-foreground">
            - Led migration from monolith to microservices, reducing deploy
            times by 60%
          </div>
        </div>
        {/* Preview side */}
        <div className="bg-background p-8">
          <div className="mb-1 font-[family-name:var(--font-source-serif-4)] text-xl font-semibold">
            Maya Sandoval
          </div>
          <div className="text-muted-foreground font-medium">
            Senior Software Engineer
          </div>
          <div className="text-muted-foreground mt-2 text-xs">
            San Francisco, CA ・{' '}
            <span className="text-primary">maya@example.com</span> ・{' '}
            <span className="text-primary">portfolio.example.dev</span>
          </div>
          <div className="bg-primary/60 mt-3 h-0.5 w-full" />
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            Product-minded senior engineer with 7+ years building reliable,
            user-friendly web platforms. Strong in TypeScript/React, backend
            APIs, and performance.
          </p>
          <div className="mt-5">
            <div className="text-primary text-[11px] font-semibold tracking-widest uppercase">
              Experience
            </div>
            <div className="text-foreground mt-2 flex items-baseline justify-between">
              <span className="text-sm font-medium">
                Senior Software Engineer{' '}
                <span className="text-muted-foreground">@ Stripe</span>
              </span>
              <span className="text-muted-foreground text-xs italic">
                2022 — Present
              </span>
            </div>
            <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-4 text-sm">
              <li>
                Architected a real-time fraud detection pipeline processing 10M+
                transactions daily
              </li>
              <li>
                Led migration from monolith to microservices, reducing deploy
                times by 60%
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="px-6 pt-12 pb-20 md:pt-16 md:pb-28">
      <div className="mx-auto max-w-6xl">
        {/* Thin rule */}
        <div className="border-border mb-10 border-t" />

        <div className="grid gap-12 md:grid-cols-12">
          {/* Left column — headline */}
          <div className="md:col-span-7">
            <p className="text-primary mb-4 font-mono text-sm font-medium tracking-widest uppercase">
              Open-source resume builder
            </p>
            <h1 className="text-foreground font-[family-name:var(--font-source-serif-4)] text-5xl leading-[1.08] font-semibold tracking-tight md:text-7xl">
              Your career story,
              <br />
              told in <span className="text-primary italic">Markdown</span>.
            </h1>
          </div>

          {/* Right column — subhead + CTA */}
          <div className="flex flex-col justify-end md:col-span-5">
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              No signups, no paywalls. Write in Markdown or use the guided
              editor, export a polished PDF in seconds, and share with a single
              link. Now with{' '}
              <strong className="text-foreground">
                multi-resume management
              </strong>{' '}
              to maintain tailored resumes for every role.
            </p>
            <div className="flex flex-wrap gap-4">
              <NavigatingCtaButton
                href="/resumes"
                className="bg-primary text-primary-foreground shadow-primary-sm hover:shadow-primary-md inline-flex items-center gap-2.5 rounded-md px-7 py-3.5 text-base font-semibold transition-shadow"
              >
                Start Writing
              </NavigatingCtaButton>
              <Link
                href="https://github.com/tamarazuk/tidyresume"
                className="text-foreground border-border hover:bg-secondary inline-flex items-center gap-2.5 rounded-md border px-7 py-3.5 text-base font-semibold transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubLogoIcon size={18} aria-hidden />
                View Source
              </Link>
            </div>
          </div>
        </div>

        {/* Hero visual — editorial mockup */}
        <div className="mt-16 md:mt-20">
          <EditorMockup />
        </div>
      </div>
    </section>
  )
}
