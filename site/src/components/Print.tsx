/**
 * G2 · PRINT — content revealed by a mask travelling along the rule.
 * BRIEF.md Part 4.2.
 *
 * Not a fade. Not a slide. A hard-edged mask wipes in the rule's direction,
 * leaving content behind it, as though laid down by a print head.
 *
 * The discipline that keeps this site stable: **the content itself does not
 * move — only the mask moves.** A reveal costs zero layout, zero position
 * change, and cannot collide with a neighbour. That single property is what
 * makes Part 3's non-overlap constitution enforceable rather than aspirational.
 *
 * Stagger caps at five units. A six-item list prints as groups, never as six
 * separate beats — Part 4.4.
 */

import { Children, type ReactNode } from 'react'
import { usePrefersReducedMotion, useTriggered } from '../lib/motion'

export type PrintDirection = 'left' | 'right' | 'top'

interface Props {
  children: ReactNode
  direction?: PrintDirection
  /** Scroll-LINKED: 0–1. Omit for scroll-TRIGGERED. */
  progress?: number
  /** ms before the first unit prints. When composed with a rule, this is 55%
   *  of the rule's duration, so the two read as a single gesture (Part 4.2). */
  delay?: number
  duration?: number
  /** Treat each child as its own print unit, staggered. Without it the whole
   *  block prints as one unit — which is what long lists and the founder's
   *  note in 7.10 call for. */
  stagger?: boolean
  className?: string
  as?: 'div' | 'span' | 'p' | 'ul' | 'ol'
}

const MAX_UNITS = 5
const STAGGER_MS = 55

export default function Print({
  children,
  direction = 'left',
  progress,
  delay = 0,
  duration = 260,
  stagger = false,
  className = '',
  as: Tag = 'div',
}: Props) {
  const linked = progress !== undefined
  const reduced = usePrefersReducedMotion()
  const [ref, triggered] = useTriggered<HTMLDivElement>()

  const units = stagger ? Children.toArray(children) : [children]
  // Part 4.4: never more than five beats. Beyond five children the units are
  // grouped so a nine-item list prints as five groups, not nine ticks of
  // stagger that read as a loading screen.
  const perGroup = Math.ceil(units.length / MAX_UNITS)

  return (
    <Tag ref={ref as never} className={`print ${className}`}>
      {units.map((unit, i) => {
        const group = Math.floor(i / perGroup)
        const unitDelay = delay + group * STAGGER_MS
        // Part 4.10: masks render fully open.
        const open = reduced ? 1 : linked ? unitProgress(progress!, group) : triggered ? 1 : 0

        return (
          <span
            key={i}
            className="print__u m-anim"
            style={{
              clipPath: mask(direction, open),
              transition:
                linked || reduced
                  ? 'none'
                  : `clip-path ${duration}ms var(--ease-entrance) ${unitDelay}ms`,
            }}
          >
            {unit}
          </span>
        )
      })}
    </Tag>
  )
}

/** Each group opens across its own slice of the linked progress, so a
 *  scrubbed sequence still reads left-to-right rather than all at once. */
function unitProgress(p: number, group: number) {
  const lead = group * 0.12
  const t = (p - lead) / (1 - lead || 1)
  return t < 0 ? 0 : t > 1 ? 1 : t
}

/** inset() rather than an SVG mask: it composites on the GPU, needs no extra
 *  element, and clips exactly to the text box. */
function mask(direction: PrintDirection, open: number) {
  const closed = (1 - open) * 100
  switch (direction) {
    case 'left':
      return `inset(0 ${closed}% 0 0)`
    case 'right':
      return `inset(0 0 0 ${closed}%)`
    case 'top':
      return `inset(0 0 ${closed}% 0)`
  }
}
