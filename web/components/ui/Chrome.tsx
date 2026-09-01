'use client'

import { useCallback, useEffect, useRef } from 'react'
import { usePageProgress, useScrollProgress } from '@/lib/useScrollProgress'

/**
 * The two pieces of page furniture that are not part of any section: the
 * progress hairline, and the ambient glow that follows the pointer.
 *
 * The glow is carried over from the investor deck deliberately, so the two
 * artefacts read as one thing. It sits behind everything at the ambient
 * layer, is eased rather than pinned to the cursor, and does not exist on
 * touch or under reduced motion.
 */
export function Chrome() {
  useScrollProgress()

  const bar = useRef<HTMLDivElement>(null)
  const glow = useRef<HTMLDivElement>(null)

  const onProgress = useCallback((p: number) => {
    bar.current?.style.setProperty('--pp', p.toFixed(4))
  }, [])
  usePageProgress(onProgress)

  useEffect(() => {
    const node = glow.current
    if (!node) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let raf = 0
    let shown = false

    const write = () => {
      raf = 0
      node.style.transform = `translate3d(${tx.toFixed(0)}px, ${ty.toFixed(0)}px, 0)`
    }
    const move = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
      if (!shown) {
        shown = true
        node.classList.add('is-on')
      }
      if (!raf) raf = requestAnimationFrame(write)
    }

    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={glow} className="glow" aria-hidden="true" />
      <div ref={bar} className="pbar" aria-hidden="true" />
    </>
  )
}
