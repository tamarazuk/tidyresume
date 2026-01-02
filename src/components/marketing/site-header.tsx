import Link from 'next/link'
import AppIcon from '@/icons/app-icon'
import ThemeToggle from '@/components/ui/theme-toggle'
import HeaderCta from '@/components/marketing/header-cta'

export default function SiteHeader() {
  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="text-foreground flex items-center gap-3"
          aria-label="TidyResume home"
        >
          <div className="flex size-9 items-center justify-center">
            <AppIcon className="h-full w-full" />
          </div>
          <h2 className="text-lg leading-tight font-bold tracking-[-0.015em]">
            TidyResume
          </h2>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <HeaderCta />
        </div>
      </div>
    </header>
  )
}
