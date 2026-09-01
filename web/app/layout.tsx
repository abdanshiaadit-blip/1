import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import './device.css'
import './sections.css'
import { Header } from '@/components/ui/Header'
import { Chrome } from '@/components/ui/Chrome'

/**
 * Inter, self-hosted, in the three weights the site actually uses.
 *
 * Loaded through `next/font/local` rather than a stylesheet import for two
 * reasons that are both visible on screen: the files get a `<link rel=preload>`
 * in the head, so they arrive with the CSS instead of after it, and Next
 * generates a metric-matched fallback face so the text occupies the same box
 * before and after the swap. Without that, the headline re-wrapped from four
 * lines to three the moment Inter landed — a 0.03 layout shift on the first
 * thing anyone sees.
 */
const inter = localFont({
  src: [
    { path: './fonts/inter-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/inter-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './fonts/inter-latin-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-inter',
  /* Preloaded, and the reason is layout rather than speed. Inter only renders
     where SF Pro is absent — Android and Windows, most of this site's
     audience — and if it arrives after first paint the headline re-wraps from
     four lines to three in front of the reader. A metric-matched fallback is
     the usual answer, but it is only as reliable as the local face it stands
     on; a preload is not conditional on anything. The cost is 72KB fetched on
     an iPhone that will render SF Pro instead, and that is the cheaper of the
     two mistakes. */
  preload: true,
  adjustFontFallback: 'Arial',
  fallback: ['system-ui', 'sans-serif'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://human.health'),
  title: 'HUMAN — Understand your health before something feels wrong',
  description:
    'A preventive healthcare membership built for India. A blood test at home, results in plain English, the three things worth fixing, and a retest that shows whether it moved.',
  openGraph: {
    title: 'HUMAN — Understand your health before something feels wrong',
    description:
      'A preventive healthcare membership built for India. Working app prototype.',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#EEF3F2',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <a className="skip" href="#how">
          Skip to the content
        </a>
        <Chrome />
        <Header />
        <main id="top">{children}</main>
      </body>
    </html>
  )
}
