/**
 * BRIEF.md Part 9, components 9–11.
 *
 * Primary: jade-deep fill, 2px radius, 48px tall. Hover lightens the fill 8%.
 * No lift, no scale, no glow, no shadow, no arrow.
 * Ghost: transparent, hairline border, border brightens on hover.
 *
 * Sentence case, always. There are only two actions on this site and no third.
 */

import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  variant?: 'primary' | 'ghost'
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  full?: boolean
  id?: string
  className?: string
}

export default function Button({
  children,
  variant = 'primary',
  href,
  onClick,
  type = 'button',
  full = false,
  id,
  className = '',
}: Props) {
  const cls = `btn btn--${variant} ${full ? 'btn--full' : ''} ${className}`

  if (href) {
    // "Try the prototype" is the only external destination on the site, and it
    // always opens in a new tab with rel="noopener" (Part 5.6).
    return (
      <a className={cls} id={id} href={href} target="_blank" rel="noopener">
        {children}
      </a>
    )
  }
  return (
    <button className={cls} id={id} type={type} onClick={onClick}>
      {children}
    </button>
  )
}
