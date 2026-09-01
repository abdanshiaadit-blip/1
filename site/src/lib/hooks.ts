import { useCallback, useEffect, useRef, useState } from 'react'
import { register, watchPageProgress, type ProgressMode } from './scroll'

/**
 * The run-up to a sticky section, published as `--ap` (0 → 1 as the section's
 * top travels from the viewport bottom to the viewport top).
 *
 * A sticky panel centres its content, so while the section is still arriving
 * that content sits half a viewport below the fold and the screen looks
 * empty. `--ap` drives a lift that peaks in the middle of the run-up and
 * returns to zero exactly as the panel pins — so the content rises into
 * place instead of waiting below the fold.
 */
const registerApproach = (el: HTMLElement) =>
  register(el, { mode: 'approach', prop: '--ap', initial: '1' })

/**
 * Attach to a scroll-driven element. Publishes `--p` (0 → 1) on it and
 * re-renders nothing. Everything visual should read `--p` from CSS.
 */
export function useProgress<E extends HTMLElement = HTMLDivElement>(mode: ProgressMode = 'pin') {
  const el = useRef<E>(null)
  const pin = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!el.current) return
    const stop = register(el.current, { mode, pin: pin.current })
    const stopApproach = mode === 'pin' ? registerApproach(el.current) : undefined
    return () => {
      stop()
      stopApproach?.()
    }
  }, [mode])
  return { ref: el, pinRef: pin }
}

/**
 * The same, plus a quantised step index for the cases where JavaScript
 * genuinely has to act — swapping the live app's tab, opening a sheet.
 * Re-renders only when the integer changes, not on every frame.
 */
export function useSteps(
  count: number,
  {
    mode = 'pin' as ProgressMode,
    lead = 0.05,
    tail = 0.06,
    onProgress,
  }: {
    mode?: ProgressMode
    lead?: number
    tail?: number
    /** Raw progress plus the fraction *within* the current step, every frame. */
    onProgress?: (step: number, frac: number) => void
  } = {},
) {
  const el = useRef<HTMLDivElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)
  const stepRef = useRef(0)
  const prog = useRef(onProgress)
  prog.current = onProgress

  useEffect(() => {
    if (!el.current) return
    const stopApproach = mode === 'pin' ? registerApproach(el.current) : undefined
    const span = Math.max(0.0001, 1 - lead - tail)
    const stop = register(el.current, {
      mode,
      pin: pin.current,
      onChange: (p) => {
        const t = Math.max(0, Math.min(0.9999, (p - lead) / span)) * count
        const next = Math.min(count - 1, Math.floor(t))
        prog.current?.(next, t - next)
        if (next === stepRef.current) return
        stepRef.current = next
        setStep(next)
        el.current?.style.setProperty('--step', String(next))
      },
    })
    return () => {
      stop()
      stopApproach?.()
    }
  }, [count, mode, lead, tail])

  /**
   * Scroll the page to the middle of a given step. This is what turns a
   * scroll-driven story into something you can also navigate: the same
   * geometry the engine reads, run backwards.
   */
  const goTo = useCallback(
    (index: number) => {
      const section = el.current
      if (!section) return
      const span = Math.max(0.0001, 1 - lead - tail)
      const p = lead + ((index + 0.5) / count) * span
      const pinH = pin.current?.offsetHeight || innerHeight
      const travel = section.offsetHeight - pinH
      const top = section.getBoundingClientRect().top + scrollY
      scrollTo({
        top: top + travel * p,
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      })
    },
    [count, lead, tail],
  )

  return { ref: el, pinRef: pin, step, goTo }
}

/** Mount heavy things only when they are near. Never un-mounts once shown. */
export function useNearViewport<T extends HTMLElement = HTMLDivElement>(margin = '35%') {
  const ref = useRef<T>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node || near) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: `${margin} 0px ${margin} 0px` },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [near, margin])
  return { ref, near }
}

/** One-shot reveal for ordinary blocks of content.
 *  `rootMargin` lets a pinned section start fading in while it is still
 *  sliding up from below, so no section ever arrives as a hard cut. */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.15,
  rootMargin = '0px 0px -8% 0px',
) {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node || shown) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [shown, threshold, rootMargin])
  return { ref, shown }
}

export function usePageProgress(onChange: (p: number) => void) {
  const cb = useRef(onChange)
  cb.current = onChange
  useEffect(() => watchPageProgress((p) => cb.current(p)), [])
}

/** Pointer position, eased, published as CSS vars on an element. */
export function usePointerParallax<T extends HTMLElement = HTMLDivElement>(strength = 1) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let tx = 0
    let ty = 0
    let x = 0
    let y = 0
    let raf = 0

    const loop = () => {
      x += (tx - x) * 0.075
      y += (ty - y) * 0.075
      node.style.setProperty('--mx', x.toFixed(4))
      node.style.setProperty('--my', y.toFixed(4))
      if (Math.abs(tx - x) > 0.0008 || Math.abs(ty - y) > 0.0008) {
        raf = requestAnimationFrame(loop)
      } else {
        raf = 0
      }
    }

    const move = (e: PointerEvent) => {
      const r = node.getBoundingClientRect()
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2 * strength
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2 * strength
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const leave = () => {
      tx = 0
      ty = 0
      if (!raf) raf = requestAnimationFrame(loop)
    }

    node.addEventListener('pointermove', move)
    node.addEventListener('pointerleave', leave)
    return () => {
      node.removeEventListener('pointermove', move)
      node.removeEventListener('pointerleave', leave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [strength])
  return ref
}

/**
 * A soft pool of light that follows the pointer, eased. One fixed element,
 * moved with a transform and nothing else, so it costs a single composited
 * layer. Off on touch and under reduced motion.
 */
export function useCursorLight(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // The lag that makes this feel like light rather than a cursor is a long
    // CSS transition on the transform, not a per-frame chase in script. Same
    // motion, and the compositor carries it instead of the main thread.
    let tx = innerWidth / 2
    let ty = innerHeight / 2
    let raf = 0
    let seen = false

    const write = () => {
      raf = 0
      node.style.transform = `translate3d(${tx.toFixed(0)}px, ${ty.toFixed(0)}px, 0)`
    }
    const move = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
      if (!seen) {
        seen = true
        node.classList.add('is-on')
      }
      if (!raf) raf = requestAnimationFrame(write)
    }
    const leave = () => node.classList.remove('is-on')
    const enter = () => seen && node.classList.add('is-on')

    addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    document.addEventListener('pointerenter', enter)
    return () => {
      removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      document.removeEventListener('pointerenter', enter)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [ref])
}

/**
 * Which linked section the reader is in, for the navigation. Reports the
 * last section whose top has passed the middle of the viewport, which is
 * what "where am I" means on a page built out of tall sticky sections.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState('')
  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!els.length) return

    let raf = 0
    const measure = () => {
      raf = 0
      const line = innerHeight * 0.45
      let found = ''
      for (const el of els) {
        const r = el.getBoundingClientRect()
        if (r.top <= line && r.bottom > line) found = el.id
      }
      setActive((cur) => (cur === found ? cur : found))
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    measure()
    addEventListener('scroll', on, { passive: true })
    addEventListener('resize', on, { passive: true })
    return () => {
      removeEventListener('scroll', on)
      removeEventListener('resize', on)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [ids])
  return active
}

/**
 * Splits a heading into words so each can arrive on its own beat. Returns
 * the words with an index; the stagger itself is a CSS expression of --i, so
 * this costs no per-frame work.
 */
export function splitWords(text: string) {
  return text.split(' ').map((word, i) => ({ word, i }))
}

/**
 * True while a dark section's ground is under the navigation bar.
 *
 * The section's plane fades in and out at its own edges, so the test is not
 * "is the section on screen" but "has its fully dark band reached the line
 * the nav sits on" — `edge` is the fraction of the section's height that the
 * fade occupies at each end.
 */
export function useDarkUnderNav(selector: string, edge = 0.13, line = 42) {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const el = document.querySelector(selector)
    if (!el) return
    let raf = 0
    const measure = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      setDark(r.top + r.height * edge <= line && r.top + r.height * (1 - edge) >= line)
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    measure()
    addEventListener('scroll', on, { passive: true })
    addEventListener('resize', on, { passive: true })
    return () => {
      removeEventListener('scroll', on)
      removeEventListener('resize', on)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [selector, edge, line])
  return dark
}

/** Live media-query match. Used to keep heavy things off small screens. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof matchMedia === 'function' ? matchMedia(query).matches : false,
  )
  useEffect(() => {
    const mq = matchMedia(query)
    const on = () => setMatches(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return matches
}

/** Stable callback that never changes identity. */
export function useEvent<A extends unknown[], R>(fn: (...a: A) => R) {
  const ref = useRef(fn)
  ref.current = fn
  return useCallback((...a: A) => ref.current(...a), [])
}
