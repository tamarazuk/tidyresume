import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Learn how TidyResume keeps your resume private and what changes if you publish a public link.',
}

export default function PrivacyPolicyPage() {
  return (
    <section className="px-6 py-16 md:py-24">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <div className="space-y-4">
          <h1 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed md:text-lg">
            TidyResume is built to keep your resume private by default. This
            policy explains what we collect today, and what will change if you
            choose to publish a public link in the future.
          </p>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-foreground text-xl font-semibold">
              Data you enter
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Your resume content stays in your browser while you edit. We don’t
              require an account, and we don’t store your resume on our servers.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-foreground text-xl font-semibold">Analytics</h2>
            <p className="text-muted-foreground leading-relaxed">
              We don’t use analytics or advertising cookies today. If we add
              analytics in the future, we’ll update this policy first and keep
              it limited to basic, privacy-friendly usage metrics (not your
              resume content).
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-foreground text-xl font-semibold">
              Publishing (coming soon)
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Publishing will let you generate a public, shareable link. When
              this feature launches, we’ll update this policy and you’ll be
              asked to confirm before anything is uploaded.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-foreground text-xl font-semibold">Updates</h2>
            <p className="text-muted-foreground leading-relaxed">
              If we change this policy, we’ll post the updated version on this
              page and note the date of the update.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
