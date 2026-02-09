import Link from 'next/link'

export default function SupportSection() {
  return (
    <section className="border-border border-t px-6 py-16">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-primary mb-2 text-sm font-semibold tracking-widest uppercase">
          Support the project
        </p>
        <h2 className="text-foreground font-[family-name:var(--font-source-serif-4)] text-2xl font-semibold md:text-3xl">
          Help TidyResume grow
        </h2>
        <p className="text-muted-foreground mx-auto mt-3 max-w-lg leading-relaxed">
          Open source and built with care. If it helped you, consider supporting
          development.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="https://github.com/sponsors/tamarazuk"
            className="bg-primary text-primary-foreground shadow-primary-sm rounded-md px-6 py-3 text-sm font-semibold"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sponsor on GitHub
          </Link>
          <Link
            href="https://buymeacoffee.com/tamarazuk"
            className="border-border text-foreground hover:bg-secondary rounded-md border px-6 py-3 text-sm font-semibold transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Buy me a coffee
          </Link>
        </div>
      </div>
    </section>
  )
}
