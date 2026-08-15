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

/* --------------------------------------------------- Intelligence Ring */

export function IntelligenceRing({
  score,
  size = 208,
  stroke = 15,
}: {
  score: number
  size?: number
  stroke?: number
}) {
  const gid = useId().replace(/:/g, '')
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const [len, setLen] = useState(0)
  const shown = useCountUp(score, 1500)

  useEffect(() => {
    const t = window.setTimeout(() => setLen((score / 100) * c), 120)
    return () => window.clearTimeout(t)
  }, [score, c])

  return (
    <div className="ring" style={{ width: size, height: size }}>
      <div className="ring__glow" aria-hidden="true" />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="ring__svg">
        <defs>
          <linearGradient id={`g${gid}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4fe3c1" />
            <stop offset="48%" stopColor="#5cb8ff" />
            <stop offset="100%" stopColor="#a97bff" />
          </linearGradient>
          <filter id={`b${gid}`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,.065)"
          strokeWidth={stroke}
        />
        {/* glow pass */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#g${gid})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - len}
          filter={`url(#b${gid})`}
          opacity="0.55"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1500ms cubic-bezier(.22,1,.36,1)' }}
        />
        {/* crisp pass */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#g${gid})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - len}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1500ms cubic-bezier(.22,1,.36,1)' }}
        />
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
          stroke="rgba(255,255,255,.09)"
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
              fill="rgba(61,220,154,.055)"
            />
            <line
              x1="0"
              x2={w}
              y1={Y(band.high)}
              y2={Y(band.high)}
              stroke="rgba(61,220,154,.34)"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
            <line
              x1="0"
              x2={w}
              y1={Y(band.low)}
              y2={Y(band.low)}
              stroke="rgba(61,220,154,.34)"
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
            fill={i === points.length - 1 ? 'var(--st)' : 'var(--ink-800)'}
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

/* ------------------------------------------------------------ CycleWheel */

export function CycleWheel({ day, length, size = 132 }: { day: number; length: number; size?: number }) {
  const stroke = 9
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.min(1, day / length)
  const [len, setLen] = useState(0)
  useEffect(() => {
    const t = window.setTimeout(() => setLen(pct * c), 120)
    return () => window.clearTimeout(t)
  }, [pct, c])

  return (
    <div className="cwheel" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--accent-women)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - len}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1100ms cubic-bezier(.22,1,.36,1)' }}
        />
      </svg>
      <div className="cwheel__mid">
        <div className="cwheel__day num">{day}</div>
        <div className="t-cap">of ~{length}</div>
      </div>
    </div>
  )
}
