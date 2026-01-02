import CtaStrip from '@/components/marketing/cta-strip'
import FeatureGrid from '@/components/marketing/feature-grid'
import Hero from '@/components/marketing/hero'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Create a clean, professional resume in Markdown or use the guided editor. Export to PDF in seconds.',
}

export default function MarketingHome() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <CtaStrip />
    </>
  )
}
