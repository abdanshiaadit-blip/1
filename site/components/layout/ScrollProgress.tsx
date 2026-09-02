'use client'

import { useRef } from 'react'
import { useMotionEffect } from '@/lib/animation'

/**
 * §11.5 — a 2px jade bar tracking document scroll progress. The only
 * ambient motion on the site, and hidden under reduced motion.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useMotionEffect(({ gsap }) => {
    const bar = ref.current
    if (!bar) return

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 0,
            end: 'max',
            scrub: 0.3,
          },
        },
      )
    })
    return () => mm.revert()
  })

  return <div ref={ref} aria-hidden="true" className="scroll-progress" />
}
