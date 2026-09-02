'use client'

import { useWaitlist } from './WaitlistProvider'

/**
 * §11.3 — every waitlist CTA on the site. Falls back to a link to
 * `/waitlist` when JavaScript is unavailable, so the conversion never
 * depends on the modal.
 */
export function WaitlistButton({
  variant = 'primary',
  onDark = false,
  className,
  children = 'Join the waitlist',
}: {
  variant?: 'primary' | 'secondary'
  onDark?: boolean
  className?: string
  children?: React.ReactNode
}) {
  const { open } = useWaitlist()
  const classes = ['btn', `btn--${variant}`, onDark ? 'btn--on-dark' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <a
      href="/waitlist"
      className={classes}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
        event.preventDefault()
        open()
      }}
    >
      {children}
    </a>
  )
}
