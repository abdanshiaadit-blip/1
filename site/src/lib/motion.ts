/**
 * Motion state. BRIEF.md Parts 4.8 and 4.10.
 *
 * Two mechanisms exist on this site and they are never mixed inside one
 * element:
 *
 *   scroll-TRIGGERED  fires once when the element crosses 78% of viewport
 *                     height, plays a fixed-duration sequence, rests
 *                     permanently. Never replays, never reverses.
 *   scroll-LINKED     state is a pure function of scroll position within a
 *                     sticky stage. Reversible and idempotent: scrolling back
 *                     retraces exactly, and jumping to a position produces the
 *                     correct state without playing intermediate frames.
 */

import { useEffect, useRef, useState } from 'react'
import { subscribe } from './raf'

/** Part 4.10. Live, because a visitor can change the OS setting mid-session
 *  and the poster version has to be a first-class output, not a page reload. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}

/**
 * Scroll-triggered. True once the element's top crosses 78% of viewport
 * height, and true forever after — Part 4.8 is explicit that a triggered
 * sequence never replays and never reverses, which also rules out the
 * "counters that re-trigger on every pass" in the Part 13 banned list.
 *
 * Under reduced motion this returns true on the first frame: the poster
 * version is the settled state, not an unplayed one.
 */
export function useTriggered<T extends HTMLElement>(threshold = 0.78) {
  const ref = useRef<T>(null)
  const reduced = usePrefersReducedMotion()
  const [on, setOn] = useState(reduced)

  useEffect(() => {
    if (reduced) {
      setOn(true)
      return
    }
    const el = ref.current
    if (!el) return

    // rootMargin pulls the trigger line up to `threshold` of the viewport:
    // a bottom margin of -(1 - t) * 100% means "fire when the element reaches
    // t of the way down the screen".
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true)
          io.disconnect() // once. never again.
        }
      },
      { rootMargin: `0px 0px ${-(1 - threshold) * 100}% 0px`, threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced, threshold])

  return [ref, on] as const
}

/**
 * Scroll-linked progress through a sticky section, 0 at the moment the stage
 * pins and 1 when it unpins.
 *
 * A pure function of scroll position: no easing, no smoothing, no stored
 * velocity. That is what makes it reversible and idempotent — scrub the
 * scrollbar to any position and the value is the same as if you had scrolled
 * there slowly.
 *
 * `will-change` is applied only while the stage is in view (Part 10) and is
 * cleared the moment it leaves, so an off-screen stage costs no compositor
 * layer.
 */
export function useStageProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [progress, setProgress] = useState(0)
  const [inView, setInView] = useState(false)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) {
      // Part 4.10: every sticky stage collapses to its FINAL state.
      setProgress(1)
      setInView(false)
      return
    }
    const el = ref.current
    if (!el) return

    return subscribe(() => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // The stage is pinned for (height - vh) of scrolling.
      const span = rect.height - vh
      const visible = rect.top < vh && rect.bottom > 0
      setInView(visible)
      if (span <= 0) {
        setProgress(rect.top <= 0 ? 1 : 0)
        return
      }
      const raw = -rect.top / span
      setProgress(raw < 0 ? 0 : raw > 1 ? 1 : raw)
    })
  }, [reduced])

  return { ref, progress, inView, reduced }
}

/** Map a sub-range of stage progress onto 0–1. Beats are specified in the
 *  brief as percentage bands ("Beat 2 — the crossing, 45–58%"), so the sites
 *  read the way the brief reads. */
export function band(progress: number, from: number, to: number): number {
  if (to <= from) return progress >= to ? 1 : 0
  const t = (progress - from) / (to - from)
  return t < 0 ? 0 : t > 1 ? 1 : t
}
