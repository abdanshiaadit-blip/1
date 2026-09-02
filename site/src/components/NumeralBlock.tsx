/**
 * BRIEF.md Part 9 component 13.
 *
 * A tabular odometer count-up and its caption. All figures on this site are
 * tabular lining figures, so nothing jitters while the number rolls.
 *
 * Scroll-linked, so it is reversible and idempotent: scrubbing back down
 * retraces exactly, and jumping to a position lands on the right value
 * without playing the frames in between. That is also what stops it being a
 * "counter that re-triggers on every pass", which Part 13 bans.
 */

import { usePrefersReducedMotion } from '../lib/motion'

interface Props {
  value: number
  suffix?: string
  caption: string
  /** 0–1 within this numeral's band of the section's scroll. */
  progress: number
  /** 0–1. As the next numeral arrives this one falls back to 20% rather than
   *  disappearing, so all three end as a column with the last one live. */
  dim: number
}

export default function NumeralBlock({ value, suffix = '', caption, progress, dim }: Props) {
  const reduced = usePrefersReducedMotion()
  const shown = reduced ? value : Math.round(value * progress)
  const opacity = progress === 0 ? 0 : 1 - dim * 0.8

  return (
    <div className="num" style={{ opacity }}>
      <p className="t-numeral-xl num__v">
        {shown}
        <span className="num__suffix">{suffix}</span>
      </p>
      <p className="t-body num__c">{caption}</p>
    </div>
  )
}
