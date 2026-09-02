import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/PageHeader'
import { Quiet } from '@/components/sections/02Quiet'
import { Scale } from '@/components/sections/03Scale'
import { Ledger } from '@/components/sections/04Ledger'
import { India } from '@/components/sections/13India'
import { Waitlist } from '@/components/sections/15Waitlist'

export const metadata: Metadata = {
  title: 'Why preventive health',
  description:
    '101 million Indians live with diabetes and 136 million more are close to it. 43 of every 100 who have it do not know. A blood test would find every one of them.',
  alternates: { canonical: '/why-preventive' },
}

export default function WhyPreventivePage() {
  return (
    <>
      <PageHeader
        title="Why preventive health"
        lede="The case for testing early, and the numbers it rests on. Every figure here carries its source."
      />
      <Quiet />
      <Scale />
      <Ledger />
      <India />
      <Waitlist />
    </>
  )
}
