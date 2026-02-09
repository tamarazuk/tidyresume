import NavigatingCtaButton from '@/components/marketing/navigating-cta-button'

export default function CtaSection() {
  return (
    <section className="bg-primary px-6 py-16 text-white md:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-[family-name:var(--font-source-serif-4)] text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
          Your next role starts with a better resume
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-blue-100">
          Write in Markdown. Preview instantly. Export a clean PDF. Free,
          private, and open source.
        </p>
        <NavigatingCtaButton
          href="/resumes"
          className="text-primary mt-8 inline-flex items-center gap-2 rounded-md bg-white px-8 py-3.5 text-base font-bold shadow-lg transition-transform hover:scale-105"
        >
          Start Writing
        </NavigatingCtaButton>
      </div>
    </section>
  )
}
