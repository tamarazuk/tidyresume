import type { ReactNode } from 'react'
import SiteHeader from '@/components/marketing/site-header'
import SiteFooter from '@/components/marketing/site-footer'

interface MarketingLayoutProps {
  children: ReactNode
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="bg-background text-foreground flex min-h-screen w-full flex-col transition-colors duration-200">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
