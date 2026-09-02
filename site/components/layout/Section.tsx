import type { CSSProperties, ReactNode, Ref } from 'react'

type Tone = 'paper' | 'raised' | 'forest'

const TONE_CLASS: Record<Tone, string> = {
  paper: 'bg-paper-section',
  raised: 'bg-raised-section',
  forest: 'bg-forest-section on-dark',
}

/**
 * Every section renders `<section id="NN-name">` as its root (§14.2) and
 * declares its own background. Colour changes between sections are hard
 * edges — there are no gradient transitions anywhere on this site.
 */
export function Section({
  id,
  tone = 'paper',
  className,
  style,
  labelledBy,
  navDark = false,
  ref,
  children,
}: {
  id: string
  tone?: Tone
  className?: string
  style?: CSSProperties
  labelledBy?: string
  /** Marks a section the nav must swap to light text over (§11.1). */
  navDark?: boolean
  ref?: Ref<HTMLElement>
  children: ReactNode
}) {
  return (
    <section
      ref={ref}
      id={id}
      data-nav-dark={navDark ? '' : undefined}
      aria-labelledby={labelledBy}
      className={['section-h', TONE_CLASS[tone], className].filter(Boolean).join(' ')}
      style={style}
    >
      {children}
    </section>
  )
}
