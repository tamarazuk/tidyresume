import {
  LockSimpleIcon,
  FilePdfIcon,
  LinkSimpleIcon,
  UserMinusIcon,
  DevicesIcon,
  LayoutIcon,
  LightningIcon,
  MarkdownLogoIcon,
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
    icon: MarkdownLogoIcon,
    title: 'Just write',
    description:
      'Markdown handles the formatting so you can focus on what you actually did.',
  },
  {
    icon: LightningIcon,
    title: 'See it instantly',
    description:
      'Live preview updates as you type. No more save, refresh, squint.',
  },
  {
    icon: UserMinusIcon,
    title: 'No account needed',
    description:
      'Start building immediately. No sign-up forms, no email verification.',
  },
  {
    icon: LockSimpleIcon,
    title: 'Private by default',
    description:
      'Drafts stay in your browser. We only store it if you choose to publish.',
  },
  {
    icon: LinkSimpleIcon,
    title: 'One link to share',
    description:
      'Publish to get a clean URL you can drop in LinkedIn or send to recruiters. Update anytime without resending.',
  },
  {
    icon: FilePdfIcon,
    title: 'PDF when you need it',
    description:
      'One-click download or print from your browser. ATS-friendly, no watermarks.',
  },
  {
    icon: LayoutIcon,
    title: 'Multiple templates',
    description: 'Switch layouts without rewriting anything.',
    comingSoon: true,
  },
  {
    icon: DevicesIcon,
    title: 'Works everywhere',
    description: 'Edit on your laptop, check it on your phone.',
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
