/* React bindings for the scroll engine. These are the only ways a section may
   listen to scroll. No section may add its own scroll listener or rAF loop. */

import { useCallback, useEffect, useRef, useState } from 'react'
import { observeReveal, prefersReducedMotion, registerStage } from './scroll'

/**
 * Scroll-linked. `fn` receives progress 0→1 across the section's scroll budget
 * and should write to the DOM through refs — it runs on every frame the page is
 * moving, so it must not call setState. spec 5.3: the state must be a pure
 * function of progress, so scrolling back retraces exactly and jumping to a
 * position produces the correct state without intermediate frames.
 */
export function useStageProgress<T extends HTMLElement>(fn: (p: number) => void): React.RefObject<T | null> {
  const ref = useRef<T | null>(null)
  const fnRef = useRef(fn)
  fnRef.current = fn

  useEffect(() => {
    const el = ref.current
    if (!el) return
    return registerStage(el, (p) => fnRef.current(p))
  }, [])

  return ref
}

/**
 * Scroll-linked, but quantised: returns the index of the active band. Only
 * re-renders when the index actually changes — used where a discrete piece of
 * React content swaps (the app stage's five screens).
 */
export function useStageStep<T extends HTMLElement>(
  bands: number,
  start = 0,
  end = 1,
): [React.RefObject<T | null>, number] {
  const [step, setStep] = useState(0)
  const stepRef = useRef(0)

  const ref = useStageProgress<T>((p) => {
    const t = (p - start) / (end - start)
    const next = Math.min(bands - 1, Math.max(0, Math.floor(t * bands)))
    if (next !== stepRef.current) {
      stepRef.current = next
      setStep(next)
    }
  })

  return [ref, step]
}

/**
 * Scroll-triggered. Adds `is-in` once, when the element's top reaches 78% of
 * the viewport. Never replays. spec 5.3.
 */
export function useReveal<T extends HTMLElement>(): React.RefObject<T | null> {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    return observeReveal(el)
  }, [])
  return ref
}

/**
 * Scroll-triggered, but reported to React — for sections that need to know
 * they are on screen in order to run a one-shot count-up or draw.
 */
export function useInView<T extends HTMLElement>(): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null)
  const [seen, setSeen] = useState(() => prefersReducedMotion())

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) {
      setSeen(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true)
          obs.disconnect()
        }
      },
      { rootMargin: '0px 0px -22% 0px', threshold: 0 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return [ref, seen]
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = (): void => setMatches(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return matches
}

/** True below 768px — the breakpoint at which sticky stages collapse. */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)')
}

export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

/**
 * A one-shot count-up in tabular figures. spec 5.1: nothing animates for longer
 * than 1,400ms. spec 15: counters never re-trigger on a later scroll pass.
 */
export function useCountUp(target: number, active: boolean, duration = 900): number {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0))
  const done = useRef(false)

  useEffect(() => {
    if (!active || done.current) return
    done.current = true

    if (prefersReducedMotion()) {
      setValue(target)
      return
    }

    let raf = 0
    const t0 = performance.now()
    const tick = (now: number): void => {
      const t = Math.min(1, (now - t0) / duration)
      /* ease-entrance, sampled: settles rather than arrives. */
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(target * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target, duration])

  return value
}

/** Stable callback identity for handlers passed into deep children. */
export function useEvent<A extends unknown[], R>(fn: (...args: A) => R): (...args: A) => R {
  const ref = useRef(fn)
  ref.current = fn
  return useCallback((...args: A) => ref.current(...args), [])
}
