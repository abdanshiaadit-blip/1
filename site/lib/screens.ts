/**
 * §9.2 — the image contract.
 *
 * Filenames are fixed and referenced by the code. Real exports are
 * 1170 × 2532 PNG (iPhone 15 Pro at 3×) with a 780 × 1688 set for srcset.
 * The placeholders in /public/app match that contract exactly, so
 * swapping in real screenshots requires zero layout changes.
 */

export const SCREENS = {
  's1-home': {
    src: '/app/s1-home.png',
    alt: 'The app’s daily screen, showing today’s actions with a single tap to confirm each one.',
  },
  's2-results': {
    src: '/app/s2-results.png',
    alt: 'A timeline of every blood test, past report and prescription, kept in one place.',
  },
  's3-marker': {
    src: '/app/s3-marker.png',
    alt: 'A single blood marker with its value, its range and a one-sentence explanation of what it means.',
  },
  's4-score': {
    src: '/app/s4-score.png',
    alt: 'The HUMAN Score, body age, and how the kidneys, liver and metabolism are ageing.',
  },
  's5-priorities': {
    src: '/app/s5-priorities.png',
    alt: 'The three things worth fixing this quarter, ranked, with the first one named.',
  },
  's6-plan': {
    src: '/app/s6-plan.png',
    alt: 'The quarter’s plan, written as everyday food and movement rather than clinical instructions.',
  },
  's7-progress': {
    src: '/app/s7-progress.png',
    alt: 'Weekly progress measured against your own previous results rather than a population range.',
  },
  's8-coach': {
    src: '/app/s8-coach.png',
    alt: 'The coach, answering a question using only advice a doctor has approved.',
  },
} as const

export type ScreenId = keyof typeof SCREENS
