import { StackIcon } from '@phosphor-icons/react/dist/ssr'

const RESUME_CARDS = [
  {
    label: 'Engineering',
    name: 'Jordan Lee',
    role: 'Senior Software Engineer',
    accent: 'bg-primary',
  },
  {
    label: 'Management',
    name: 'Jordan Lee',
    role: 'Engineering Manager',
    accent: 'bg-teal-500',
  },
  {
    label: 'Consulting',
    name: 'Jordan Lee',
    role: 'Technical Consultant',
    accent: 'bg-amber-500',
  },
] as const

export default function MultiResumeCallout() {
  return (
    <section className="border-border border-y px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
              <StackIcon size={16} weight="bold" aria-hidden />
              New Feature
            </div>
            <h2 className="text-foreground font-[family-name:var(--font-source-serif-4)] text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
              One tool.
              <br />
              Every version of your story.
            </h2>
          </div>
          <div className="md:col-span-7">
            <blockquote className="border-primary border-l-2 pl-6">
              <p className="text-foreground text-xl leading-relaxed font-medium italic md:text-2xl">
                &ldquo;Applying to a startup and a Fortune 500 with the same
                resume is like wearing sneakers to a black-tie dinner.&rdquo;
              </p>
            </blockquote>
            <p className="text-muted-foreground mt-6 pl-6 text-base leading-relaxed">
              With multi-resume support, create unlimited tailored versions. A
              concise one-pager for recruiters, a detailed technical resume for
              engineering roles, a leadership-focused version for management
              positions. Switch between them in a click, all from one place.
            </p>
          </div>
        </div>

        {/* Resume cards visual */}
        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {RESUME_CARDS.map((card) => (
            <div
              key={card.label}
              className="border-border bg-card group rounded-lg border p-6 transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  {card.label}
                </span>
                <div className={`h-2 w-2 rounded-full ${card.accent}`} />
              </div>
              <div className={`mb-3 h-0.5 w-12 rounded ${card.accent}`} />
              <div className="text-foreground font-[family-name:var(--font-source-serif-4)] text-base font-semibold">
                {card.name}
              </div>
              <div className="text-muted-foreground text-sm">{card.role}</div>
              <div className="mt-4 space-y-2">
                <div className="bg-muted h-2.5 w-full rounded" />
                <div className="bg-muted h-2.5 w-4/5 rounded" />
                <div className="bg-muted h-2.5 w-3/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
