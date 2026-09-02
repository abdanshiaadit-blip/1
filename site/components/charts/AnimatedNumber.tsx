'use client'

import { useRef } from 'react'
import { useMotionEffect } from '@/lib/animation'

/**
 * §10.4 — counting figures.
 *
 * The resting state is the final value (Law 1), so the correct number is
 * on screen whether or not JavaScript ever runs. Width is reserved before
 * the count starts: with tabular figures one `ch` is exactly one digit, so
 * a `min-width` of the final digit count holds the box still while the
 * value climbs through 1, 2 and 3 digits.
 */
export function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const digits = String(value).length

  useMotionEffect(({ gsap }) => {
    const node = ref.current
    if (!node) return

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const counter = { n: 0 }
      gsap.to(counter, {
        n: value,
        duration: 1.4,
        ease: 'power3.out',
        snap: { n: 1 },
        onUpdate: () => {
          node.textContent = String(Math.round(counter.n))
        },
        scrollTrigger: { trigger: node, start: 'top 70%', once: true },
      })
    })
    return () => mm.revert()
  }, [value])

  return (
    <span
      ref={ref}
      className={className}
      style={{ display: 'inline-block', minWidth: `${digits}ch`, fontVariantNumeric: 'lining-nums tabular-nums' }}
    >
      {value}
    </span>
  )
}
