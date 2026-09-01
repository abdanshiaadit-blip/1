'use client'

import type { ElementType, ReactNode } from 'react'
import { useInView } from '@/lib/useInView'

/**
 * The one reveal on the site: opacity 0 → 1 and 16px of Y, 720ms, staggered
 * 60ms between siblings. It fires once and never re-hides.
 *
 * `i` is the position in its stagger group; groups are capped at six because
 * a seventh sibling would arrive nearly half a second after the first, which
 * reads as a fault rather than as choreography.
 */
export function Reveal({
  children,
  as: Tag = 'div',
  i = 0,
  className = '',
  ...rest
}: {
  children: ReactNode
  as?: ElementType
  i?: number
  className?: string
} & Record<string, unknown>) {
  const { ref, seen } = useInView<HTMLDivElement>()
  return (
    <Tag
      ref={ref}
      className={`reveal ${seen ? 'is-in' : ''} ${className}`}
      style={{ ['--i' as string]: Math.min(i, 5) }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
