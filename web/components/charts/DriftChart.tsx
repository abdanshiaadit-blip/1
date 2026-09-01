'use client'

/**
 * The drift.
 *
 * Nine years, flat inside the normal band and then rising out of it. The
 * values are illustrative and the chart says so, in a caption that is always
 * visible — there is no real cohort behind this and it must never look as
 * though there is.
 *
 * The line draws with `stroke-dashoffset`, which is a paint-only property, and
 * the segment that leaves the band is a second path in `--clay` revealed by
 * the same number. Nothing here animates layout.
 */

const YEARS = 9
const W = 1000
const H = 380
const PAD = 40

/* Flat for six years, then a long unhurried climb. Illustrative. */
const VALUES = [0.30, 0.31, 0.33, 0.35, 0.39, 0.46, 0.58, 0.74, 0.92]
const BAND_TOP = 0.62

const x = (i: number) => PAD + (i / (YEARS - 1)) * (W - PAD * 2)
const y = (v: number) => H - PAD - v * (H - PAD * 2)

function path(vals: number[], from = 0) {
  return vals
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i + from).toFixed(1)} ${y(v).toFixed(1)}`)
    .join(' ')
}

export function DriftChart() {
  const inBand = VALUES.slice(0, 7)
  const outOfBand = VALUES.slice(6)

  return (
    <>
      <svg
        className="prob__chart"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="An illustrative marker sitting inside the normal range for six years, then drifting above it by year nine."
        focusable="false"
      >
        <rect
          className="prob__band"
          x={PAD}
          y={y(BAND_TOP)}
          width={W - PAD * 2}
          height={H - PAD - y(BAND_TOP)}
          rx="6"
        />
        <text className="prob__tick" x={PAD} y={y(BAND_TOP) - 10}>
          NORMAL RANGE
        </text>

        {/* Drawn once, left to right, as the section is scrolled. */}
        <g
          style={{
            ['--d' as string]: 'clamp(0, calc((var(--p, 0) - 0.15) / 0.55), 1)',
          }}
        >
          <path
            className="prob__line"
            d={path(inBand)}
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset="calc(1 - clamp(0, calc((var(--p, 0) - 0.15) / 0.47), 1))"
          />
          <path
            className="prob__lineover"
            d={path(outOfBand, 6)}
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset="calc(1 - clamp(0, calc((var(--p, 0) - 0.62) / 0.12), 1))"
          />
          <circle
            className="prob__head-dot"
            cx={x(YEARS - 1)}
            cy={y(VALUES[YEARS - 1])}
            r="6"
            style={{ opacity: 'clamp(0, calc((var(--p, 0) - 0.72) / 0.06), 1)' }}
          />
        </g>
      </svg>

      {/* The accessible equivalent of the same chart. */}
      <table className="vh">
        <caption>Illustrative marker value by year, against a normal range.</caption>
        <thead>
          <tr>
            <th scope="col">Year</th>
            <th scope="col">Illustrative value</th>
            <th scope="col">Inside normal range</th>
          </tr>
        </thead>
        <tbody>
          {VALUES.map((v, i) => (
            <tr key={i}>
              <th scope="row">{i + 1}</th>
              <td>{v.toFixed(2)}</td>
              <td>{v < BAND_TOP ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export { YEARS }
