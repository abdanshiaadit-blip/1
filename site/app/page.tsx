import { Hero } from '@/components/sections/01Hero'
import { Quiet } from '@/components/sections/02Quiet'
import { Scale } from '@/components/sections/03Scale'
import { Ledger } from '@/components/sections/04Ledger'
import { Loop } from '@/components/sections/05Loop'
import { Panel } from '@/components/sections/06Panel'
import { ProductWalkthrough } from '@/components/app-showcase/ProductWalkthrough'
import { Week12 } from '@/components/sections/10Week12'
import { Refusals } from '@/components/sections/11Refusals'
import { Conditions } from '@/components/sections/12Conditions'
import { India } from '@/components/sections/13India'
import { People } from '@/components/sections/14People'
import { Waitlist } from '@/components/sections/15Waitlist'

/**
 * The home page is the whole argument, in a fixed order (§4):
 *
 *   what is this → why should I care → isn't this already solved →
 *   so what do you actually do → what exactly do you test →
 *   what will I see → what is different about you → is this built for me →
 *   what do I do now
 *
 * Sections 07, 08 and 09 live inside ProductWalkthrough because they
 * share one sticky rail (§9.4).
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Quiet />
      <Scale />
      <Ledger />
      <Loop />
      <Panel />
      <ProductWalkthrough />
      <Week12 />
      <Refusals />
      <Conditions />
      <India />
      <People />
      <Waitlist />
    </>
  )
}
