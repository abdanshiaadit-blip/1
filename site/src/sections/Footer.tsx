/**
 * 7.14 Footer — 60vh. BRIEF.md Part 7.14.
 *
 * The medical scope line is permanent, not a hover or a disclosure.
 * No social icons unless the accounts exist and are active.
 * No newsletter field — there is already a waitlist.
 */

import FrameCell from '../components/FrameCell'
import Section from '../components/Section'
import { ENTITY, DOMAIN } from '../lib/constants'

export default function Footer() {
  return (
    <Section id="footer" vh={60} vhMobile={60}>
      <footer className="page grid12 foot__grid">
        <FrameCell name="foot-brand" cols={[1, 5]} className="foot__brand">
          <p className="foot__mark">HUMAN</p>
          <p className="t-body foot__promise">Preventive health, built for India.</p>
        </FrameCell>

        <FrameCell name="foot-legal" cols={[7, 12]} className="foot__legal">
          {/* Verbatim, and permanent — not a hover, not a disclosure.
              Part 7.14's own block prints two sentences; Part 1.4 requires all
              three "in the footer and in the pricing section, VERBATIM", and
              Part 12.6 tests for it. The compliance rule wins. */}
          <p className="t-caption foot__scope">
            HUMAN supports your health decisions. It does not replace your doctor. If something
            in your results looks urgent, we will tell you to see one.
          </p>
          <p className="t-caption foot__links">
            <a href="/privacy">Privacy</a>
            <span aria-hidden="true"> · </span>
            <a href="/terms">Terms</a>
            <span aria-hidden="true"> · </span>
            <a href={`mailto:hello@${DOMAIN}`}>hello@{DOMAIN}</a>
          </p>
          <p className="t-telemetry foot__copy">© 2026 {ENTITY}</p>
        </FrameCell>
      </footer>
    </Section>
  )
}
