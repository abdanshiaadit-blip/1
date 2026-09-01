/* ==========================================================================
   The scroll engine.

   One idea, applied everywhere: every scroll-driven section publishes its own
   progress as a CSS custom property (--p, running 0 → 1), and CSS expresses
   every animation as a function of that one number.

   opacity: calc((var(--p) - .18) * 4)
   translate: 0 calc((1 - var(--p)) * 40px)

   That keeps the main thread almost empty, needs no animation library, and
   means React re-renders only when a *step* changes — never per frame.
   ========================================================================== */

export type ProgressMode = 'pin' | 'through' | 'enter' | 'approach'

interface Entry {
  el: HTMLElement
  mode: ProgressMode
  /** Custom property to publish on. Lets one element carry two progresses. */
  prop: string
  /** Element that stays pinned; its height is subtracted from the travel. */
  pin?: HTMLElement | null
  /** Called with 0 → 1 whenever the value materially changes. */
  onChange?: (p: number) => void
  last: number
  visible: boolean
}

const entries = new Set<Entry>()
let ticking = false
let io: IntersectionObserver | null = null

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)

/** How far below the fold a section's run-up begins, in viewports. */
const APPROACH_LEAD = 1.75

function progressOf(e: Entry, vh: number): number {
  const r = e.el.getBoundingClientRect()

  if (e.mode === 'pin') {
    // A tall wrapper containing a one-viewport sticky panel. Progress runs
    // from the moment the wrapper's top meets the viewport top, to the moment
    // its bottom meets the viewport bottom.
    const pinH = e.pin?.offsetHeight || vh
    const travel = e.el.offsetHeight - pinH
    if (travel <= 0) return r.top <= 0 ? 1 : 0
    return clamp01(-r.top / travel)
  }

  if (e.mode === 'approach') {
    // The run-up to a sticky section, and what the entrance lift is driven by.
    // It starts APPROACH_LEAD viewports below the fold rather than exactly at
    // it: a pinned panel fades out just as the next section's top reaches the
    // viewport bottom, so a run-up that only begins there leaves one blank
    // frame between the two. Starting early lets the next panel already be
    // rising by the time the last one has gone.
    return clamp01((vh * APPROACH_LEAD - r.top) / (vh * APPROACH_LEAD))
  }

  if (e.mode === 'enter') {
    // 0 when the element's top touches the bottom of the viewport,
    // 1 once it has risen by 60% of a viewport. For reveals and parallax-in.
    return clamp01((vh - r.top) / (vh * 0.6))
  }

  // 'through' — 0 when the top enters at the bottom edge, 1 when the bottom
  // leaves at the top edge. The full transit of the element.
  const travel = vh + r.height
  return clamp01((vh - r.top) / travel)
}

function update() {
  ticking = false
  const vh = window.innerHeight
  for (const e of entries) {
    if (!e.visible) continue
    const p = progressOf(e, vh)
    // Three decimals is finer than a single device pixel over any travel we
    // use, and stops us writing to the DOM for imperceptible deltas.
    if (Math.abs(p - e.last) < 0.0005) continue
    e.last = p
    e.el.style.setProperty(e.prop, p.toFixed(4))
    e.onChange?.(p)
  }
}

function request() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(update)
}

function ensureObserver() {
  if (io) return io
  io = new IntersectionObserver(
    (recs) => {
      for (const rec of recs) {
        for (const e of entries) {
          if (e.el !== rec.target) continue
          e.visible = rec.isIntersecting
          // Force the next frame to write, so a section that scrolls into
          // view fast still lands on the right value.
          if (rec.isIntersecting) e.last = -1
        }
      }
      request()
    },
    // A generous margin so a section is already correct before it is seen.
    { rootMargin: '60% 0px 60% 0px' },
  )
  return io
}

let listening = false
function listen() {
  if (listening) return
  listening = true
  addEventListener('scroll', request, { passive: true })
  addEventListener('resize', request, { passive: true })
  addEventListener('orientationchange', request, { passive: true })
}

export function register(
  el: HTMLElement,
  opts: {
    mode?: ProgressMode
    pin?: HTMLElement | null
    prop?: string
    initial?: string
    onChange?: (p: number) => void
  } = {},
): () => void {
  const entry: Entry = {
    el,
    mode: opts.mode ?? 'pin',
    prop: opts.prop ?? '--p',
    pin: opts.pin,
    onChange: opts.onChange,
    last: -1,
    visible: false,
  }
  entries.add(entry)
  el.style.setProperty(entry.prop, opts.initial ?? '0')
  ensureObserver().observe(el)
  listen()
  request()

  return () => {
    entries.delete(entry)
    // An element can carry more than one progress; only stop watching it once
    // nothing is left that cares.
    let stillUsed = false
    for (const e of entries) if (e.el === el) stillUsed = true
    if (!stillUsed) io?.unobserve(el)
  }
}

/** Total document scroll, 0 → 1. Used by the progress hairline. */
export function watchPageProgress(cb: (p: number) => void): () => void {
  let raf = 0
  const tick = () => {
    raf = 0
    const max = document.documentElement.scrollHeight - window.innerHeight
    cb(max > 0 ? clamp01(window.scrollY / max) : 0)
  }
  const on = () => {
    if (!raf) raf = requestAnimationFrame(tick)
  }
  addEventListener('scroll', on, { passive: true })
  addEventListener('resize', on, { passive: true })
  tick()
  return () => {
    removeEventListener('scroll', on)
    removeEventListener('resize', on)
    if (raf) cancelAnimationFrame(raf)
  }
}

export const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
