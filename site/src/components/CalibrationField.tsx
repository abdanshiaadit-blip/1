/**
 * 7.1 Beat 2 — the calibration field. BRIEF.md Part 7.1, Part 8 moment 8.
 *
 * Sparse 1px hairline ticks of varying length on an irregular grid at 4%.
 * Ticks within ~180px of the cursor lengthen slightly and rise to 14%, soft
 * falloff, ~400ms trailing decay. It should read as an instrument noticing you.
 *
 * Hard limits, all of them from the brief: no colour, no glow, no blur, no
 * connecting lines, no particles, no physics, and **no requestAnimationFrame
 * running when the pointer is idle**. One SVG layer, clipped to its cell,
 * absent on touch and under reduced motion.
 */

import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../lib/motion'

interface Tick {
  x: number
  y: number
  len: number
}

/** Deterministic, so the field is identical on every load and in every
 *  screenshot. A random field would make the overlap test non-reproducible. */
function buildTicks(): Tick[] {
  const ticks: Tick[] = []
  let seed = 20260902
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
  for (let row = 0; row < 22; row++) {
    for (let col = 0; col < 9; col++) {
      if (rand() > 0.62) continue // sparse, and irregular
      ticks.push({
        x: (col + 0.5) * 11.1 + (rand() - 0.5) * 5,
        y: (row + 0.5) * 4.55 + (rand() - 0.5) * 2,
        /* Percent of cell height, like x and y — mixing px and % on one line
           makes the mark's length depend on the cell's aspect ratio. */
        len: 0.8 + rand() * 1.4,
      })
    }
  }
  return ticks
}

const TICKS = buildTicks()
const RADIUS = 180

export default function CalibrationField() {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<SVGSVGElement>(null)
  const [touch, setTouch] = useState(false)

  useEffect(() => {
    setTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  useEffect(() => {
    if (reduced || touch) return
    const svg = ref.current
    if (!svg) return

    let raf = 0
    let pointer: { x: number; y: number } | null = null
    let decayUntil = 0

    /* The loop runs only while the pointer is moving, plus a 400ms trailing
       decay. Idle costs nothing, which is the brief's explicit requirement. */
    const frame = () => {
      const box = svg.getBoundingClientRect()
      const now = performance.now()
      const marks = svg.querySelectorAll<SVGLineElement>('line')

      marks.forEach((line, i) => {
        const t = TICKS[i]
        const cx = (t.x / 100) * box.width
        const cy = (t.y / 100) * box.height
        let near = 0
        if (pointer) {
          const dx = pointer.x - box.left - cx
          const dy = pointer.y - box.top - cy
          const d = Math.hypot(dx, dy)
          near = d > RADIUS ? 0 : 1 - d / RADIUS
          near *= near // soft falloff, not linear
        }
        line.setAttribute('opacity', String(0.04 + near * 0.1))
        line.setAttribute('y2', `${t.y + t.len * (1 + near * 0.5)}%`)
      })

      if (pointer || now < decayUntil) {
        raf = requestAnimationFrame(frame)
      } else {
        raf = 0
      }
    }

    const onMove = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY }
      decayUntil = performance.now() + 400
      if (!raf) raf = requestAnimationFrame(frame)
    }
    const onLeave = () => {
      pointer = null
      decayUntil = performance.now() + 400
      if (!raf) raf = requestAnimationFrame(frame)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduced, touch])

  if (reduced || touch) return null

  return (
    <svg
      ref={ref}
      className="calib"
      preserveAspectRatio="none"
      aria-hidden="true"
      role="presentation"
    >
      {TICKS.map((t, i) => (
        <line
          key={i}
          x1={`${t.x}%`}
          y1={`${t.y}%`}
          x2={`${t.x}%`}
          y2={`${t.y + t.len}%`}
          stroke="var(--hairline)"
          strokeWidth="1"
          opacity="0.04"
        />
      ))}
    </svg>
  )
}
