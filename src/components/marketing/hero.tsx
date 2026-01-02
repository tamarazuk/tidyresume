import { FileTextIcon } from '@phosphor-icons/react/dist/ssr'
import { Badge } from '@/components/ui/badge'
import ButtonLink from '@/components/ui/button-link'

function HeroMockup() {
  return (
    <div
      className="resume-theme group relative mt-8 w-full text-left md:mt-12"
      aria-hidden="true"
    >
      <div className="from-primary absolute -inset-1 rounded-2xl bg-linear-to-r to-blue-600 opacity-25 blur transition duration-1000 group-hover:opacity-40 group-hover:duration-200" />
      <div className="border-border relative aspect-video w-full overflow-hidden rounded-xl border bg-gray-900 shadow-2xl md:aspect-16/10">
        <div className="flex h-full flex-col">
          <div className="border-border bg-muted flex h-10 items-center gap-2 border-b px-4">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <div className="text-muted-foreground flex-1 text-center font-mono text-xs">
              resume.md — Markdown Builder
            </div>
          </div>
          <div className="bg-background flex flex-1 overflow-hidden text-left">
            <div className="border-border text-muted-foreground hidden w-1/2 overflow-hidden border-r p-6 font-mono text-sm sm:block">
              <div className="text-primary"># Maya Sandoval</div>
              <div className="text-muted-foreground">
                ## Senior Software Engineer
              </div>
              <div className="text-muted-foreground mt-2">
                San Francisco, CA | maya@example.com | portfolio.example.dev
              </div>
              <div className="text-muted-foreground mt-4">## Experience</div>
              <div className="mt-4 text-blue-500">
                **Senior Software Engineer** @ Stripe
              </div>
              <div className="text-slate-400">*2022 - Present*</div>
              <div className="text-muted-foreground mt-2">
                - Architected a real-time fraud detection pipeline processing
                10M+ transactions daily
              </div>
              <div className="text-muted-foreground">
                - Led migration from monolith to microservices, reducing deploy
                times by 60%
              </div>
              <div className="text-muted-foreground">
                - Mentored 4 engineers and established team coding standards
              </div>
              <div className="mt-4 text-blue-500">
                **Software Engineer** @ Airbnb
              </div>
              <div className="text-slate-400">*2019 - 2022*</div>
              <div className="text-muted-foreground mt-2">
                - Built search ranking algorithms that improved booking
                conversion by 18%
              </div>
              <div className="text-muted-foreground">
                - Developed internal tooling used by 200+ engineers daily
              </div>
              <div className="text-muted-foreground">
                - Contributed to open-source design system components
              </div>
              <div className="mt-4 text-blue-500">
                **Junior Software Engineer** @ Notion
              </div>
              <div className="text-slate-400">*2017 - 2019*</div>
              <div className="text-muted-foreground mt-2">
                - Developed collaborative editing features using operational
                transforms
              </div>
              <div className="text-muted-foreground">
                - Reduced page load time by 35% through frontend optimization
              </div>
              <div className="text-muted-foreground">
                - Built automated testing suite covering 80% of core
                functionality
              </div>
              <div className="text-muted-foreground mt-4">## Skills</div>
              <div className="text-muted-foreground mt-2">
                - TypeScript, Python, Go
              </div>
              <div className="text-muted-foreground">
                - React, Node.js, PostgreSQL
              </div>
              <div className="text-muted-foreground">
                - AWS, Kubernetes, Docker
              </div>
              <div className="bg-muted mt-4 h-3 w-3/4 rounded" />
              <div className="bg-muted mt-2 h-3 w-1/2 rounded" />
            </div>
            <div className="bg-background relative w-full overflow-hidden p-8 sm:w-1/2">
              <div className="bg-muted/40 pointer-events-none absolute inset-0 sm:opacity-0" />
              <div className="border-border mb-4 border-b pb-4 text-left">
                <div className="text-foreground text-lg font-semibold">
                  MAYA SANDOVAL
                </div>
                <div className="text-primary text-sm">
                  Senior Software Engineer
                </div>
                <div className="text-muted-foreground mt-2 text-xs">
                  San Francisco, CA • maya@example.com • portfolio.example.dev
                </div>
              </div>
              <div className="text-muted-foreground space-y-4 text-left text-xs">
                <div>
                  <div className="text-primary mb-1 text-[11px] font-semibold tracking-wide uppercase">
                    Experience
                  </div>
                  <div className="text-foreground flex items-center justify-between">
                    <span className="font-medium">
                      Senior Software Engineer
                    </span>
                    <span className="text-muted-foreground text-xs">
                      2022 - Present
                    </span>
                  </div>
                  <div className="text-muted-foreground">Stripe</div>
                  <ul className="mt-2 list-disc space-y-1 pl-4">
                    <li>Architected a real-time fraud detection pipeline.</li>
                    <li>Led migration to microservices.</li>
                  </ul>
                </div>
                <div>
                  <div className="text-foreground flex items-center justify-between">
                    <span className="font-medium">Software Engineer</span>
                    <span className="text-muted-foreground text-xs">
                      2019 - 2022
                    </span>
                  </div>
                  <div className="text-muted-foreground">Airbnb</div>
                  <ul className="mt-2 list-disc space-y-1 pl-4">
                    <li>Improved search ranking conversion by 18%.</li>
                    <li>Built internal tooling for 200+ engineers.</li>
                  </ul>
                </div>
                <div>
                  <div className="text-foreground flex items-center justify-between">
                    <span className="font-medium">
                      Junior Software Engineer
                    </span>
                    <span className="text-muted-foreground text-xs">
                      2017 - 2019
                    </span>
                  </div>
                  <div className="text-muted-foreground">Notion</div>
                  <ul className="mt-2 list-disc space-y-1 pl-4">
                    <li>
                      Built collaborative editing with operational transforms.
                    </li>
                    <li>Reduced page load time by 35%.</li>
                  </ul>
                </div>
                <div>
                  <div className="text-primary mb-1 text-[11px] font-semibold tracking-wide uppercase">
                    Skills
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-primary/10 text-primary rounded-full px-2 py-1 text-[11px]">
                      TypeScript
                    </Badge>
                    <Badge className="bg-primary/10 text-primary rounded-full px-2 py-1 text-[11px]">
                      Python
                    </Badge>
                    <Badge className="bg-primary/10 text-primary rounded-full px-2 py-1 text-[11px]">
                      Go
                    </Badge>
                    <Badge className="bg-primary/10 text-primary rounded-full px-2 py-1 text-[11px]">
                      React
                    </Badge>
                    <Badge className="bg-primary/10 text-primary rounded-full px-2 py-1 text-[11px]">
                      Node.js
                    </Badge>
                    <Badge className="bg-primary/10 text-primary rounded-full px-2 py-1 text-[11px]">
                      PostgreSQL
                    </Badge>
                    <Badge className="bg-primary/10 text-primary rounded-full px-2 py-1 text-[11px]">
                      AWS
                    </Badge>
                    <Badge className="bg-primary/10 text-primary rounded-full px-2 py-1 text-[11px]">
                      Kubernetes
                    </Badge>
                    <Badge className="bg-primary/10 text-primary rounded-full px-2 py-1 text-[11px]">
                      Docker
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="px-6 py-12 md:py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 text-center">
        <div className="flex max-w-3xl flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-foreground text-4xl leading-tight font-black tracking-[-0.033em] md:text-6xl">
              Build a Professional Resume in{' '}
              <span className="text-primary">Markdown</span>.
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed md:text-xl">
              No signups, no paywalls. Just write in Markdown or use our guided
              editor, and export a PDF in seconds. Shareable URLs are coming
              soon.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <ButtonLink
              href="/edit"
              size="lg"
              className="shadow-primary/30 h-12 min-w-35 px-6 text-base shadow-xl"
            >
              Start Writing Now
            </ButtonLink>
          </div>
        </div>
        <HeroMockup />
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <FileTextIcon size={16} aria-hidden />
          <span>Live preview updates as you type.</span>
        </div>
      </div>
    </section>
  )
}
