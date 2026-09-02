/**
 * C4 — two years of you (§10.3).
 *
 * Six draws over two years, connected by a thin line, trending gently
 * toward the in-range band. Deliberately quiet: it is a coda, not a
 * claim. Fades in as one element, never scrubbed.
 */

const W = 480
const H = 150
const PAD = { top: 18, right: 20, bottom: 28, left: 20 }

const Y_MIN = 105
const Y_MAX = 160
const BAND_TOP = 130

const DRAWS = [
  { month: 0, value: 145 },
  { month: 3, value: 125 },
  { month: 6, value: 118 },
  { month: 12, value: 121 },
  { month: 18, value: 114 },
  { month: 24, value: 112 },
]

const x = (month: number) => PAD.left + (month / 24) * (W - PAD.left - PAD.right)
const y = (value: number) => PAD.top + ((Y_MAX - value) / (Y_MAX - Y_MIN)) * (H - PAD.top - PAD.bottom)

const LINE = DRAWS.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(d.month)} ${y(d.value)}`).join(' ')

export function TwoYears() {
  return (
    <figure className="c4">
      <svg className="c4__svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="c4-title">
        <title id="c4-title">
          Six draws over two years, each a little lower than the last, settling inside the in-range band.
        </title>
        <rect
          x={PAD.left}
          y={y(BAND_TOP)}
          width={W - PAD.left - PAD.right}
          height={y(Y_MIN) - y(BAND_TOP)}
          fill="var(--color-signal-good)"
          opacity={0.14}
        />
        <path d={LINE} fill="none" stroke="var(--color-paper-on-dark-soft)" strokeWidth={1} />
        {DRAWS.map((d) => (
          <circle
            key={d.month}
            cx={x(d.month)}
            cy={y(d.value)}
            r={3}
            fill="var(--color-paper-on-dark)"
          />
        ))}
        <text className="c4__axis-label" x={PAD.left} y={H - 8}>
          Join
        </text>
        <text className="c4__axis-label" x={W - PAD.right} y={H - 8} textAnchor="end">
          Two years
        </text>
      </svg>
      <figcaption className="sr-only-h">
        The same marker across six draws over two years: 145, 125, 118, 121, 114 and 112 milligrams per
        decilitre, settling inside the in-range band.
      </figcaption>
    </figure>
  )
}
