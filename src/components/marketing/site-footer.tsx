import Link from 'next/link'
import {
  ArrowSquareOutIcon,
  FileTextIcon,
} from '@phosphor-icons/react/dist/ssr'

export default function SiteFooter() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="border-border bg-background border-t px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
        <div className="text-muted-foreground flex items-center gap-2">
          <FileTextIcon size={16} aria-hidden />
          <span className="text-sm font-semibold">TidyResume</span>
        </div>
        <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-8 text-sm font-medium">
          <Link
            className="hover:text-primary transition-colors"
            href="/privacy-policy"
          >
            Privacy Policy
          </Link>
          <Link
            className="hover:text-primary flex items-center gap-1 transition-colors"
            href="https://github.com/tamarazuk/tidyresume"
          >
            <span>Github</span>
            <ArrowSquareOutIcon size={14} aria-hidden />
          </Link>
        </div>
        <p className="text-muted-foreground text-sm">
          © {currentYear} All rights reserved
        </p>
      </div>
    </footer>
  )
}
