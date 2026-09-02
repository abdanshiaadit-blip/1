/**
 * The single sticky implementation. BRIEF.md Part 3.4.
 *
 * Built once, used five times. Every sticky stage on this site uses this
 * exact structure and no other:
 *
 *   SECTION   position: relative; height: N x 100vh      <- the scroll budget
 *   └── STAGE   position: sticky; top: 0; height: 100vh; overflow: hidden
 *       ├── CELL: text     (fixed box, crossfade only)
 *       └── CELL: stage    (fixed box, clipped, animates)
 *
 * A stage is exactly one viewport tall. Never taller. Never min-height.
 *
 * The section height IS the animation's scroll budget. If a sequence needs
 * more room, increase `vh` — never compress the sequence.
 *
 * No ancestor of the sticky element may have overflow: hidden, overflow: clip
 * or a transform. That is the number-one cause of "the sticky section broke",
 * so this component reports violations rather than leaving them to be found
 * in a screenshot three sessions later.
 */

import { useEffect, type ReactNode } from 'react'
import { useStageProgress } from '../lib/motion'
import Rule from './Rule'

interface Props {
  /** Scroll budget in viewport heights. 400vh for the app section, 180 for
   *  the silent build, and so on — the numbers come from Part 6. */
  vh: number
  /** Mobile budget. Several stages are not sticky at all on mobile; those
   *  sections use a plain flow section instead of this component. */
  vhMobile?: number
  name: string
  children: (progress: number, inView: boolean) => ReactNode
  className?: string
}

export default function StickyStage({ vh, vhMobile, name, children, className = '' }: Props) {
  const { ref, progress, inView, reduced } = useStageProgress<HTMLElement>()

  useEffect(() => {
    if (!import.meta.env.DEV) return
    const el = ref.current
    if (!el) return
    // Walk the ancestor chain and say so, loudly, if anything up there would
    // silently break position: sticky.
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const cs = getComputedStyle(p)
      const clipped = cs.overflow !== 'visible' && cs.overflow !== ''
      const transformed = cs.transform !== 'none' || cs.filter !== 'none' || cs.perspective !== 'none'
      if (clipped || transformed) {
        console.error(
          `[StickyStage:${name}] ancestor <${p.tagName.toLowerCase()}${
            p.className ? '.' + String(p.className).trim().split(/\s+/).join('.') : ''
          }> breaks sticky — overflow:${cs.overflow} transform:${cs.transform}. See BRIEF Part 3.4.`,
        )
      }
    }
  }, [name, ref])

  return (
    <section
      ref={ref}
      data-stage={name}
      className={`stage ${className}`}
      // Part 4.10: under reduced motion the stage collapses to a single
      // viewport rendering its final state, statically.
      style={{ '--stage-vh': reduced ? 100 : vh, '--stage-vh-m': reduced ? 100 : (vhMobile ?? vh) } as React.CSSProperties}
    >
      {/* Part 4.6: the same full-width rule that marks every other section
          boundary. Fourteen of them across the page, identical — their
          sameness is what makes the site read as one continuous document.
          Outside the pin, so it scrolls with the boundary rather than riding
          along with the stage. */}
      <div className="sec__horizon">
        <Rule origin="left" duration={900} tone="hairline" threshold={0.85} />
      </div>
      <div className="stage__pin">{children(progress, inView)}</div>
    </section>
  )
}
