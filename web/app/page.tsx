import { Hero } from '@/components/sections/Hero'
import { Problem } from '@/components/sections/Problem'
import { Idea } from '@/components/sections/Idea'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { AppSection } from '@/components/sections/App'
import { Signals } from '@/components/sections/Signals'
import { India } from '@/components/sections/India'
import { Close } from '@/components/sections/Close'

/* One page. Eight sections, in the order a stranger needs them: what this is,
   why it matters, what HUMAN does, what happens to you, the product in use,
   what it reads, why here, and who is building it. */
export default function Page() {
  return (
    <>
      <Hero />
      <Problem />
      <Idea />
      <HowItWorks />
      <AppSection />
      <Signals />
      <India />
      <Close />
    </>
  )
}
