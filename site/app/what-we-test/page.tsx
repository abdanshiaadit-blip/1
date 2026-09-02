import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/PageHeader'
import { Panel } from '@/components/sections/06Panel'
import { Conditions } from '@/components/sections/12Conditions'
import { Waitlist } from '@/components/sections/15Waitlist'

export const metadata: Metadata = {
  title: 'What we test',
  description:
    'The 96-marker core panel everyone gets, and what we add on top of it for your body. Ferritin for every woman, testosterone for every man, and a hormone panel where symptoms call for it.',
  alternates: { canonical: '/what-we-test' },
}

export default function WhatWeTestPage() {
  return (
    <>
      <PageHeader
        title="What we test"
        lede="The same core panel for everyone, and a different set of additions depending on your body. Switch between them below."
      />
      <Panel />
      <Conditions />
      <Waitlist />
    </>
  )
}
