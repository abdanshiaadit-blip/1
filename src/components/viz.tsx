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

/* --------------------------------------------------- Intelligence Ring
   The product's visual identity. Four things make it feel like a made object
   rather than a progress bar:

   1. A recessed track, so the score arc reads as raised out of a groove.
   2. A second, thinner arc at the BASELINE score. The gap between the two arcs
      is the improvement — the "+11" is visible, not just stated.
   3. A specular highlight that orbits forever, masked to the score arc so the
      light only travels through the coloured material.
   4. A breathing aura behind it. Transform + opacity only, so the permanent
      animation stays on the compositor.

   All looping motion is CSS, so prefers-reduced-motion halts it globally. */

export function IntelligenceRing({
  score,
  baseline,
  size = 212,
  stroke = 15,
}: {
  score: number
  baseline?: number
  size?: number
  stroke?: number
}) {
  const uid = useId().replace(/:/g, '')
  const cx = size / 2
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r

  // Baseline arc sits just inside the main stroke, with a hairline gap.
  const rBase = r - stroke / 2 - 6
  const cBase = 2 * Math.PI * rBase

  const [len, setLen] = useState(0)
  const [lenBase, setLenBase] = useState(0)
  const shown = useCountUp(score, 1500)

  useEffect(() => {
    const a = window.setTimeout(() => setLen((score / 100) * c), 120)
    const b = window.setTimeout(() => setLenBase(((baseline ?? 0) / 100) * cBase), 620)
    return () => {
      window.clearTimeout(a)
      window.clearTimeout(b)
    }
  }, [score, c, baseline, cBase])

  // Endpoint cap, in SVG coordinates (0deg at 12 o'clock).
  const endA = ((score / 100) * 360 - 90) * (Math.PI / 180)
  const ex = cx + r * Math.cos(endA)
  const ey = cx + r * Math.sin(endA)

  return (
    <div className="ring" style={{ width: size, height: size }}>
      <div className="ring__aura" aria-hidden="true" />

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="ring__svg">
        <defs>
          <linearGradient id={`g${uid}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#45d97f" />
            <stop offset="50%" stopColor="#00c2a6" />
            <stop offset="100%" stopColor="#0aa2e0" />
          </linearGradient>

          {/* Soft bloom for the glow pass and the endpoint cap. */}
          <filter id={`b${uid}`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" />
          </filter>

          {/* Confines the travelling highlight to the score arc only. */}
          <mask id={`m${uid}`}>
            <circle
              cx={cx}
              cy={cx}
              r={r}
              fill="none"
              stroke="#fff"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c - len}
              transform={`rotate(-90 ${cx} ${cx})`}
              style={{ transition: 'stroke-dashoffset 1500ms cubic-bezier(.22,1,.36,1)' }}
            />
          </mask>

          <radialGradient id={`s${uid}`}>
            <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#fff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>

          {/* Inner shadow that makes the empty track look cut into the card. */}
          <filter id={`i${uid}`}>
            <feOffset dy="1" />
            <feGaussianBlur stdDeviation="1.2" result="o" />
            <feComposite in="SourceGraphic" in2="o" operator="out" />
          </filter>
        </defs>

        {/* recessed track */}
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(6,42,38,.07)" strokeWidth={stroke} />
        <circle
          cx={cx}
          cy={cx}
          r={r + stroke / 2 - 0.5}
          fill="none"
          stroke="rgba(6,42,38,.05)"
          strokeWidth="1"
        />

        {/* baseline arc — the gap to the main arc is the improvement */}
        {baseline !== undefined && (
          <circle
            cx={cx}
            cy={cx}
            r={rBase}
            fill="none"
            stroke="rgba(0,189,156,.38)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={cBase}
            strokeDashoffset={cBase - lenBase}
            transform={`rotate(-90 ${cx} ${cx})`}
            style={{ transition: 'stroke-dashoffset 1300ms cubic-bezier(.22,1,.36,1)' }}
          />
        )}

        {/* glow pass */}
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke={`url(#g${uid})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - len}
          filter={`url(#b${uid})`}
          opacity="0.4"
          transform={`rotate(-90 ${cx} ${cx})`}
          style={{ transition: 'stroke-dashoffset 1500ms cubic-bezier(.22,1,.36,1)' }}
        />

        {/* crisp pass */}
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke={`url(#g${uid})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - len}
          transform={`rotate(-90 ${cx} ${cx})`}
          style={{ transition: 'stroke-dashoffset 1500ms cubic-bezier(.22,1,.36,1)' }}
        />

        {/* Travelling specular highlight, clipped to the arc. An ellipse rather
            than a circle: wider than tall means it smears ALONG the stroke and
            reads as light moving through it, not a ball rolling around it. */}
        <g mask={`url(#m${uid})`} className="ring__shine">
          <ellipse
            cx={cx}
            cy={stroke / 2 + 1}
            rx={stroke * 3.1}
            ry={stroke * 1.05}
            fill={`url(#s${uid})`}
          />
        </g>

        {/* Endpoint cap. The halo is white, not brand-coloured: the gradient's
            hue at the cap depends on the score, so any fixed colour would
            clash. White reads as light and matches every position. */}
        <g className="ring__cap">
          <circle cx={ex} cy={ey} r={stroke * 0.72} fill="#fff" filter={`url(#b${uid})`} opacity="0.85" />
          <circle cx={ex} cy={ey} r={stroke * 0.23} fill="#fff" />
        </g>
      </svg>

      <div className="ring__mid">
        <div className="ring__score num">{Math.round(shown)}</div>
        <div className="ring__label">Health Intelligence</div>
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
  const span = max - min || 1
  const pad = 3
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (w - pad * 2) + pad
    const y = h - pad - ((v - min) / span) * (h - pad * 2)
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
          style={{ transitionDelay: `${Math.min(600, i * 9)}ms` }}
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
  const stroke = 13
  const r = (size - stroke - 12) / 2
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
    <div className="carc" style={{ width: size, height: size }}>
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
          r={on ? 8.5 : 0}
          fill="#fff"
          stroke="var(--accent-women)"
          strokeWidth="3.5"
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
