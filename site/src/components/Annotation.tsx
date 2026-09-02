/**
 * The annotation layer. BRIEF.md Part 7.5.1.
 *
 * "Connect a sentence to a pixel. The copy cell explains what a screen *does*;
 * the annotation points at the exact thing on screen that proves it. Without
 * this, she reads about the app and then looks at the app. With it, she is
 * taught."
 *
 * Three parts, nothing more: a 6px jade anchor ring, a **horizontal** 1px
 * leader (never diagonal, never curved, never elbowed), and a 2–5 word label
 * in the gutter.
 *
 * The label goes in the gutter OPPOSITE the anchor's horizontal half, so the
 * leader always has room to run and never crosses back over the screen.
 *
 * Five annotations on the entire website. Do not add a sixth.
 */

import { usePrefersReducedMotion } from '../lib/motion'

interface Props {
  label: string
  /** Normalised against the 390 x 844 screen area, so the anchor is correct at
   *  every viewport without re-authoring. */
  x: number
  y: number
  delay?: number
  mobile?: boolean
}

export default function Annotation({ label, x, y, delay = 0, mobile = false }: Props) {
  const reduced = usePrefersReducedMotion()
  const left = x < 0.5

  return (
    <span
      className={`anno ${left ? 'anno--right' : 'anno--left'} ${mobile ? 'anno--m' : ''}`}
      style={{ '--ax': x, '--ay': y } as React.CSSProperties}
      aria-hidden="true"
    >
      {/* The sequence is fixed and never overlaps a screen change: the dot
          appears, then the leader draws, then the label prints. 760ms total. */}
      {/* Part 4.10: under reduced motion the settled state is painted
          directly. The CSS animations start from the hidden state, so leaving
          them in place with a zero delay is not the poster version — with
          animations suppressed the parts would simply never appear. */}
      <span
        className="anno__dot m-anim"
        style={
          reduced
            ? { opacity: 1, animation: 'none' }
            : { animationDelay: `${delay}ms` }
        }
      />
      <span
        className="anno__leader m-anim"
        style={
          reduced
            ? { transform: 'none', animation: 'none' }
            : { animationDelay: `${delay + 160}ms` }
        }
      />
      <span
        className="anno__label t-telemetry m-anim"
        style={
          reduced
            ? { clipPath: 'inset(0 0 0 0)', animation: 'none' }
            : { animationDelay: `${delay + 500}ms` }
        }
      >
        {label}
      </span>
    </span>
  )
}
