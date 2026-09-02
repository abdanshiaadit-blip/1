import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react'
import { sampleData } from '../copy'
import { useCountUp } from '../lib/hooks'
import { scrollToId } from '../lib/scroll'
import './ui.css'

/* The component inventory · spec 10. Twelve components; if a thirteenth is
   needed, something in the design has gone wrong. There is no Card. */

/* ── 1 & 2 · Button ────────────────────────────────────────────────────────── */

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'ghost'
  /** In-page anchor. spec 2.2: the secondary action is a scroll, not a link away. */
  to?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
  ariaLabel?: string
}

export function Button({
  children,
  variant = 'primary',
  to,
  onClick,
  type = 'button',
  className = '',
  ariaLabel,
}: ButtonProps) {
  const cls = `btn btn--${variant} ${className}`

  if (to) {
    return (
      <a
        href={`#${to}`}
        className={cls}
        aria-label={ariaLabel}
        onClick={(e) => {
          e.preventDefault()
          scrollToId(to)
          onClick?.()
        }}
      >
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={cls} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  )
}

/* ── 3 · TextLink · spec 10: ink, 1px underline offset 4px. No arrow. ──────── */

export function TextLink({ children, to }: { children: ReactNode; to: string }) {
  return (
    <a
      href={`#${to}`}
      className="text-link"
      onClick={(e) => {
        e.preventDefault()
        scrollToId(to)
      }}
    >
      {children}
    </a>
  )
}

/* ── The permitted glyphs · spec 3.6. There is no icon set on this site.
   A hairline check, a hairline circle, a chevron, and the share glyph.
   Nothing appears larger than 20px. ─────────────────────────────────────────── */

export function CheckGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={`glyph ${className}`} viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
      <path
        d="M4 10.5 8 14.5 16 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function OpenGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={`glyph ${className}`} viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
      <circle cx="10" cy="10" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function ChevronGlyph({ open = false }: { open?: boolean }) {
  return (
    <svg
      className="glyph glyph--chevron"
      data-open={open ? 'true' : 'false'}
      viewBox="0 0 20 20"
      width="20"
      height="20"
      aria-hidden="true"
    >
      <path
        d="M5 8 10 13 15 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ShareGlyph() {
  return (
    <svg className="glyph" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
      <path
        d="M10 13V3m0 0L6.5 6.5M10 3l3.5 3.5M4 12v3.5A1.5 1.5 0 0 0 5.5 17h9a1.5 1.5 0 0 0 1.5-1.5V12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ── 9 · Chart shell · spec 9.1: every chart carries "Sample data" in micro
   ink-3, bottom right, permanently — and a text alternative. spec 12. ──────── */

export function Figure({
  alt,
  children,
  className = '',
  note = sampleData,
  style,
}: {
  alt: string
  children: ReactNode
  className?: string
  note?: string
  style?: CSSProperties
}) {
  return (
    <figure className={`figure ${className}`} style={style}>
      <div className="figure__body">{children}</div>
      <figcaption className="figure__note t-micro">{note}</figcaption>
      <p className="sr-only">{alt}</p>
    </figure>
  )
}

/* ── 8 · NumeralBlock · spec 8.2. Tabular count-up plus caption. ───────────── */

export function NumeralBlock({
  value,
  unit,
  caption,
  active,
  dimmed = false,
}: {
  value: number
  unit: string
  caption: string
  active: boolean
  dimmed?: boolean
}) {
  const shown = useCountUp(value, active)
  return (
    <div className="numeral-block" data-dimmed={dimmed ? 'true' : 'false'}>
      <p className="t-numeral-xl numeral-block__value">
        {shown} <span className="numeral-block__unit">{unit}</span>
      </p>
      <p className="t-body numeral-block__caption">{caption}</p>
    </div>
  )
}

/* ── 9.3 · The range bar. mist track, an optional population band at 40%, a
   hairline tick for the previous value, a forest tick for the current one —
   the only element with full contrast. Never traffic-lit. Never red. ───────── */

export function RangeBar({
  previous,
  current,
  band,
  previousLabel,
  currentLabel,
}: {
  previous: number
  current: number
  band?: [number, number]
  previousLabel: string
  currentLabel: string
}) {
  const pct = (n: number): string => `${Math.min(100, Math.max(0, n * 100))}%`
  return (
    <div className="range-bar">
      <div className="range-bar__track">
        {band ? (
          <span
            className="range-bar__band"
            style={{ left: pct(band[0]), width: pct(band[1] - band[0]) }}
          />
        ) : null}
        <span className="range-bar__tick range-bar__tick--previous" style={{ left: pct(previous) }} />
        <span className="range-bar__tick range-bar__tick--current" style={{ left: pct(current) }} />
      </div>
      <div className="range-bar__labels t-micro">
        <span style={{ left: pct(previous) }}>{previousLabel}</span>
        <span style={{ left: pct(current) }}>{currentLabel}</span>
      </div>
    </div>
  )
}

/* ── 6 · PhoneFrame · spec 8.5. Dead upright. No tilt, no perspective, no
   reflection, no hand, no second device. One shadow. ───────────────────────── */

export function PhoneFrame({
  children,
  screenRef,
  className = '',
}: {
  children: ReactNode
  screenRef?: RefObject<HTMLDivElement | null>
  className?: string
}) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone__screen" ref={screenRef}>
        {children}
      </div>
    </div>
  )
}

/* ── 10 · Disclosure · spec 8.11, 8.12. Height-reserved expander, chevron only.
   The one permitted exception to the no-animated-dimension rule (spec 8.11),
   measured so it can never push what sits below it out of register. ────────── */

export function Disclosure({
  summary,
  children,
  summaryClass = 't-heading',
}: {
  summary: string
  children: ReactNode
  summaryClass?: string
}) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const inner = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const el = inner.current
    if (!el) return
    const measure = (): void => setHeight(el.scrollHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="disclosure" data-open={open ? 'true' : 'false'}>
      <button
        type="button"
        className="disclosure__summary"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={summaryClass}>{summary}</span>
        <ChevronGlyph open={open} />
      </button>
      <div
        id={id}
        className="disclosure__panel"
        style={{ maxHeight: open ? `${height}px` : '0px' }}
        inert={!open}
      >
        <div className="disclosure__inner" ref={inner}>
          {children}
        </div>
      </div>
    </div>
  )
}

/* ── 11 · Toggle · spec 8.7. Two segments; the content below is fixed to the
   height of the taller state so nothing moves. ─────────────────────────────── */

export function Toggle({
  options,
  value,
  onChange,
  label,
}: {
  options: [string, string]
  value: 0 | 1
  onChange: (v: 0 | 1) => void
  label: string
}) {
  return (
    <div className="toggle" role="group" aria-label={label}>
      <span className="toggle__indicator" data-at={value} aria-hidden="true" />
      {options.map((option, i) => (
        <button
          key={option}
          type="button"
          className="toggle__segment"
          aria-pressed={value === i}
          onClick={() => onChange(i as 0 | 1)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

/* ── The wordmark · spec 3.7. Switzer 500, 18px, tracking 0.06em — the only
   place on the site where positive tracking is this wide. ──────────────────── */

export function Wordmark({ as: Tag = 'span' }: { as?: 'span' | 'h1' | 'p' }) {
  return <Tag className="wordmark">HUMAN</Tag>
}
