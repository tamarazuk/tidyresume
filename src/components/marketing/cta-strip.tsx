import ButtonLink from '@/components/ui/button-link'

export default function CtaStrip() {
  return (
    <section className="bg-primary px-6 py-12 text-white">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <h2 className="text-2xl font-bold md:text-3xl">
          A resume you can actually maintain
        </h2>
        <p className="max-w-xl text-blue-100">
          Write in Markdown, preview instantly, and export a clean PDF. <br />
          Easy to update whenever life changes.
        </p>
        <ButtonLink
          href="/edit"
          size="lg"
          className="text-primary bg-white px-8 py-3 text-lg font-bold shadow-lg transition-transform hover:scale-105 hover:bg-white"
        >
          Build your resume
        </ButtonLink>
      </div>
    </section>
  )
}
