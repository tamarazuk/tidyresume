import {
  CodeIcon,
  FilePdfIcon,
  LinkSimpleIcon,
  UserMinusIcon,
} from '@phosphor-icons/react/dist/ssr'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const features = [
  {
    title: 'No account needed',
    description:
      'Start right away. Your resume stays in your browser while you build.',
    icon: UserMinusIcon,
  },
  {
    title: 'Markdown-first',
    description:
      'Write in plain text with Markdown. Quick to edit, easy to keep consistent.',
    icon: CodeIcon,
  },
  {
    title: 'Shareable link',
    description:
      'Public links are coming soon. For now, export a PDF to share anywhere.',
    icon: LinkSimpleIcon,
    comingSoon: true,
  },
  {
    title: 'PDF export',
    description: 'Download a clean, print-friendly PDF when you’re ready.',
    icon: FilePdfIcon,
  },
]

export default function FeatureGrid() {
  return (
    <section className="border-border bg-card/60 border-y px-6 py-20 dark:bg-[#16202a]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <div className="mx-auto flex max-w-2xl flex-col gap-4 text-center">
          <h2 className="text-foreground text-3xl leading-tight font-bold tracking-tight md:text-4xl">
            Why TidyResume?
          </h2>
          <p className="text-muted-foreground text-lg leading-normal">
            A simple workflow: write in Markdown, preview instantly, export a
            clean PDF.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                className="border-border hover:border-primary/50 transition-colors dark:bg-[#1a2632]"
              >
                <CardHeader className="gap-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-lg">
                      <Icon size={24} aria-hidden />
                    </div>
                    {feature.comingSoon ? (
                      <Badge variant="default">Coming soon</Badge>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-foreground text-lg leading-tight font-bold">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
