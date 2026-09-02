import type { Metadata, Viewport } from 'next'
import { Newsreader, Atkinson_Hyperlegible } from 'next/font/google'
import './globals.css'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { SkipLink } from '@/components/layout/SkipLink'
import { ScrollShell } from '@/components/layout/ScrollShell'
import { ScrollProgress } from '@/components/layout/ScrollProgress'
import { BodyProvider } from '@/context/BodyContext'
import { WaitlistProvider } from '@/components/waitlist/WaitlistProvider'

/**
 * §6.2 — two families, clearly distinct.
 *
 * Newsreader for display: a screen-first serif with modest contrast,
 * chosen over the high-contrast display serifs because HUMAN is calm,
 * not dramatic. The `opsz` axis is used honestly, set per size.
 *
 * Atkinson Hyperlegible for body: engineered for maximum letterform
 * distinction. Google Fonts serves it at 400 and 700 only, so the two
 * places the blueprint asks for an intermediate weight resolve to the
 * nearest real one — 700 for button labels, 400 for the toggle, where
 * colour and the underline carry the active state instead.
 */
const newsreader = Newsreader({
  subsets: ['latin'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-newsreader',
})

const atkinson = Atkinson_Hyperlegible({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-atkinson',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://humanhealth.in'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'HUMAN — Preventive health, built for India',
    template: '%s — HUMAN',
  },
  description:
    'Blood tests at home, results in plain words, the three things worth fixing, and a retest at week 12 to check they moved. Join the founding cohort.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'HUMAN',
    locale: 'en_IN',
    url: '/',
    title: 'HUMAN — Preventive health, built for India',
    description:
      'Blood tests at home, results in plain words, the three things worth fixing, and a retest at week 12 to check they moved.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'HUMAN — Know earlier. Act sooner.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HUMAN — Preventive health, built for India',
    description:
      'Blood tests at home, results in plain words, the three things worth fixing, and a retest at week 12 to check they moved.',
    images: ['/og.png'],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F3F5F2' },
    { media: '(prefers-color-scheme: dark)', color: '#102821' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

/** §16.1 — Organization only. There is no product to buy and no price,
 *  so there is no Product or Offer schema anywhere on this site. */
const ORGANISATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'HUMAN',
  url: SITE_URL,
  description: 'Preventive healthcare membership for India.',
  areaServed: 'IN',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${newsreader.variable} ${atkinson.variable}`}>
      <head>
        {/* Marks the document as scripted before first paint, so the
            no-JS presentation of the Body toggle never flashes (§11.4). */}
        <script
          dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add('js')` }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANISATION_SCHEMA) }}
        />
      </head>
      <body>
        <BodyProvider>
          <WaitlistProvider>
            <SkipLink />
            <ScrollProgress />
            <Nav />
            <main id="main">{children}</main>
            <Footer />
            <ScrollShell />
          </WaitlistProvider>
        </BodyProvider>
      </body>
    </html>
  )
}
