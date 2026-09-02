import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://humanhealth.in'

const ROUTES = [
  '/',
  '/how-it-works',
  '/what-we-test',
  '/why-preventive',
  '/about',
  '/waitlist',
  '/privacy',
  '/terms',
  '/medical-disclaimer',
]

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '/' ? 1 : 0.6,
  }))
}
