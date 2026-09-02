import type { CSSProperties, ReactNode, RefObject } from 'react'
import './stage.css'

/* ─────────────────────────────────────────────────────────────────────────────
   The one sticky implementation. spec 6.2: "Every sticky stage on this site is
   built to one identical structure, and no other structure is permitted."

     SECTION  position: relative; height: N × 100vh     ← the scroll budget
     └── STAGE  position: sticky; top: 0; height: 100vh; overflow: hidden
         ├── quiet lane — text, never moves during the sequence
         └── active lane — the thing that animates

   No ancestor of the stage may carry overflow: hidden, overflow: clip or a
   transform (spec 6.2), which is why the smoothing layer drives window scroll
   rather than wrapping the page — see lib/scroll.ts.
   ───────────────────────────────────────────────────────────────────────────── */

export type Ground = 'paper' | 'forest' | 'app'

interface StickyStageProps {
  id: string
  /** Section height in viewport heights, desktop. spec 8 page map. */
  budget: number
  /** Section height in viewport heights, mobile. */
  mobileBudget: number
  /** Some stages collapse to a static composition below 768px. spec 8.2, 8.6. */
  mobileSticky?: boolean
  ground?: Ground
  /** The element the scroll engine measures. From useStageProgress / useStageStep. */
  sectionRef?: RefObject<HTMLElement | null>
  quiet: ReactNode
  active: ReactNode
  /** Extra class on the section, for section-owned layout tuning. */
  className?: string
  labelledBy?: string
}

export function StickyStage({
  id,
  budget,
  mobileBudget,
  mobileSticky = true,
  ground = 'paper',
  sectionRef,
  quiet,
  active,
  className = '',
  labelledBy,
}: StickyStageProps) {
  const style = {
    '--budget': `${budget}svh`,
    '--budget-m': `${mobileBudget}svh`,
  } as CSSProperties

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby={labelledBy}
      style={style}
      data-sticky-mobile={mobileSticky ? 'true' : 'false'}
      className={`stage-section ground-${ground} ${ground === 'forest' ? 'on-forest' : ''} ${className}`}
    >
      <div className="stage">
        <div className="stage-lanes page">
          <div className="lane lane--quiet">{quiet}</div>
          <div className="lane lane--active">{active}</div>
        </div>
      </div>
    </section>
  )
}
