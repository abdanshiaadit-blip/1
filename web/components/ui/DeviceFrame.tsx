'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * The phone.
 *
 * Three rules from the brief govern this component, and they are the reason
 * it looks the way it does:
 *
 *  - The screen has a fixed aspect ratio and is never cropped, masked, or
 *    scaled below 0.9. The frame sizes itself to the space it is given by
 *    `--device-w`; the screen inside always keeps 390 × 844.
 *  - Only the frame may move. Screens inside it change with opacity and a
 *    12px Y-translate and nothing else.
 *  - The tilt is at most four degrees, follows the pointer with an eased lag,
 *    and does not exist on touch or under reduced motion.
 */
export function DeviceFrame({
  children,
  label,
  tilt = true,
  className = '',
}: {
  children: ReactNode
  label: string
  tilt?: boolean
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node || !tilt) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let tx = 0
    let ty = 0
    let x = 0
    let y = 0
    let raf = 0

    const loop = () => {
      x += (tx - x) * 0.08
      y += (ty - y) * 0.08
      node.style.setProperty('--mx', x.toFixed(4))
      node.style.setProperty('--my', y.toFixed(4))
      raf = Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001 ? requestAnimationFrame(loop) : 0
    }

    const move = (e: PointerEvent) => {
      const r = node.getBoundingClientRect()
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const leave = () => {
      tx = 0
      ty = 0
      if (!raf) raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', move, { passive: true })
    node.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      node.removeEventListener('pointerleave', leave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [tilt])

  return (
    <div ref={ref} className={`device ${className}`} role="img" aria-label={label}>
      <div className="device__body">
        <div className="device__screen">{children}</div>
      </div>
    </div>
  )
}
