/* ─────────────────────────────────────────────────────────────────────────────
   The scroll engine.

   spec 12: "All scroll-linked work happens in a single requestAnimationFrame
   loop, never per-listener." This module owns that loop. Nothing else on the
   site may start one.

   spec 5.4: smoothing is Lenis at a subtle setting, applied so it never becomes
   a transform ancestor of a sticky stage (spec 6.2). Lenis in its default mode
   drives window.scrollTo — it wraps nothing and transforms nothing — which is
   why it is used this way and not with a wrapper element.

   The loop sleeps. spec 13.10: "Nothing on the page moves when the user is not
   scrolling, hovering or clicking."
   ───────────────────────────────────────────────────────────────────────────── */

import Lenis from 'lenis'

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function isTouch(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(hover: none) and (pointer: coarse)').matches
}

type ProgressFn = (progress: number) => void

interface Stage {
  el: HTMLElement
  fn: ProgressFn
  top: number
  range: number
  last: number
}

const stages = new Set<Stage>()

/* Discrete page-position watchers — the header's fill state, the mobile bar's
   visibility. They ride the same loop rather than adding listeners. spec 12. */
interface YWatcher {
  fn: (y: number) => void
  last: number
}
const yWatchers = new Set<YWatcher>()

let lenis: Lenis | null = null
let running = false
let idleFrames = 0
let reduced = false
let started = false

/* ── Measurement ──────────────────────────────────────────────────────────────
   Rects are read once per measure pass, never inside the frame loop, so the
   loop never forces a synchronous layout. spec 12: no long tasks during scroll. */

function measure(s: Stage): void {
  s.top = s.el.getBoundingClientRect().top + window.scrollY
  /* A sticky section's scroll budget is its own height minus one viewport:
     that is exactly the distance over which its stage is pinned. */
  s.range = Math.max(1, s.el.offsetHeight - window.innerHeight)
}

export function measureAll(): void {
  stages.forEach(measure)
  stages.forEach((s) => {
    s.last = -1
  })
  wake()
}

/* ── The single loop ────────────────────────────────────────────────────────── */

function update(): void {
  const y = window.scrollY

  yWatchers.forEach((w) => {
    if (w.last !== y) {
      w.last = y
      w.fn(y)
    }
  })

  stages.forEach((s) => {
    const p = reduced ? 1 : Math.min(1, Math.max(0, (y - s.top) / s.range))
    if (s.last < 0 || Math.abs(p - s.last) > 0.0004) {
      s.last = p
      s.fn(p)
    }
  })
}

function frame(time: number): void {
  if (lenis) lenis.raf(time)
  update()

  const busy = lenis ? lenis.isScrolling : false
  if (!busy && idleFrames++ > 3) {
    running = false
    return
  }
  requestAnimationFrame(frame)
}

function wake(): void {
  idleFrames = 0
  if (!running) {
    running = true
    requestAnimationFrame(frame)
  }
}

/* ── Registration ─────────────────────────────────────────────────────────────
   `fn` is called with progress 0→1 across the section's scroll budget. Under
   reduced motion it is called exactly once, with 1: the final, poster state.  */

export function registerStage(el: HTMLElement, fn: ProgressFn): () => void {
  const s: Stage = { el, fn, top: 0, range: 1, last: -1 }
  stages.add(s)
  measure(s)

  if (reduced) {
    s.last = 1
    fn(1)
  } else {
    wake()
  }

  return () => {
    stages.delete(s)
  }
}

export function watchScrollY(fn: (y: number) => void): () => void {
  const w: YWatcher = { fn, last: -1 }
  yWatchers.add(w)
  fn(window.scrollY)
  wake()
  return () => {
    yWatchers.delete(w)
  }
}

/* ── Scroll-triggered entrances · spec 5.3 ────────────────────────────────────
   "Threshold: element top reaches 78% of viewport height. It never replays,
   never reverses." One observer for the whole page.                          */

let revealObserver: IntersectionObserver | null = null

function getRevealObserver(): IntersectionObserver {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            obs.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -22% 0px', threshold: 0 },
    )
  }
  return revealObserver
}

export function observeReveal(el: Element): () => void {
  if (reduced || prefersReducedMotion()) {
    el.classList.add('is-in')
    return () => {}
  }
  const obs = getRevealObserver()
  obs.observe(el)
  return () => obs.unobserve(el)
}

/* ── Programmatic scrolling ───────────────────────────────────────────────────
   spec 5.4: smoothing "must never be used to snap, lock, or hijack". This is
   only ever called from an explicit user action on an in-page anchor.        */

export function scrollToId(id: string): void {
  const el = document.getElementById(id)
  if (!el) return
  const offset = -parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || -64

  if (lenis && !reduced) {
    lenis.scrollTo(el, { offset })
    return
  }
  const top = el.getBoundingClientRect().top + window.scrollY + offset
  window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' })
}

/* ── Boot ─────────────────────────────────────────────────────────────────── */

export function initScroll(): void {
  if (started) return
  started = true
  reduced = prefersReducedMotion()

  /* spec 5.4: smoothing is disabled entirely on touch devices — native momentum
     is better than anything we would ship — and under reduced motion. */
  if (!reduced && !isTouch()) {
    lenis = new Lenis({
      duration: 0.9,
      autoRaf: false,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
    })
    lenis.on('scroll', wake)
  }

  window.addEventListener('scroll', wake, { passive: true })

  let resizeRaf = 0
  const onResize = (): void => {
    cancelAnimationFrame(resizeRaf)
    resizeRaf = requestAnimationFrame(measureAll)
  }
  window.addEventListener('resize', onResize)
  window.addEventListener('orientationchange', onResize)

  /* Content below can change height — a disclosure opening, an image landing.
     Re-measure rather than let a stage drift out of register. */
  const ro = new ResizeObserver(onResize)
  ro.observe(document.documentElement)

  if (document.fonts) {
    document.fonts.ready.then(() => measureAll()).catch(() => {})
  }

  wake()
}
