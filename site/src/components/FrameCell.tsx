/**
 * The non-overlap primitive. BRIEF.md Part 3.2.
 *
 * > At every breakpoint, each section is divided into a fixed set of named,
 * > non-intersecting rectangular cells. Every content element is assigned to
 * > exactly one cell. An element may never render outside its cell. Cells
 * > never intersect.
 *
 * Every content element on this site lives inside one of these. The cell
 * declares `overflow: hidden`, so an animation that would leave its cell is
 * clipped rather than permitted to escape — which is the difference between
 * a constitution and a good intention.
 *
 * `data-cell` is what tests/overlap.spec.ts reads: it walks content elements,
 * asks which cell each belongs to, and asserts that no two elements from
 * different cells intersect and that nothing extends past its own cell's box.
 */

import type { CSSProperties, ReactNode } from 'react'

interface Props {
  /** The cell's name. Unique within its section, and the identity the overlap
   *  test reports when something collides. */
  name: string
  children: ReactNode
  /** Desktop grid columns, 1–12 inclusive. There is always at least one full
   *  column of dead space between adjacent cells (Part 3.2), which the
   *  section's own layout is responsible for leaving. */
  cols?: [number, number]
  /** A text cell reserves a fixed height for its longest state so changing
   *  copy cannot resize it and push the cell below (Part 3.2). */
  minHeight?: number | string
  className?: string
  style?: CSSProperties
}

export default function FrameCell({
  name,
  children,
  cols,
  minHeight,
  className = '',
  style,
}: Props) {
  return (
    <div
      data-cell={name}
      className={`cell ${className}`}
      style={{
        ...(cols
          ? ({ '--cell-from': cols[0], '--cell-span': cols[1] - cols[0] + 1 } as CSSProperties)
          : null),
        ...(minHeight !== undefined ? { minHeight } : null),
        ...style,
      }}
    >
      {children}
    </div>
  )
}
