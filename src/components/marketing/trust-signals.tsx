interface TrustSignal {
  stat: string
  label: string
  desc: string
}

const TRUST_SIGNALS: TrustSignal[] = [
  {
    stat: '100%',
    label: 'Free & open source',
    desc: 'No premium tier, no feature gates. MIT licensed.',
  },
  {
    stat: '0',
    label: 'Data collected',
    desc: 'No analytics, no tracking. Your resume stays yours.',
  },
  {
    stat: '∞',
    label: 'Resumes you can create',
    desc: 'Build as many tailored versions as you need, at no cost.',
  },
]

export default function TrustSignals() {
  return (
    <section className="px-6 py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        {TRUST_SIGNALS.map((item) => (
          <div key={item.label} className="text-center md:text-left">
            <div className="text-primary font-mono text-4xl font-bold">
              {item.stat}
            </div>
            <div className="text-foreground mt-2 text-lg font-bold">
              {item.label}
            </div>
            <p className="text-muted-foreground mt-1 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
