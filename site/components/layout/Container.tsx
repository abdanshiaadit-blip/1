import type { ElementType, ReactNode, Ref } from 'react'

/** §6.4 — max width 1360px, gutters 64 / 40 / 20. */
export function Container({
  as: Tag = 'div',
  className,
  children,
}: {
  as?: ElementType
  className?: string
  children: ReactNode
}) {
  return <Tag className={['container-h', className].filter(Boolean).join(' ')}>{children}</Tag>
}

/** §6.4 — 12 / 8 / 4 columns. Placements come from the fixed set only. */
export function Grid({
  className,
  ref,
  children,
}: {
  className?: string
  ref?: Ref<HTMLDivElement>
  children: ReactNode
}) {
  return (
    <div ref={ref} className={['grid-h', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}
