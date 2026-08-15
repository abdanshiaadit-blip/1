import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type PointerEvent as RPointerEvent,
} from 'react'
import type { HealthState } from '../data/types'

export const stateClass = (s: HealthState | 'women') => `st-${s}`

export const STATE_LABEL: Record<HealthState, string> = {
  optimal: 'Optimal',
  stable: 'Stable',
  monitor: 'Monitor',
  attention: 'Needs focus',
  clinical: 'Discuss with a clinician',
}

/* ---------------------------------------------------------------- Reveal */

export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${shown ? 'is-in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------ GlassCard */

export function GlassCard({
  children,
  className = '',
  onClick,
  style,
  tone,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
  style?: CSSProperties
  tone?: HealthState | 'women' | 'brand'
}) {
  const cls = `card ${tone && tone !== 'brand' ? stateClass(tone) : ''} ${
    tone === 'brand' ? 'card--brand' : ''
  } ${onClick ? 'card--tap' : ''} ${className}`
  if (onClick) {
    return (
      <button type="button" className={cls} style={style} onClick={onClick}>
        {children}
      </button>
    )
  }
  return (
    <div className={cls} style={style}>
      {children}
    </div>
  )
}

/* --------------------------------------------------------- SectionHeader */

export function SectionHeader({
  eyebrow,
  title,
  action,
  onAction,
}: {
  eyebrow?: string
  title: string
  action?: string
  onAction?: () => void
}) {
  return (
    <div className="sec">
      <div>
        {eyebrow && <div className="t-cap sec__eyebrow">{eyebrow}</div>}
        <h2 className="t-title">{title}</h2>
      </div>
      {action && (
        <button type="button" className="sec__action" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- Atoms */

export function StateDot({ state, size = 8 }: { state: HealthState | 'women'; size?: number }) {
  return (
    <span
      className={`dot ${stateClass(state)}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  )
}

export function Chip({
  children,
  state,
  className = '',
}: {
  children: ReactNode
  state?: HealthState | 'women'
  className?: string
}) {
  return <span className={`chip ${state ? stateClass(state) : ''} ${className}`}>{children}</span>
}

export function Divider() {
  return <div className="divider" />
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  full,
  disabled,
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  full?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      className={`btn btn--${variant} ${full ? 'btn--full' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export function ListRow({
  title,
  sub,
  value,
  state,
  onClick,
  icon,
  last,
}: {
  title: string
  sub?: string
  value?: ReactNode
  state?: HealthState | 'women'
  onClick?: () => void
  icon?: ReactNode
  last?: boolean
}) {
  const inner = (
    <>
      {icon && <span className="row__icon">{icon}</span>}
      <span className="row__main">
        <span className="row__title">{title}</span>
        {sub && <span className="row__sub">{sub}</span>}
      </span>
      {value !== undefined && <span className="row__value">{value}</span>}
      {state && <StateDot state={state} />}
      {onClick && <span className="row__chev" aria-hidden="true" />}
    </>
  )
  if (onClick) {
    return (
      <button type="button" className={`row row--tap ${last ? 'row--last' : ''}`} onClick={onClick}>
        {inner}
      </button>
    )
  }
  return <div className={`row ${last ? 'row--last' : ''}`}>{inner}</div>
}

/* -------------------------------------------------- Medical safety note */

export function SafetyNote({ children }: { children: ReactNode }) {
  return (
    <div className="safety">
      <span className="safety__mark" aria-hidden="true" />
      <p className="t-foot">{children}</p>
    </div>
  )
}

/* ---------------------------------------------------------------- Sheet */

export function Sheet({
  title,
  eyebrow,
  onClose,
  children,
  depth = 0,
}: {
  title: string
  eyebrow?: string
  onClose: () => void
  children: ReactNode
  depth?: number
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startY: 0, dy: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const close = () => {
    setMounted(false)
    window.setTimeout(onClose, 260)
  }

  const onDown = (e: RPointerEvent) => {
    drag.current = { active: true, startY: e.clientY, dy: 0 }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onMove = (e: RPointerEvent) => {
    if (!drag.current.active || !panelRef.current) return
    const dy = Math.max(0, e.clientY - drag.current.startY)
    drag.current.dy = dy
    panelRef.current.style.transition = 'none'
    panelRef.current.style.transform = `translateY(${dy}px)`
  }
  const onUp = () => {
    if (!drag.current.active || !panelRef.current) return
    drag.current.active = false
    panelRef.current.style.transition = ''
    panelRef.current.style.transform = ''
    if (drag.current.dy > 110) close()
  }

  return (
    <div className={`sheet-layer ${mounted ? 'is-in' : ''}`} style={{ zIndex: 100 + depth }}>
      <div className="sheet-scrim" onClick={close} />
      <div className="sheet" ref={panelRef} style={{ top: `${44 + depth * 10}px` }}>
        <div
          className="sheet__grab"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          <span />
        </div>
        <header className="sheet__head">
          <div className="sheet__titles">
            {eyebrow && <div className="t-cap">{eyebrow}</div>}
            <h2 className="t-title">{title}</h2>
          </div>
          <button type="button" className="sheet__close" onClick={close} aria-label="Close">
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              <path
                d="M5 5l14 14M19 5L5 19"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </button>
        </header>
        <div className="scroll sheet__body">
          {children}
          <div style={{ height: 40 }} />
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- Pager */

export function Pager({
  count,
  index,
  onIndex,
  children,
}: {
  count: number
  index: number
  onIndex: (i: number) => void
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const lock = useRef(false)

  const onScroll = () => {
    const el = ref.current
    if (!el || lock.current) return
    const i = Math.round(el.scrollLeft / el.clientWidth)
    if (i !== index && i >= 0 && i < count) onIndex(i)
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const target = index * el.clientWidth
    if (Math.abs(el.scrollLeft - target) < 4) return
    lock.current = true
    el.scrollTo({ left: target, behavior: 'smooth' })
    const t = window.setTimeout(() => (lock.current = false), 420)
    return () => window.clearTimeout(t)
  }, [index])

  return (
    <div className="pager" ref={ref} onScroll={onScroll}>
      {children}
    </div>
  )
}

export function PageDots({
  count,
  index,
  onIndex,
}: {
  count: number
  index: number
  onIndex: (i: number) => void
}) {
  return (
    <div className="dots" role="tablist">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === index}
          aria-label={`Page ${i + 1}`}
          className={`dots__d ${i === index ? 'is-on' : ''}`}
          onClick={() => onIndex(i)}
        />
      ))}
    </div>
  )
}
