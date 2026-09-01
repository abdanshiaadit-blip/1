import type { Config } from 'tailwindcss'

/* Tailwind is here for layout utilities only. Every colour, size and easing
   on this site is a CSS custom property declared in globals.css, so the
   scroll maths can read the same numbers the styles do. */
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--canvas)',
        'canvas-2': 'var(--canvas-2)',
        'canvas-3': 'var(--canvas-3)',
        surface: 'var(--surface)',
        forest: 'var(--forest)',
        'forest-deep': 'var(--forest-deep)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        'ink-3': 'var(--ink-3)',
        'ink-inv': 'var(--ink-inv)',
        'ink-inv-2': 'var(--ink-inv-2)',
        jade: 'var(--jade)',
        'jade-deep': 'var(--jade-deep)',
        teal: 'var(--teal)',
        blue: 'var(--blue)',
        sand: 'var(--sand)',
        clay: 'var(--clay)',
      },
      maxWidth: { page: 'var(--max)', text: 'var(--max-text)' },
      borderRadius: { sm: 'var(--r-sm)', md: 'var(--r-md)', lg: 'var(--r-lg)', pill: 'var(--r-pill)' },
    },
  },
  plugins: [],
} satisfies Config
