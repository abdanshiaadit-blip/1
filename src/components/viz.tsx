import { useEffect, useRef, useState, useId } from 'react'
import type { HealthState, LoopStage } from '../data/types'
import { LOOP_STAGES } from '../data/types'
import { stateClass } from './primitives'

/* ------------------------------------------------------------- count-up */

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

export function useCountUp(target: number, duration = 1400, decimals = 0) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf = 0
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setV(target)
      return
    }
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration)
      setV(Number((target * easeOutExpo(p)).toFixed(decimals)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, decimals])
  return v
}

/* -------------------------------------------------- Intelligence Panel
   The square done minimally: ONE thin stroked squircle, drawn straight onto
   the hero card, with the readout inside it.

   Two earlier attempts failed for opposite reasons. Sixty perimeter segments
   with a comet read as an LED strip. A dark slab read as an alien object in a
   light glass app. Both were the same mistake — adding material where the
   circle-to-square translation only ever needed a different outline.

   There is no nested surface here: a white card inside a white card is a
   ghost box. The square is the stroke. */

/** Rounded-square path starting at TOP CENTRE, clockwise, so the gauge fills
 *  from 12 o'clock rather than from a corner. */
function squirclePath(x: number, y: number, w: number, h: number, r: number) {
  const cx = x + w / 2
  return [
    `M${cx},${y}`,
    `L${x + w - r},${y}`,
    `A${r},${r} 0 0 1 ${x + w},${y + r}`,
    `L${x + w},${y + h - r}`,
    `A${r},${r} 0 0 1 ${x + w - r},${y + h}`,
    `L${x + r},${y + h}`,
    `A${r},${r} 0 0 1 ${x},${y + h - r}`,
    `L${x},${y + r}`,
    `A${r},${r} 0 0 1 ${x + r},${y}`,
    `L${cx},${y}`,
  ].join(' ')
}

export function IntelligencePanel({
  score,
  delta,
  size = 244,
}: {
  score: number
  delta?: number
  size?: number
}) {
  const uid = useId().replace(/:/g, '')
  const SW = 5
  const pad = SW / 2 + 1
  const side = size - pad * 2
  const r = side * 0.29

  const path = squirclePath(pad, pad, side, side, r)
  const perim = 4 * (side - 2 * r) + 2 * Math.PI * r

  const [len, setLen] = useState(0)
  const shown = useCountUp(score, 1700)

  useEffect(() => {
    const t = window.setTimeout(() => setLen((score / 100) * perim), 200)
    return () => window.clearTimeout(t)
  }, [score, perim])

  return (
    <div className="hi" style={{ width: size, height: size }}>
      <div className="hi__glow" aria-hidden="true" />

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="hi__svg">
        <defs>
          <linearGradient id={`g${uid}`} x1="4%" y1="96%" x2="96%" y2="4%">
            <stop offset="0%" stopColor="#00c98f" />
            <stop offset="52%" stopColor="#00b8c4" />
            <stop offset="100%" stopColor="#3f9be8" />
          </linearGradient>
        </defs>

        <path d={path} fill="none" stroke="var(--track-soft)" strokeWidth={SW} />
        <path
          d={path}
          fill="none"
          stroke={`url(#g${uid})`}
          strokeWidth={SW}
          strokeLinecap="round"
          strokeDasharray={perim}
          strokeDashoffset={perim - len}
          style={{ transition: 'stroke-dashoffset 1700ms cubic-bezier(.22,1,.36,1)' }}
        />
      </svg>

      <div className="hi__face">
        <div className="hi__label">Health Intelligence</div>
        <div className="hi__score num">{Math.round(shown)}</div>
        {delta !== undefined && <div className="hi__delta">+{delta} since baseline</div>}
      </div>
    </div>
  )
}

/* ------------------------------------------------------- Progress ring */

export function ProgressRing({
  value,
  total,
  size = 56,
  stroke = 5,
  state = 'stable',
  label,
}: {
  value: number
  total: number
  size?: number
  stroke?: number
  state?: HealthState
  label?: string
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = total > 0 ? Math.min(1, value / total) : 0
  const [len, setLen] = useState(0)
  useEffect(() => {
    const t = window.setTimeout(() => setLen(pct * c), 100)
    return () => window.clearTimeout(t)
  }, [pct, c])

  return (
    <div className={`pring ${stateClass(state)}`} style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--track)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--st)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - len}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(.22,1,.36,1)' }}
        />
      </svg>
      <div className="pring__mid num">{label ?? value}</div>
    </div>
  )
}

/* ------------------------------------------------------------ Sparkline */

export function Sparkline({
  data,
  state = 'stable',
  w = 72,
  h = 26,
}: {
  data: number[]
  state?: HealthState
  w?: number
  h?: number
}) {
  if (data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  // Floor the scale and centre the series. Normalising each sparkline to its
  // own min/max made a 0.2% move look identical to a 30% move — misleading on
  // health data. A genuinely flat marker now draws flat, through the middle.
  const span = Math.max(max - min, Math.abs(max) * 0.1, 1e-6)
  const lo = (max + min) / 2 - span / 2
  const pad = 3
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (w - pad * 2) + pad
    const y = h - pad - ((v - lo) / span) * (h - pad * 2)
    return [x, y] as const
  })
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const last = pts[pts.length - 1]

  return (
    <svg width={w} height={h} className={`spark ${stateClass(state)}`} aria-hidden="true">
      <path d={d} fill="none" stroke="var(--st)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="2.6" fill="var(--st)" />
    </svg>
  )
}

/* ---------------------------------------------------------- Trend chart */

export function TrendChart({
  points,
  state = 'stable',
  band,
  height = 148,
}: {
  points: { date: string; value: number; label?: string }[]
  state?: HealthState
  band?: { low: number; high: number }
  height?: number
}) {
  const gid = useId().replace(/:/g, '')
  const ref = useRef<SVGSVGElement>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true)
          io.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const w = 320
  const h = height
  const padX = 10
  const padY = 18
  const vals = points.map((p) => p.value)
  const lo = Math.min(...vals, band ? band.low : Infinity)
  const hi = Math.max(...vals, band ? band.high : -Infinity)
  const pad = (hi - lo) * 0.16 || 1
  const min = lo - pad
  const max = hi + pad
  const span = max - min || 1

  const X = (i: number) => (i / Math.max(1, points.length - 1)) * (w - padX * 2) + padX
  const Y = (v: number) => h - padY - ((v - min) / span) * (h - padY * 2)

  const line = points.map((p, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(p.value).toFixed(1)}`).join(' ')
  const area = `${line} L${X(points.length - 1).toFixed(1)},${h - padY} L${X(0).toFixed(1)},${h - padY} Z`

  return (
    <div className={`tchart ${stateClass(state)}`}>
      <svg ref={ref} viewBox={`0 0 ${w} ${h}`} className="tchart__svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`a${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--st)" stopOpacity="0.26" />
            <stop offset="100%" stopColor="var(--st)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {band && (
          <g className="tchart__band">
            <rect
              x="0"
              y={Y(band.high)}
              width={w}
              height={Math.max(2, Y(band.low) - Y(band.high))}
              fill="rgba(0,180,120,.1)"
            />
            <line
              x1="0"
              x2={w}
              y1={Y(band.high)}
              y2={Y(band.high)}
              stroke="rgba(0,180,120,.42)"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
            <line
              x1="0"
              x2={w}
              y1={Y(band.low)}
              y2={Y(band.low)}
              stroke="rgba(0,180,120,.42)"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
            <text x="2" y={Y(band.high) - 5} className="tchart__bandlabel">
              OPTIMAL
            </text>
          </g>
        )}

        <path d={area} fill={`url(#a${gid})`} className={`tchart__area ${on ? 'is-on' : ''}`} />
        <path
          d={line}
          fill="none"
          stroke="var(--st)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`tchart__line ${on ? 'is-on' : ''}`}
          pathLength={1}
        />
        {points.map((p, i) => (
          <circle
            key={p.date}
            cx={X(i)}
            cy={Y(p.value)}
            r={i === points.length - 1 ? 4.2 : 3}
            fill={i === points.length - 1 ? 'var(--st)' : '#fff'}
            stroke="var(--st)"
            strokeWidth="2"
            className={`tchart__pt ${on ? 'is-on' : ''}`}
            style={{ transitionDelay: `${420 + i * 90}ms` }}
          />
        ))}
      </svg>
      <div className="tchart__axis">
        {points.map((p) => (
          <span key={p.date} className="t-cap">
            {p.date}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ Range bar */

export function RangeBar({
  value,
  range,
  unit,
  state,
}: {
  value: number
  range: { low: number; high: number; optLow: number; optHigh: number; floor: number; ceil: number }
  unit: string
  state: HealthState
}) {
  const span = range.ceil - range.floor || 1
  const pct = (v: number) => ((v - range.floor) / span) * 100
  const clamp = (n: number) => Math.max(0, Math.min(100, n))
  const [pos, setPos] = useState(0)

  useEffect(() => {
    const t = window.setTimeout(() => setPos(clamp(pct(value))), 140)
    return () => window.clearTimeout(t)
  })

  return (
    <div className={`rbar ${stateClass(state)}`}>
      <div className="rbar__track">
        <div
          className="rbar__ref"
          style={{ left: `${clamp(pct(range.low))}%`, width: `${clamp(pct(range.high) - pct(range.low))}%` }}
        />
        <div
          className="rbar__opt"
          style={{ left: `${clamp(pct(range.optLow))}%`, width: `${clamp(pct(range.optHigh) - pct(range.optLow))}%` }}
        />
        <div className="rbar__mark" style={{ left: `${pos}%` }}>
          <span className="rbar__pin" />
        </div>
      </div>
      <div className="rbar__legend">
        <span className="t-cap">{range.floor}</span>
        <span className="rbar__now num">
          {value}
          <em>{unit}</em>
        </span>
        <span className="t-cap">{range.ceil}</span>
      </div>
      <div className="rbar__keys">
        <span className="rbar__key rbar__key--opt">Optimal {range.optLow}–{range.optHigh}</span>
        <span className="rbar__key rbar__key--ref">Lab range {range.low}–{range.high}</span>
      </div>
    </div>
  )
}

/* -------------------------------------------------------- Adherence grid */

export function AdherenceGrid({ days, weeks = 6 }: { days: (boolean | null)[]; weeks?: number }) {
  return (
    <div className="agrid" style={{ gridTemplateColumns: `repeat(7, 1fr)` }}>
      {days.slice(0, weeks * 7).map((d, i) => (
        <span
          key={i}
          className={`agrid__c ${d === true ? 'is-on' : d === false ? 'is-off' : 'is-future'}`}
          style={{ animationDelay: `${Math.min(600, i * 9)}ms` }}
        />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------ Loop strip */

const SHORT: Record<LoopStage, string> = {
  MEASURE: 'Measure',
  UNDERSTAND: 'Understand',
  PRIORITIZE: 'Prioritize',
  ACT: 'Act',
  'RE-MEASURE': 'Re-measure',
  LEARN: 'Learn',
  ADAPT: 'Adapt',
}

export function LoopStrip({
  stage,
  compact,
  onClick,
}: {
  stage: LoopStage
  compact?: boolean
  onClick?: () => void
}) {
  const idx = LOOP_STAGES.indexOf(stage)
  const Wrap = onClick ? 'button' : 'div'
  return (
    <Wrap
      className={`loop ${compact ? 'loop--compact' : ''}`}
      {...(onClick ? { type: 'button' as const, onClick } : {})}
    >
      <div className="loop__rail">
        {LOOP_STAGES.map((s, i) => (
          <div
            key={s}
            className={`loop__node ${i === idx ? 'is-now' : ''} ${i < idx ? 'is-past' : ''}`}
            style={{ transitionDelay: `${i * 55}ms` }}
          >
            <span className="loop__dot" />
            {!compact && <span className="loop__label">{SHORT[s]}</span>}
          </div>
        ))}
      </div>
    </Wrap>
  )
}

/* ------------------------------------------------------------ System viz */

export function SystemViz({ series, state, label }: { series: number[]; state: HealthState; label: string }) {
  const gid = useId().replace(/:/g, '')
  const w = 300
  const h = 84
  const min = Math.min(...series)
  const max = Math.max(...series)
  const span = max - min || 1
  const X = (i: number) => (i / Math.max(1, series.length - 1)) * (w - 16) + 8
  const Y = (v: number) => h - 14 - ((v - min) / span) * (h - 30)
  const line = series.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ')
  const area = `${line} L${X(series.length - 1)},${h} L${X(0)},${h} Z`

  return (
    <div className={`sviz ${stateClass(state)}`}>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="sviz__svg">
        <defs>
          <linearGradient id={`s${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--st)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--st)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#s${gid})`} />
        <path d={line} fill="none" stroke="var(--st)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={X(series.length - 1)} cy={Y(series[series.length - 1])} r="3.6" fill="var(--st)" />
      </svg>
      <div className="t-cap sviz__label">{label}</div>
    </div>
  )
}

/* ------------------------------------------------------------- CycleArc
   Phase-segmented cycle ring with a live day marker. Phases are derived
   from cycle length (ovulation ≈ length − 14), so an irregular 38-day
   cycle renders its own geometry rather than a generic 28-day template. */

export const CYCLE_PHASES = [
  { id: 'menstrual', name: 'Menstrual', color: '#e0356f' },
  { id: 'follicular', name: 'Follicular', color: '#f9a8c9' },
  { id: 'ovulatory', name: 'Ovulatory', color: '#00bd9c' },
  { id: 'luteal', name: 'Luteal', color: '#f2739f' },
] as const

function phaseSpans(length: number) {
  const ov = Math.max(8, length - 14)
  return [
    { ...CYCLE_PHASES[0], from: 0, to: 5 },
    { ...CYCLE_PHASES[1], from: 5, to: ov - 2 },
    { ...CYCLE_PHASES[2], from: ov - 2, to: ov + 2 },
    { ...CYCLE_PHASES[3], from: ov + 2, to: length },
  ]
}

export function CycleArc({
  day,
  length,
  size = 190,
}: {
  day: number
  length: number
  size?: number
}) {
  const stroke = size * 0.068
  const r = (size - stroke - size * 0.063) / 2
  const cx = size / 2
  const cy = size / 2
  const [on, setOn] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setOn(true), 140)
    return () => window.clearTimeout(t)
  }, [])

  // −90° puts day 0 at the top; a 1.2° gap keeps segments visually distinct.
  const angle = (d: number) => (d / length) * 360 - 90
  const pt = (d: number, radius = r) => {
    const a = (angle(d) * Math.PI) / 180
    return [cx + radius * Math.cos(a), cy + radius * Math.sin(a)] as const
  }
  const arc = (from: number, to: number) => {
    const [x1, y1] = pt(from)
    const [x2, y2] = pt(to)
    const large = to - from > length / 2 ? 1 : 0
    return `M${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${large} 1 ${x2.toFixed(2)},${y2.toFixed(2)}`
  }

  const spans = phaseSpans(length)
  const [mx, my] = pt(Math.min(day, length))

  return (
    <div className="carc" style={{ width: size, height: size, ['--carc' as string]: `${size}px` }}>
      <svg width={size} height={size} className="carc__svg">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--track-soft)" strokeWidth={stroke} />
        {spans.map((s) => (
          <path
            key={s.id}
            d={arc(s.from + 0.18, s.to - 0.18)}
            fill="none"
            stroke={s.color}
            strokeWidth={stroke}
            strokeLinecap="round"
            pathLength={1}
            className={`carc__seg ${on ? 'is-on' : ''}`}
            opacity={s.id === spans.find((x) => day >= x.from && day < x.to)?.id ? 1 : 0.42}
          />
        ))}
        {/* live day marker */}
        <circle
          cx={mx}
          cy={my}
          r={on ? size * 0.045 : 0}
          fill="#fff"
          stroke="var(--accent-women)"
          strokeWidth={size * 0.018}
          className="carc__mark"
        />
      </svg>
      <div className="carc__mid">
        <div className="carc__day num">{day}</div>
        <div className="carc__of">of ~{length}</div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------ ConnectionChart
   Two series that moved together. Each is normalised to its own range, so
   the shapes are comparable and the absolute values deliberately are not —
   the chart shows co-movement, and claims nothing about cause. */

export function ConnectionChart({
  pair,
}: {
  pair: {
    axis: string[]
    a: { label: string; values: number[]; unit: string }
    b: { label: string; values: number[]; unit: string }
  }
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true)
          io.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const w = 300
  const h = 96
  const padX = 8
  const padY = 14

  const norm = (vals: number[]) => {
    const lo = Math.min(...vals)
    const hi = Math.max(...vals)
    const span = hi - lo || 1
    return vals.map((v) => (v - lo) / span)
  }
  const X = (i: number, n: number) => (i / Math.max(1, n - 1)) * (w - padX * 2) + padX
  const Y = (t: number) => h - padY - t * (h - padY * 2)

  const line = (vals: number[]) =>
    norm(vals)
      .map((t, i) => `${i ? 'L' : 'M'}${X(i, vals.length).toFixed(1)},${Y(t).toFixed(1)}`)
      .join(' ')

  const series = [
    { ...pair.a, color: 'var(--accent-women)' },
    { ...pair.b, color: 'var(--accent-brand-2)' },
  ]

  return (
    <div className="cxn" ref={ref}>
      <div className="cxn__keys">
        {series.map((s) => (
          <span key={s.label} className="cxn__key">
            <i style={{ background: s.color }} />
            {s.label}
            <b className="num">
              {s.values[0]} → {s.values[s.values.length - 1]}
              <em>{s.unit}</em>
            </b>
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="cxn__svg">
        {series.map((s, si) => {
          const t = norm(s.values)
          return (
            <g key={s.label}>
              <path
                d={line(s.values)}
                fill="none"
                stroke={s.color}
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`cxn__line ${on ? 'is-on' : ''}`}
                pathLength={1}
                style={{ transitionDelay: `${si * 220}ms` }}
              />
              {t.map((v, i) => (
                <circle
                  key={i}
                  cx={X(i, s.values.length)}
                  cy={Y(v)}
                  r={i === t.length - 1 ? 4 : 2.8}
                  fill={i === t.length - 1 ? s.color : '#fff'}
                  stroke={s.color}
                  strokeWidth="2"
                  className={`cxn__pt ${on ? 'is-on' : ''}`}
                  style={{ transitionDelay: `${520 + si * 220 + i * 60}ms` }}
                />
              ))}
            </g>
          )
        })}
      </svg>
      <div className="cxn__axis">
        {pair.axis.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <p className="cxn__note">Each line is scaled to its own range. Shapes compare; values do not.</p>
    </div>
  )
}

/* ==========================================================================
   BIOLOGICAL AGE
   The same stroked-squircle instrument as the Health Intelligence panel,
   because Biological Age has to look like it has always been part of HUMAN.

   What the stroke means is different, and deliberately so: the gauge is
   SYMMETRIC about twelve o'clock. Twelve o'clock is your chronological age.
   The arc travels anticlockwise when the estimate is younger and clockwise
   when it is older, one half-turn per eight years. You can read the direction
   before you read the number — which is the whole point of the metric.
   ========================================================================== */

/** Years of gap that fill a half turn. Eight is wide enough that a realistic
 *  estimate never pins the gauge, and tight enough that a year is visible. */
const AGE_SPAN = 8

/** Split an age into whole years and one decimal, via the rounded tenth so a
 *  float like 32.999999 can never render as "32.10". */
export function splitAge(v: number) {
  const tenths = Math.round(v * 10)
  return { int: Math.floor(tenths / 10), dec: tenths % 10 }
}

export function BioAgeDial({
  estimate,
  chronological,
  size = 228,
  label = 'Biological age',
}: {
  estimate: number
  chronological: number
  size?: number
  label?: string
}) {
  const uid = useId().replace(/:/g, '')
  const SW = 5
  const pad = SW / 2 + 1
  const side = size - pad * 2
  const r = side * 0.29

  const path = squirclePath(pad, pad, side, side, r)
  const perim = 4 * (side - 2 * r) + 2 * Math.PI * r

  const delta = estimate - chronological
  const younger = delta < 0
  const frac = Math.min(1, Math.abs(delta) / AGE_SPAN) / 2

  const [len, setLen] = useState(0)
  const shown = useCountUp(estimate, 1700, 1)

  useEffect(() => {
    const t = window.setTimeout(() => setLen(frac * perim), 200)
    return () => window.clearTimeout(t)
  }, [frac, perim])

  const { int, dec } = splitAge(shown)

  return (
    <div className={`hi bage ${younger ? 'is-younger' : 'is-older'}`} style={{ width: size, height: size }}>
      <div className="hi__glow bage__glow" aria-hidden="true" />

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="hi__svg">
        <defs>
          <linearGradient id={`b${uid}`} x1="4%" y1="96%" x2="96%" y2="4%">
            {younger ? (
              /* Reversed against the Health Intelligence ramp, because the arc
                 is mirrored: this puts brand green at the drawn tip, so a
                 younger estimate reads green rather than blue. */
              <>
                <stop offset="0%" stopColor="#3f9be8" />
                <stop offset="48%" stopColor="#00b8c4" />
                <stop offset="100%" stopColor="#00c98f" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#e08c00" />
                <stop offset="60%" stopColor="#ef7a3a" />
                <stop offset="100%" stopColor="#f0602c" />
              </>
            )}
          </linearGradient>
        </defs>

        <path d={path} fill="none" stroke="var(--track-soft)" strokeWidth={SW} />

        {/* Twelve o'clock: your chronological age. The arc is measured from here. */}
        <line
          x1={size / 2}
          y1={pad - 4.5}
          x2={size / 2}
          y2={pad + 4.5}
          stroke="var(--hairline-strong)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Mirrored for a younger estimate, so the same clockwise geometry
            draws anticlockwise. The squircle is symmetric about this axis. */}
        <path
          d={path}
          fill="none"
          stroke={`url(#b${uid})`}
          strokeWidth={SW}
          strokeLinecap="round"
          strokeDasharray={perim}
          strokeDashoffset={perim - len}
          transform={younger ? `translate(${size},0) scale(-1,1)` : undefined}
          style={{ transition: 'stroke-dashoffset 1700ms cubic-bezier(.22,1,.36,1)' }}
        />
      </svg>

      <div className="hi__face">
        <div className="hi__label">{label}</div>
        <div className="bage__score num">
          {int}
          <span className="bage__dec">.{dec}</span>
        </div>
        <div className="bage__unit">years</div>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------- Delta pill
   One component so "3.4 years younger" reads identically everywhere. */

export function AgeDelta({
  delta,
  suffix = true,
  compact,
}: {
  delta: number
  suffix?: boolean
  compact?: boolean
}) {
  const abs = Math.abs(delta)
  const flat = abs < 0.15
  const younger = delta < 0
  const tone = flat ? 'is-flat' : younger ? 'is-younger' : 'is-older'
  const years = abs === 1 ? 'year' : 'years'

  return (
    <span className={`agedelta ${tone} ${compact ? 'agedelta--sm' : ''}`}>
      {!flat && (
        <svg width="9" height="11" viewBox="0 0 9 11" aria-hidden="true" className="agedelta__a">
          <path
            d={younger ? 'M4.5 1v9M1 6.6l3.5 3.4L8 6.6' : 'M4.5 10V1M1 4.4L4.5 1 8 4.4'}
            stroke="currentColor"
            strokeWidth="1.7"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <span className="num">
        {flat ? 'On track' : `${abs.toFixed(1)} ${years}`}
      </span>
      {!flat && suffix && <em>{younger ? 'younger' : 'older'}</em>}
    </span>
  )
}

/* -------------------------------------------------------------- Age bar
   Where a system's estimate sits against the chronological age. The tick is
   the member's real age; the bar runs from it to the estimate. */

export function AgeBar({
  estimate,
  chronological,
  span = AGE_SPAN,
  keys = true,
}: {
  estimate: number
  chronological: number
  span?: number
  /** The legend repeats badly down a list — show it once, above. */
  keys?: boolean
}) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setOn(true), 160)
    return () => window.clearTimeout(t)
  }, [])

  const delta = estimate - chronological
  const clamped = Math.max(-span, Math.min(span, delta))
  const mid = 50
  const width = on ? (Math.abs(clamped) / span) * 50 : 0
  const left = clamped < 0 ? mid - width : mid

  return (
    <div className={`agebar ${delta < 0 ? 'is-younger' : delta > 0.15 ? 'is-older' : 'is-flat'}`}>
      <div className="agebar__track">
        <span
          className="agebar__fill"
          style={{ left: `${left}%`, width: `${width}%` }}
        />
        <span className="agebar__tick" style={{ left: `${mid}%` }} />
      </div>
      {keys && (
        <div className="agebar__keys">
          <span className="t-cap">−{span}y</span>
          <span className="t-cap agebar__now">your age {chronological}</span>
          <span className="t-cap">+{span}y</span>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------ Age trend
   Two series on one axis, and here the axes genuinely are shared — both are
   years, so unlike ConnectionChart the values are directly comparable. The
   dashed line is the member's chronological age; the solid line is the
   estimate. Where the solid line crosses under the dashed one is the moment
   the estimate went from older to younger. */

export function AgeTrend({
  history,
  height = 156,
}: {
  history: { date: string; estimate: number; chronological: number; event?: string }[]
  height?: number
}) {
  const gid = useId().replace(/:/g, '')
  const ref = useRef<SVGSVGElement>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true)
          io.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const w = 320
  const h = height
  const padX = 12
  const padY = 22

  const all = history.flatMap((p) => [p.estimate, p.chronological])
  const lo = Math.min(...all)
  const hi = Math.max(...all)
  const pad = (hi - lo) * 0.28 || 1
  const min = lo - pad
  const max = hi + pad
  const span = max - min || 1

  const X = (i: number) => (i / Math.max(1, history.length - 1)) * (w - padX * 2) + padX
  const Y = (v: number) => h - padY - ((v - min) / span) * (h - padY * 2)

  const line = (key: 'estimate' | 'chronological') =>
    history.map((p, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(p[key]).toFixed(1)}`).join(' ')

  const last = history[history.length - 1]
  const younger = last.estimate < last.chronological

  return (
    <div className={`agetrend ${younger ? 'is-younger' : 'is-older'}`}>
      <div className="agetrend__keys">
        <span className="agetrend__key agetrend__key--est">
          <i /> Estimated biological age
        </span>
        <span className="agetrend__key agetrend__key--chr">
          <i /> Your chronological age
        </span>
      </div>

      <svg ref={ref} viewBox={`0 0 ${w} ${h}`} className="agetrend__svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`t${gid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--state-attention)" />
            <stop offset="100%" stopColor={younger ? 'var(--accent-brand)' : 'var(--state-attention)'} />
          </linearGradient>
        </defs>

        <path
          d={line('chronological')}
          fill="none"
          stroke="var(--text-4)"
          strokeWidth="1.6"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />

        <path
          d={line('estimate')}
          fill="none"
          stroke={`url(#t${gid})`}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`agetrend__line ${on ? 'is-on' : ''}`}
          pathLength={1}
        />

        {history.map((p, i) => (
          <circle
            key={p.date}
            cx={X(i)}
            cy={Y(p.estimate)}
            r={i === history.length - 1 ? 4.4 : 3}
            fill={i === history.length - 1 ? (younger ? 'var(--accent-brand)' : 'var(--state-attention)') : '#fff'}
            stroke={younger && i === history.length - 1 ? 'var(--accent-brand)' : 'var(--state-attention)'}
            strokeWidth="2"
            className={`agetrend__pt ${on ? 'is-on' : ''}`}
            style={{ transitionDelay: `${460 + i * 90}ms` }}
          />
        ))}
      </svg>

      <div className="agetrend__axis">
        {history.map((p) => (
          <span key={p.date} className="t-cap">
            {p.date}
          </span>
        ))}
      </div>
    </div>
  )
}
