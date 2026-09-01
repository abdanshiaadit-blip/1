import type { ReactNode } from 'react'

/**
 * Two buttons, and the site has no third. Solid forest for the one thing we
 * ask anyone to do; a hairline outline for everything else. Never a gradient
 * fill — the gradient budget is one element per screen and it is spent
 * elsewhere.
 */
export function Button({
  href,
  children,
  variant = 'primary',
  external = false,
  className = '',
}: {
  href: string
  children: ReactNode
  variant?: 'primary' | 'secondary'
  external?: boolean
  className?: string
}) {
  const rel = external ? 'noopener noreferrer' : undefined
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={rel}
      className={`btn btn--${variant} t-button ${className}`}
    >
      <span>{children}</span>
      <svg
        className="btn__arrow"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h13M13 6l6 6-6 6" />
      </svg>
    </a>
  )
}
