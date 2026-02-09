import {
  PencilSimpleIcon,
  EyeIcon,
  DownloadSimpleIcon,
} from '@phosphor-icons/react/dist/ssr'
import type { Icon } from '@phosphor-icons/react'

interface WorkflowStep {
  num: string
  icon: Icon
  title: string
  body: string
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    num: '01',
    icon: PencilSimpleIcon,
    title: 'Write',
    body: 'Open the editor and start writing in Markdown, or use the guided fields if you prefer structure.',
  },
  {
    num: '02',
    icon: EyeIcon,
    title: 'Preview',
    body: 'See your resume render in real-time. Tweak fonts, colors, and layout until it feels right.',
  },
  {
    num: '03',
    icon: DownloadSimpleIcon,
    title: 'Export & Share',
    body: 'Download a clean PDF or publish with a shareable link. Update anytime without resending.',
  },
]

export default function HowItWorks() {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-xl">
          <p className="text-primary mb-3 font-mono text-sm font-medium tracking-widest uppercase">
            Workflow
          </p>
          <h2 className="text-foreground font-[family-name:var(--font-source-serif-4)] text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
            Three steps to a polished resume
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {WORKFLOW_STEPS.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.num} className="group">
                <div className="mb-4 flex items-center gap-4">
                  <span className="text-primary/30 font-mono text-5xl leading-none font-bold">
                    {step.num}
                  </span>
                  <div className="bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
                    <Icon size={24} aria-hidden />
                  </div>
                </div>
                <h3 className="text-foreground mb-2 text-xl font-bold">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.body}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
