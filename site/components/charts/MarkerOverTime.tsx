/**
 * C3 — the marker over time (§10.3). The emotional centrepiece.
 *
 * One marker, three points: enrolment, week 12, month 6. An "in range"
 * band sits behind. The starting value is above the band; the week-12
 * value is inside it. Two labelled points. Nothing else on the chart.
 *
 * The resting state is the finished chart (Law 1). Section 10's timeline
 * drives it backwards from here, scrubbed to scroll, addressing elements
 * by their data attributes. The path carries a `pathLength`, so the draw
 * is resolution-independent and no pixel length is ever computed — 100
 * rather than 1, because GSAP rounds stroke-dashoffset to whole units and
 * a 0–1 range would collapse into an on/off switch.
 */

const W = 640
const H = 280
const PAD = { top: 28, right: 96, bottom: 40, left: 56 }

// LDL cholesterol, mg/dL. 145 at enrolment, 125 at week 12 — a fall of 14%.
const Y_MIN = 100
const Y_MAX = 165
const BAND_TOP = 130

const POINTS = [
  { label: 'Enrolment', value: 145, tone: 'act' },
  { label: 'Week 12', value: 125, tone: 'good' },
  { label: 'Month 6', value: 118, tone: 'good' },
] as const

const x = (index: number) =>
  PAD.left + (index / (POINTS.length - 1)) * (W - PAD.left - PAD.right)
const y = (value: number) =>
  PAD.top + ((Y_MAX - value) / (Y_MAX - Y_MIN)) * (H - PAD.top - PAD.bottom)

const LINE = POINTS.map((point, index) => `${index === 0 ? 'M' : 'L'} ${x(index)} ${y(point.value)}`).join(' ')

export function MarkerOverTime() {
  return (
    <figure className="c3">
      <svg
        className="c3__svg"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-labelledby="c3-title"
      >
        <title id="c3-title">
          One member’s LDL cholesterol over three draws: 145 mg/dL at enrolment, above the in-range band;
          125 at week 12, inside it; 118 at month 6.
        </title>

        <g data-c3-axis>
          {[110, 130, 150].map((value) => (
            <line
              key={value}
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(value)}
              y2={y(value)}
              stroke="var(--color-rule-on-dark)"
              strokeWidth={1}
            />
          ))}
          {[110, 130, 150].map((value) => (
            <text
              key={value}
              className="c3__axis-label"
              x={PAD.left - 12}
              y={y(value)}
              textAnchor="end"
              dominantBaseline="middle"
            >
              {value}
            </text>
          ))}
        </g>

        {/* The one permitted area fill on the site: the in-range band. */}
        <g data-c3-band>
          <rect
            x={PAD.left}
            y={y(BAND_TOP)}
            width={W - PAD.left - PAD.right}
            height={y(Y_MIN) - y(BAND_TOP)}
            fill="var(--color-signal-good)"
            opacity={0.14}
          />
          <text className="c3__band-label" x={W - PAD.right + 12} y={y(115)} dominantBaseline="middle">
            In range
          </text>
        </g>

        <path
          data-c3-line
          d={LINE}
          fill="none"
          stroke="var(--color-paper-on-dark)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={0}
        />

        {POINTS.map((point, index) => (
          <g key={point.label} data-c3-point={index}>
            <circle
              cx={x(index)}
              cy={y(point.value)}
              r={5}
              fill={point.tone === 'act' ? 'var(--color-signal-act)' : 'var(--color-signal-good)'}
            />
            {index < 2 && (
              <>
                <text
                  className="c3__point-value"
                  x={x(index)}
                  y={y(point.value) - 18}
                  textAnchor={index === 0 ? 'start' : 'middle'}
                >
                  {point.value}
                </text>
                <text
                  className="c3__point-label"
                  x={x(index)}
                  y={H - 12}
                  textAnchor={index === 0 ? 'start' : 'middle'}
                >
                  {point.label}
                </text>
              </>
            )}
          </g>
        ))}
      </svg>
      <figcaption className="sr-only-h">
        LDL cholesterol, in milligrams per decilitre: 145 at enrolment, 125 at week 12, 118 at month 6. The
        in-range band is anything below 130. An illustration of one member’s result, not a typical outcome.
      </figcaption>
    </figure>
  )
}
