import {
  MarkdownLogoIcon,
  LightningIcon,
  LockSimpleIcon,
  FilePdfIcon,
  LinkSimpleIcon,
  StackIcon,
  UserMinusIcon,
  DevicesIcon,
} from '@phosphor-icons/react/dist/ssr'
import type { Icon } from '@phosphor-icons/react'

interface Feature {
  icon: Icon
  title: string
  desc: string
}

const FEATURES: Feature[] = [
  {
    icon: MarkdownLogoIcon,
    title: 'Markdown-native',
    desc: 'Write with the formatting language you already know. Focus on content, not alignment.',
  },
  {
    icon: LightningIcon,
    title: 'Instant preview',
    desc: 'Every keystroke renders live. No save-refresh cycle.',
  },
  {
    icon: UserMinusIcon,
    title: 'No account needed',
    desc: 'Start immediately. Drafts live in your browser. Nothing leaves your machine unless you say so.',
  },
  {
    icon: LockSimpleIcon,
    title: 'Private by default',
    desc: 'Your data stays local. Publishing is always opt-in.',
  },
  {
    icon: LinkSimpleIcon,
    title: 'One link to share',
    desc: 'Publish to a clean URL for LinkedIn or recruiters. Update anytime without resending.',
  },
  {
    icon: FilePdfIcon,
    title: 'PDF export',
    desc: 'One-click download. ATS-friendly, no watermarks, no surprises.',
  },
  {
    icon: StackIcon,
    title: 'Multiple resumes',
    desc: 'Create tailored versions for different roles. Switch in a click.',
  },
  {
    icon: DevicesIcon,
    title: 'Works everywhere',
    desc: 'Edit on your laptop, review on your phone. Fully responsive.',
  },
]

export default function Features() {
  return (
    <section className="border-border bg-card/60 border-y px-6 py-20 dark:bg-[#16202a]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-primary mb-3 font-mono text-sm font-medium tracking-widest uppercase">
              Capabilities
            </p>
            <h2 className="text-foreground font-[family-name:var(--font-source-serif-4)] text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
              Everything you need,
              <br />
              nothing you don&rsquo;t
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm text-base leading-relaxed">
            A focused toolset for building resumes that get you interviews.
          </p>
        </div>

        <div className="border-border border-t">
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="border-border grid grid-cols-[auto_1fr] items-start gap-6 border-b py-6 md:grid-cols-[theme(spacing.12)_theme(spacing.56)_1fr]"
              >
                <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                  <Icon size={20} aria-hidden />
                </div>
                <h3 className="text-foreground self-center text-lg font-bold">
                  {f.title}
                </h3>
                <p className="text-muted-foreground col-start-2 leading-relaxed md:col-start-3">
                  {f.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
