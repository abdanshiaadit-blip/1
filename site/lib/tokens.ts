/**
 * Motion and stacking tokens (§7.2, §7.3, §8.7).
 * Mirrors the CSS custom properties in app/globals.css so GSAP and CSS
 * can never drift apart. Durations here are in seconds, as GSAP expects.
 */

export const DURATION = {
  instant: 0.08,
  quick: 0.18,
  base: 0.32,
  reveal: 0.56,
  scene: 0.8,
} as const

export const EASE = {
  out: 'cubic-bezier(0.22, 1, 0.36, 1)',
  inout: 'cubic-bezier(0.65, 0, 0.35, 1)',
  in: 'cubic-bezier(0.55, 0, 1, 0.45)',
  scrub: 'none',
} as const

/** §8.7 — six z-index values. No others exist in the codebase. */
export const Z = {
  base: 0,
  raised: 10,
  sticky: 20,
  nav: 100,
  overlay: 200,
  modal: 300,
} as const

/** §7.4 — the one reveal pattern, used everywhere. */
export const REVEAL = {
  y: 16,
  duration: DURATION.reveal,
  stagger: 0.06,
  maxStaggered: 6,
  /** Element's top edge reaches 85% of viewport height. */
  start: 'top 85%',
} as const

/**
 * §13.1 — 1024px is the animation boundary, and §7.8 makes reduced motion a
 * first-class mode. Those are two independent axes, so there are three
 * queries rather than two: pinning and scrubbing belong to the first,
 * the standard reveal to the first and second, and the third is always
 * silent because Law 1 makes the resting state already correct.
 */
export const DESKTOP_QUERY = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'
export const MOBILE_QUERY = '(max-width: 1023px) and (prefers-reduced-motion: no-preference)'
export const MOTION_QUERY = '(prefers-reduced-motion: no-preference)'
export const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Pinning additionally requires a viewport tall enough to hold a scene.
 * §10's engineering notes ask for 1024 × 640 to be verified, and a 100dvh
 * sticky child cannot hold a section's content at that height — so below
 * 760px tall a pinned section becomes the static, flowing layout each
 * section already specifies. Readability wins (§19.10).
 */
export const PINNED_QUERY =
  '(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)'
export const UNPINNED_QUERY =
  '(max-width: 1023px) and (prefers-reduced-motion: no-preference), (max-height: 759px) and (prefers-reduced-motion: no-preference)'

/** §7.5 — a 0.6s catch-up. Never `scrub: true`, which feels twitchy. */
export const SCRUB = 0.6
