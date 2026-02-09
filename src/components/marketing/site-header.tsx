'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import AppIcon from '@/icons/app-icon'
import ThemeToggle from '@/components/ui/theme-toggle'
import HeaderCta from '@/components/marketing/header-cta'

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 2)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-md transition-all duration-300 ease-in-out ${scrolled ? 'border-border/60' : 'border-transparent'}`}
    >
      <div
        className={`mx-auto flex w-full max-w-6xl items-center justify-between px-6 transition-all duration-300 ease-in-out ${scrolled ? 'py-3' : 'py-5'}`}
      >
        <Link
          href="/"
          className="text-foreground flex items-center gap-3"
          aria-label="TidyResume home"
        >
          <div className="flex size-9 items-center justify-center">
            <AppIcon className="h-full w-full" />
          </div>
          <h2 className="font-[family-name:var(--font-source-serif-4)] text-lg leading-tight font-semibold tracking-[-0.015em]">
            TidyResume
          </h2>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle buttonProps={{ className: 'text-muted-foreground' }} />
          <HeaderCta />
        </div>
      </div>
    </header>
  )
}
