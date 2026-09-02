'use client'

import type Lenis from 'lenis'
import { attachRefreshPolicy, useMotionEffect } from '@/lib/animation'

/**
 * Smooth scrolling and the ScrollTrigger refresh policy (§14.1, §8.6).
 *
 * Lenis runs in its default native-scroll mode. No wrapper or content
 * transform is used: transforming a scroll container creates a new
 * containing block and silently breaks every `position: sticky` and
 * `position: fixed` element on the page — the nav, the rail and every
 * pinned section. Lenis is desktop-only and off under reduced motion.
 */
export function ScrollShell() {
  useMotionEffect((motion) => {
    const { gsap, ScrollTrigger } = motion
    const detachRefresh = attachRefreshPolicy(motion)

    const query = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)')
    let lenis: Lenis | null = null
    let starting = false
    let onScroll: (() => void) | null = null
    let raf: ((time: number) => void) | null = null

    const start = () => {
      if (lenis || starting) return
      starting = true
      import('lenis').then(({ default: LenisCtor }) => {
        starting = false
        if (!query.matches || lenis) return
        lenis = new LenisCtor({ duration: 1.05, smoothWheel: true })
        onScroll = () => ScrollTrigger.update()
        lenis.on('scroll', onScroll)
        raf = (time: number) => lenis?.raf(time * 1000)
        gsap.ticker.add(raf)
        gsap.ticker.lagSmoothing(0)
      })
    }

    const stop = () => {
      if (!lenis) return
      if (raf) gsap.ticker.remove(raf)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
      lenis = null
      raf = null
      onScroll = null
    }

    const sync = () => (query.matches ? start() : stop())
    sync()
    query.addEventListener('change', sync)

    return () => {
      query.removeEventListener('change', sync)
      stop()
      detachRefresh()
    }
  })

  return null
}
