import Hero from '@/components/marketing/hero'
import MultiResumeCallout from '@/components/marketing/multi-resume-callout'
import HowItWorks from '@/components/marketing/how-it-works'
import Features from '@/components/marketing/features'
import TrustSignals from '@/components/marketing/trust-signals'
import CtaSection from '@/components/marketing/cta-section'
import SupportSection from '@/components/marketing/support-section'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TidyResume',
  description:
    'Create a clean, professional resume in Markdown or use the guided editor. Export to PDF in seconds.',
}

export default function MarketingHome() {
  return (
    <>
      <Hero />
      <MultiResumeCallout />
      <HowItWorks />
      <Features />
      <TrustSignals />
      <CtaSection />
      <SupportSection />
    </>
  )
}
