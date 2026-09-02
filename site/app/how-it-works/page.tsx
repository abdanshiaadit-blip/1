import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/PageHeader'
import { Loop } from '@/components/sections/05Loop'
import { ProductWalkthrough } from '@/components/app-showcase/ProductWalkthrough'
import { Week12 } from '@/components/sections/10Week12'
import { Waitlist } from '@/components/sections/15Waitlist'

export const metadata: Metadata = {
  title: 'How it works',
  description:
    'The loop in detail: a blood test at home, every marker in plain words, the three things worth fixing this quarter, a daily plan, and a retest at week 12.',
  alternates: { canonical: '/how-it-works' },
}

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        title="How it works"
        lede="A loop that runs for years, not a report you buy once. This is the whole of it, in order."
      />
      <Loop />
      <ProductWalkthrough />
      <Week12 />
      <Waitlist />
    </>
  )
}
