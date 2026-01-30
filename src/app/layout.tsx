import type { Metadata } from 'next'
import {
  Geologica,
  IBM_Plex_Sans,
  IBM_Plex_Serif,
  Noto_Sans,
  Noto_Sans_Mono,
  Source_Serif_4,
} from 'next/font/google'
import ThemeProvider from '@/providers/theme-provider'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'
import '@/styles/globals.css'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tidyresume.tzuk.app'

const notoSans = Noto_Sans({
  variable: '--font-geist-sans',
  weight: ['400', '500'],
  subsets: ['latin'],
})

const geologica = Geologica({
  variable: '--font-heading',
  weight: ['600'],
  subsets: ['latin'],
})

const notoSansMono = Noto_Sans_Mono({
  variable: '--font-geist-mono',
  weight: ['400'],
  subsets: ['latin'],
})

const sourceSerif = Source_Serif_4({
  variable: '--font-source-serif-4',
  weight: ['400', '600'],
  subsets: ['latin'],
})

const ibmPlexSans = IBM_Plex_Sans({
  variable: '--font-ibm-plex-sans',
  weight: ['400', '500', '600'],
  subsets: ['latin'],
})

const ibmPlexSerif = IBM_Plex_Serif({
  variable: '--font-ibm-plex-serif',
  weight: ['400', '600'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'TidyResume - Markdown Resume Builder',
    template: '%s | TidyResume',
  },
  description:
    'Create a clean, professional resume in Markdown or use the guided editor. Publish instantly with a shareable URL and export to PDF. Free, no signup required.',
  openGraph: {
    title: 'TidyResume - Markdown Resume Builder',
    description:
      'Create a clean, professional resume in Markdown or use the guided editor. Publish instantly with a shareable URL and export to PDF. Free, no signup required.',
    url: siteUrl,
    siteName: 'TidyResume',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TidyResume - Markdown Resume Builder',
    description:
      'Create a clean, professional resume in Markdown or use the guided editor. Publish instantly with a shareable URL and export to PDF. Free, no signup required.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${notoSans.variable} ${notoSansMono.variable} ${geologica.variable} ${sourceSerif.variable} ${ibmPlexSans.variable} ${ibmPlexSerif.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex h-full flex-col font-sans antialiased">
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
