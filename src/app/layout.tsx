import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import ThemeProvider from '@/providers/theme-provider'
import '@/styles/globals.css'

// TODO: Set metadataBase once a public URL is available.
// const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tidyresume.com'

const geistSans = Geist({
  variable: '--font-geist-sans',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  // metadataBase: new URL(siteUrl),
  title: {
    default: 'TidyResume - Markdown Resume Builder',
    template: '%s | TidyResume',
  },
  description:
    'Create a clean, professional resume in Markdown or use the guided editor. Publish instantly with a shareable URL and export to PDF. Free, no signup required.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex h-full flex-col antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
