'use client'

import { useEffect } from 'react'

/**
 * The single scroll observer for the whole page.
 *
 * One `requestAnimationFrame` loop. No per-element scroll listeners. It writes
 * `--p` (0 → 1) onto every scene currently near the viewport, and every
 * animation on the site is a CSS expression of that one number.
 *
 * Three properties matter:
 *
 *  - Sections outside the viewport are skipped, via IntersectionObserver, so
 *    the cost is proportional to what is on screen rather than to page length.
 *  - The loop parks when scrolling stops. It is not a permanent rAF.
 *  - Every scene is written once on mount and once after any resize, so a page
 *    loaded already scrolled — a deep link, or a refresh halfway down — renders
 *    every section at its correct state rather than at zero.
 */
export function useScrollProgress() {
  useEffect(() => {
    const scenes = Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'))
    if (!scenes.length) return

    const live = new Set<HTMLElement>()
    let raf = 0

    const write = (el: HTMLElement) => {
      const r = el.getBoundingClientRect()
      const travel = r.height - window.innerHeight
      // A scene shorter than the viewport has no travel to speak of: it is
      // simply before you, on you, or behind you.
      const p =
        travel > 0
          ? Math.min(1, Math.max(0, -r.top / travel))
          : r.top < window.innerHeight * 0.5
            ? 1
            : 0
      el.style.setProperty('--p', p.toFixed(4))
    }

    const frame = () => {
      raf = 0
      for (const el of live) write(el)
    }

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement
          if (e.isIntersecting) {
            live.add(el)
            // Write immediately on entry rather than waiting for the next
            // scroll event, so a section can never appear at progress zero
            // for a frame as it comes into view.
            write(el)
          } else {
            // Park it at whichever end it left by, so scrolling past a section
            // quickly cannot leave it stranded mid-animation.
            const r = el.getBoundingClientRect()
            el.style.setProperty('--p', r.top > 0 ? '0' : '1')
            live.delete(el)
          }
        }
      },
      { rootMargin: '10% 0px' },
    )

    scenes.forEach((s) => {
      io.observe(s)
      write(s)
    })

    let resizeTimer = 0
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => scenes.forEach(write), 150)
      kick()
    }

    window.addEventListener('scroll', kick, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('orientationchange', onResize, { passive: true })
    kick()

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', kick)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
      window.clearTimeout(resizeTimer)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
}

/**
 * Page scroll as a single 0 → 1, for the progress hairline. Same loop
 * discipline: one listener, one rAF, parks when idle.
 */
export function usePageProgress(onChange: (p: number) => void) {
  useEffect(() => {
    let raf = 0
    const frame = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      onChange(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }
    window.addEventListener('scroll', kick, { passive: true })
    window.addEventListener('resize', kick, { passive: true })
    kick()
    return () => {
      window.removeEventListener('scroll', kick)
      window.removeEventListener('resize', kick)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [onChange])
}
