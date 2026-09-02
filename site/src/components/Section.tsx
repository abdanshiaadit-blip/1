/**
 * A flowing (non-sticky) section. Owns its scroll budget, its wash, and the
 * horizon rule that marks its top edge (Part 4.6).
 */

import type { ReactNode } from 'react'
import SectionWash from './SectionWash'
import Rule from './Rule'

interface Props {
  id: string
  /** Scroll budget in vh, from Part 6. A flowing section uses it as a
   *  minimum: content decides the real height, the budget sets the rhythm. */
  vh?: number
  vhMobile?: number
  wash?: boolean
  /** Part 4.6: fourteen identical full-width rules, one per boundary. Their
   *  sameness is what makes the site read as one continuous document. */
  horizon?: boolean
  children: ReactNode
  className?: string
}

export default function Section({
  id,
  vh,
  vhMobile,
  wash = false,
  horizon = true,
  children,
  className = '',
}: Props) {
  return (
    <section
      data-section={id}
      className={`sec ${className}`}
      style={
        {
          '--sec-vh': vh ?? 0,
          '--sec-vh-m': vhMobile ?? vh ?? 0,
        } as React.CSSProperties
      }
    >
      {wash && <SectionWash />}
      {horizon && (
        <div className="sec__horizon">
          <Rule origin="left" duration={900} tone="hairline" threshold={0.85} />
        </div>
      )}
      {children}
    </section>
  )
}
