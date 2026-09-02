import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

type Variant = 'primary' | 'secondary'

const cls = (variant: Variant, onDark: boolean, extra?: string) =>
  ['btn', `btn--${variant}`, onDark ? 'btn--on-dark' : '', extra ?? ''].filter(Boolean).join(' ')

/** §6.6 — primary and secondary. No arrow glyph in the label, ever. */
export function Button({
  variant = 'primary',
  onDark = false,
  className,
  children,
  ...rest
}: { variant?: Variant; onDark?: boolean; children: ReactNode } & ComponentProps<'button'>) {
  return (
    <button className={cls(variant, onDark, className)} {...rest}>
      {children}
    </button>
  )
}

export function ButtonLink({
  variant = 'primary',
  onDark = false,
  className,
  children,
  ...rest
}: { variant?: Variant; onDark?: boolean; children: ReactNode } & ComponentProps<typeof Link>) {
  return (
    <Link className={cls(variant, onDark, className)} {...rest}>
      {children}
    </Link>
  )
}
