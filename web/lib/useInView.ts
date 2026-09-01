'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * One-way reveal. Once an element has been seen it stays seen — not on scroll
 * up, not on resize, not ever. This single decision removes the whole class of
 * "the text disappeared when I scrolled back" bugs that scroll-linked reveals
 * otherwise invite.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  rootMargin = '0px 0px -12% 0px',
  threshold = 0.1,
) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || seen) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin, threshold },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [seen, rootMargin, threshold])

  return { ref, seen }
}

/** True once, when the viewport is narrower than the given breakpoint. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatches(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return matches
}

/**
 * Whether the site should scrub at all. Touch scroll has momentum and
 * rubber-banding; scrub-driven animation on iOS is unreliable and produces
 * exactly the jumping this brief was written to prevent. Below 768px every
 * beat becomes a block that reveals once on entry instead.
 */
export function useScrubbing() {
  const narrow = useMediaQuery('(max-width: 767px)')
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  return !narrow && !reduced
}
