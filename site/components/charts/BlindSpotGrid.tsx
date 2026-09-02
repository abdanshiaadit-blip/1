import { ICMR_SOURCE } from '@/lib/content'

/** A fixed scatter, computed once at module load, so the server and the
 *  browser always draw the same 43 dots and hydration never disagrees. */
const COLOURED = (() => {
  const indices = Array.from({ length: 100 }, (_, i) => i)
  let seed = 43
  for (let i = indices.length - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) % 2147483648
    const j = seed % (i + 1)
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return new Set(indices.slice(0, 43))
})()

/**
 * C2 — the blind spot (§10.3).
 *
 * A 10 × 10 dot grid: 43 in --signal-act, 57 in --mist. One SVG with 100
 * circles, animated by GSAP on the SVG children rather than by 100 React
 * nodes holding state. More legible than a donut, and considerably less
 * generic.
 */
export function BlindSpotGrid() {
  return (
    <figure className="c2">
      <svg
        className="c2__svg"
        viewBox="0 0 100 100"
        role="img"
        aria-labelledby="c2-title"
        data-c2
      >
        <title id="c2-title">
          A grid of 100 dots. 43 are marked to show the share of people with diabetes who do not know they
          have it.
        </title>
        {Array.from({ length: 100 }, (_, i) => {
          const row = Math.floor(i / 10)
          const column = i % 10
          const coloured = COLOURED.has(i)
          return (
            <circle
              key={i}
              data-c2-dot={coloured ? 'act' : 'base'}
              cx={column * 10 + 5}
              cy={row * 10 + 5}
              r={3}
              fill={coloured ? 'var(--color-signal-act)' : 'var(--color-paper-on-dark-soft)'}
            />
          )
        })}
      </svg>
      <figcaption className="t-caption c2__caption">
        43 of every 100 people who have diabetes do not know it. {ICMR_SOURCE}
      </figcaption>
    </figure>
  )
}
