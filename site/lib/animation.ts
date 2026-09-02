'use client'

import { useLayoutEffect, useEffect, useRef, type RefObject } from 'react'
import type { gsap as GsapNamespace } from 'gsap'
import type { ScrollTrigger as ScrollTriggerClass } from 'gsap/ScrollTrigger'
import { DESKTOP_QUERY, REDUCED_QUERY, REVEAL, SCRUB } from './tokens'

export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export type Motion = {
  gsap: typeof GsapNamespace
  ScrollTrigger: typeof ScrollTriggerClass
}

let motion: Motion | null = null
let pending: Promise<Motion> | null = null

/**
 * §8 Law 2 — GSAP ScrollTrigger is the only system permitted to read
 * scroll position for animation, registered once with the §14.3 defaults.
 *
 * It is loaded as an async chunk rather than in the initial bundle. That
 * is only safe because of Law 1: the resting CSS state is the finished
 * page, so nothing waits on this to be readable, and a visitor whose
 * connection never delivers it still gets the whole site. It also keeps
 * the initial JS inside the §14.6 budget and off the critical path.
 */
export function loadMotion(): Promise<Motion> {
  if (motion) return Promise.resolve(motion)
  if (!pending) {
    pending = Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([core, plugin]) => {
      const gsap = core.gsap
      const ScrollTrigger = plugin.ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)
      ScrollTrigger.defaults({
        // §14.3 lists `invalidateOnRefresh: true`, but that setting and
        // the `from()` architecture Law 1 requires pull against each
        // other: on refresh GSAP re-reads a tween's destination from the
        // element's current computed style, and a `from()` tween whose
        // trigger has not been reached is sitting at its start value.
        // Nothing here animates a measured distance, so a refresh has
        // nothing to re-measure.
        invalidateOnRefresh: false,
        anticipatePin: 1,
        markers: false,
      })
      motion = { gsap, ScrollTrigger }
      // Exposed so the QA scripts can inspect live tween state against a
      // production build. Two assignments; no behaviour depends on them.
      Object.assign(window as unknown as Record<string, unknown>, { gsap, ScrollTrigger })
      return motion
    })
  }
  return pending
}

/** The loaded namespace, for helpers only ever called from inside a
 *  motion callback, where the load has already resolved. */
function required(): Motion {
  if (!motion) throw new Error('loadMotion() has not resolved yet')
  return motion
}

/** Run an effect once GSAP is available, with the usual cleanup contract. */
export function useMotionEffect(
  effect: (motion: Motion) => (() => void) | void,
  deps: unknown[] = [],
) {
  const effectRef = useRef(effect)
  effectRef.current = effect

  useIsomorphicLayoutEffect(() => {
    let cancelled = false
    let cleanup: (() => void) | void
    loadMotion().then((loaded) => {
      if (cancelled) return
      cleanup = effectRef.current(loaded)
    })
    return () => {
      cancelled = true
      cleanup?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export type SetupFn = (context: {
  self: gsap.Context
  root: HTMLElement
  gsap: typeof GsapNamespace
  ScrollTrigger: typeof ScrollTriggerClass
}) => void | (() => void)

/**
 * §14.3 — the one animation helper, used by every section.
 *
 * Wraps `setupFn` in a `gsap.context()` scoped to the section root, inside
 * a `gsap.matchMedia()`. The reduced-motion condition is always silent by
 * design: because of Law 1 the resting CSS state is already the correct
 * final state, so "no animation" is a finished rendering, not a fallback.
 */
export function useSectionAnimation(
  rootRef: RefObject<HTMLElement | null>,
  setupFn: SetupFn,
  options: { query?: string; deps?: unknown[] } = {},
) {
  const query = options.query ?? DESKTOP_QUERY
  const setupRef = useRef(setupFn)
  setupRef.current = setupFn

  useMotionEffect(({ gsap, ScrollTrigger }) => {
    const root = rootRef.current
    if (!root) return

    const mm = gsap.matchMedia()
    mm.add(query, (self) => setupRef.current({ self, root, gsap, ScrollTrigger }))
    mm.add(REDUCED_QUERY, () => undefined)

    return () => mm.revert()
  }, options.deps ?? [])
}

/**
 * §7.4 — the single reveal pattern. Opacity 0 → 1, translateY 16 → 0,
 * 560ms, staggered 60ms, played once, never reversed on scroll-up.
 *
 * Written as `from()` so each element's resting state is its final,
 * visible, correctly-positioned one (Law 1).
 *
 * Each element gets its own `from()` inside a shared timeline rather than
 * one staggered tween across all of them. A staggered `from()` applies its
 * start state only to the first target at creation; the rest sit visible
 * and then flash to their start state as their portion of the stagger
 * begins. One tween per element renders every start state up front, so
 * nothing flashes, and the timeline still costs a single ScrollTrigger.
 */
export function reveal(
  targets: gsap.TweenTarget,
  options: { stagger?: number; trigger?: Element; start?: string; delay?: number } = {},
) {
  const { gsap } = required()
  const list = gsap.utils.toArray<Element>(targets)
  if (!list.length) return
  const stagger = options.stagger ?? REVEAL.stagger
  const delay = options.delay ?? 0

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: options.trigger ?? (list[0] as Element),
      start: options.start ?? REVEAL.start,
      once: true,
    },
  })

  list.forEach((element, index) => {
    timeline.from(
      element,
      { opacity: 0, y: REVEAL.y, duration: REVEAL.duration, ease: 'power3.out' },
      delay + Math.min(index, REVEAL.maxStaggered) * stagger,
    )
  })

  return timeline
}

/**
 * Append one `from()` per element to a timeline, offset by `stagger`, for
 * the same reason `reveal()` does: a single staggered `from()` leaves every
 * target but the first at its final value until its portion begins, which
 * reads as a flash.
 */
export function staggerFrom(
  timeline: gsap.core.Timeline,
  targets: gsap.TweenTarget,
  vars: gsap.TweenVars,
  options: { stagger: number; at?: number },
) {
  const { gsap } = required()
  const at = options.at ?? 0
  gsap.utils.toArray<Element>(targets).forEach((element, index) => {
    timeline.from(element, vars, at + index * options.stagger)
  })
  return timeline
}

/**
 * §7.5 — a scrubbed timeline over a scene track. All state derives from a
 * single progress value, which is what makes scrolling backwards
 * automatically correct rather than something to handle case by case.
 */
export function sceneTimeline(track: Element) {
  const { gsap } = required()
  return gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: track, start: 'top top', end: 'bottom bottom', scrub: SCRUB },
  })
}

/** §8.6 — the refresh policy. Attached once, from the app shell. */
export function attachRefreshPolicy({ ScrollTrigger }: Motion): () => void {
  let resizeTimer: number | undefined
  const onResize = () => {
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => ScrollTrigger.refresh(), 200)
  }
  const onOrientation = () => ScrollTrigger.refresh()
  const onPageShow = () => ScrollTrigger.refresh()

  window.addEventListener('resize', onResize)
  window.addEventListener('orientationchange', onOrientation)
  window.addEventListener('pageshow', onPageShow)

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {})
  }

  return () => {
    window.clearTimeout(resizeTimer)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('orientationchange', onOrientation)
    window.removeEventListener('pageshow', onPageShow)
  }
}
