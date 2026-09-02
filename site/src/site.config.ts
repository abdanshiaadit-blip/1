/* ─────────────────────────────────────────────────────────────────────────────
   The four values the specification leaves open (spec 16, spec 11).
   Each is a single edit. Nothing else in the codebase hardcodes them.
   ───────────────────────────────────────────────────────────────────────────── */

export const config = {
  /* spec 8.1 / 8.13 carry a <MONTH> token. It is not confirmed, and spec rule 2
     forbids inventing copy, so until a month is set the two lines fall back to
     wording that claims no date. Set this to e.g. 'January' and both lines
     become the specified copy exactly. */
  launchMonth: null as string | null,

  /* spec 8.11: "Build the price as a single config value so that change is a
     one-line edit." The GST slab is unconfirmed, so GST is stated, never
     absorbed. */
  price: {
    monthly: '₹999 a month',
    annual: '₹11,999 a year, plus GST',
    barLabel: '₹999 a month',
    heroMicroPrice: '₹999 a month, plus GST',
  },

  /* spec 11: entity name and domain are required before launch. */
  domain: 'humanhealth.in',
  email: 'hello@humanhealth.in',
  entity: null as string | null,
  year: 2026,

  /* The waitlist has no backend yet. spec 2.2 requires in-place confirmation
     and no navigation; the submit handler is the only place a real endpoint
     needs wiring. */
  waitlistEndpoint: null as string | null,
} as const

export function copyrightLine(): string {
  return `© ${config.year} ${config.entity ?? 'HUMAN'}`
}
