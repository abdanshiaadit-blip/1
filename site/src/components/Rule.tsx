/**
 * G1 · RULE — a line draws itself. BRIEF.md Part 4.2.
 *
 * The primitive almost every section is built from. Three origins are
 * permitted and no others: centre-out, left-to-right, top-down.
 *
 * A rule never fades in. It always draws. Opacity is not part of this
 * component's vocabulary, because "a rule that fades instead of drawing" is
 * on the Part 4.11 list of things that break the language.
 *
 * The rule occupies its full final box from first paint and animates only
 * `transform` (Part 3.3), so a drawing rule costs zero layout and cannot
 * collide with a neighbour.
 */

import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion, useTriggered } from '../lib/motion'

export type RuleOrigin = 'center' | 'left' | 'top'

interface Props {
  origin?: RuleOrigin
  /** Scroll-LINKED: 0–1, drives the draw directly and reverses exactly.
   *  Omit for scroll-TRIGGERED, which draws once and rests permanently. */
  progress?: number
  /** ms. `dur-rule` (680) standard, `dur-draw` (1400) for a full-width or
   *  charted rule. Nothing on this site animates longer than 1400ms. */
  duration?: number
  delay?: number
  /** `hairline-lit` by default. The horizon rules (Part 4.6) are the quiet
   *  ones: plain `hairline` at 40%. */
  tone?: 'lit' | 'hairline'
  thickness?: number
  className?: string
}

export default function Rule({
  origin = 'left',
  progress,
  duration = 680,
  delay = 0,
  tone = 'lit',
  thickness = 1,
  className = '',
}: Props) {
  const linked = progress !== undefined
  const reduced = usePrefersReducedMotion()
  const [ref, triggered] = useTriggered<HTMLDivElement>()

  // A drawn rule reads as one gesture with what prints onto it, so the two
  // must not fight over the same compositor layer mid-draw. will-change is
  // set for the duration of the draw and dropped after.
  const inner = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (linked || reduced || !triggered) return
    const el = inner.current
    if (!el) return
    el.style.willChange = 'transform'
    const t = window.setTimeout(
      () => {
        el.style.willChange = ''
      },
      duration + delay + 50,
    )
    return () => window.clearTimeout(t)
  }, [linked, reduced, triggered, duration, delay])

  const vertical = origin === 'top'
  // Part 4.10: rules render fully drawn under reduced motion.
  const drawn = reduced ? 1 : linked ? clamp(progress!) : triggered ? 1 : 0

  return (
    <div
      ref={ref}
      className={`rule ${vertical ? 'rule--v' : 'rule--h'} rule--${tone} ${className}`}
      style={vertical ? { width: thickness } : { height: thickness }}
      aria-hidden="true"
    >
      <span
        ref={inner}
        className="rule__ink m-anim"
        style={{
          transformOrigin: origin === 'center' ? 'center' : origin === 'left' ? 'left' : 'top',
          transform: vertical ? `scaleY(${drawn})` : `scaleX(${drawn})`,
          // A linked rule must land exactly where the scroll says it is, so it
          // carries no transition at all. Adding one would smooth the value
          // and break the "jump to a position, get the correct state" rule.
          transition:
            linked || reduced
              ? 'none'
              : `transform ${duration}ms var(--ease-instrument) ${delay}ms`,
        }}
      />
    </div>
  )
}

function clamp(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n
}
