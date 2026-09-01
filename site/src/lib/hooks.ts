import { useCallback, useEffect, useRef, useState } from 'react'
import { register, watchPageProgress, type ProgressMode } from './scroll'

/**
 * Attach to a scroll-driven element. Publishes `--p` (0 → 1) on it and
 * re-renders nothing. Everything visual should read `--p` from CSS.
 */
export function useProgress<E extends HTMLElement = HTMLDivElement>(mode: ProgressMode = 'pin') {
  const el = useRef<E>(null)
  const pin = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!el.current) return
    return register(el.current, { mode, pin: pin.current })
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
    const span = Math.max(0.0001, 1 - lead - tail)
    return register(el.current, {
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
  }, [count, mode, lead, tail])

  return { ref: el, pinRef: pin, step }
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

/** The entrance every pinned section uses: begins while the section is still
 *  below the fold, so the outgoing panel and the incoming one overlap. */
export function usePinEntrance<T extends HTMLElement = HTMLDivElement>() {
  return useReveal<T>(0, '0px 0px 45% 0px')
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
