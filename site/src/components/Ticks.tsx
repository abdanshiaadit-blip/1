/**
 * G3 · TICK — calibration marks confirm the measurement. BRIEF.md Part 4.2.
 *
 * Three to five short 1px marks along a rule, 40ms apart, 160ms each, opacity
 * only. The cheapest of the four moves and the one that makes everything look
 * like an instrument.
 *
 * Use it on every rule that carries a measurement or a set of items. **Never
 * on a purely structural rule** — Part 4.2 is explicit, and a tick field
 * sprayed across every hairline on the page stops being calibration and
 * becomes wallpaper.
 *
 * Laid out with flex, not absolute positioning: the marks are spaced by the
 * layout rather than placed on top of it, so there is nothing here that can
 * escape its cell or land on a neighbour (Part 3.6).
 */

import { usePrefersReducedMotion, useTriggered } from '../lib/motion'

interface Props {
  /** 3–5. The intro uses five on desktop and three on mobile. */
  count?: number
  /** ms before the first mark. Ticks land after content, not with it. */
  delay?: number
  length?: number
  orientation?: 'horizontal' | 'vertical'
  /**
   * Distance between marks, in px. Omit to spread them across the full width
   * of the rule, which is what the intro wants — one tick under each letter
   * of a centred wordmark.
   *
   * Give it a value when the marks are graduations on a measurement rather
   * than decoration on a label: an axis tick has to sit at its own interval,
   * not wherever the container edge happens to be.
   */
  gap?: number
  className?: string
}

const STEP_MS = 40
const FADE_MS = 160

export default function Ticks({
  count = 5,
  delay = 0,
  length = 6,
  orientation = 'horizontal',
  gap,
  className = '',
}: Props) {
  const reduced = usePrefersReducedMotion()
  const [ref, triggered] = useTriggered<HTMLDivElement>()
  const on = reduced || triggered

  return (
    <div
      ref={ref}
      className={`ticks ticks--${orientation} ${gap === undefined ? 'ticks--spread' : ''} ${className}`}
      style={gap === undefined ? undefined : { gap }}
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="ticks__t m-anim"
          style={{
            [orientation === 'horizontal' ? 'height' : 'width']: length,
            opacity: on ? 1 : 0,
            transition: reduced
              ? 'none'
              : `opacity ${FADE_MS}ms var(--ease-entrance) ${delay + i * STEP_MS}ms`,
          }}
        />
      ))}
    </div>
  )
}
