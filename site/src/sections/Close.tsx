/**
 * 7.13 The close — 105vh flow. BRIEF.md Part 7.13.
 *
 * Full-bleed statement panel. One of only two centred compositions on the site.
 *
 * "The scarcity is real, so state it flatly." A hundred and fifty is a hard
 * operational cap on the first batch, which is why it is allowed to appear
 * here when nothing else on this site pretends to be urgent.
 *
 * Delivered with no pressure at all. No date, no counter, no "filling fast",
 * no progress bar, no countdown. The number is doing the work; anything added
 * to it reads as a tactic and costs the credibility 7.10 just bought.
 */

import Button from '../components/Button'
import FrameCell from '../components/FrameCell'
import Print from '../components/Print'
import Section from '../components/Section'
import WaitlistForm from '../components/WaitlistForm'
import { PROTOTYPE_URL } from '../lib/constants'

export default function Close() {
  return (
    <Section id="close" vh={105} vhMobile={90} wash>
      <div className="page close__wrap" id="waitlist">
        <FrameCell name="close" className="close__cell">
          <h2 className="t-display-l close__h">
            <Print stagger>
              <span className="line">150 places</span>
              <span>in the first batch.</span>
            </Print>
          </h2>

          <Print delay={200}>
            <p className="t-body-l close__sub">
              We&rsquo;re not open yet. Have a look at what we&rsquo;ve built, and leave your
              number — we&rsquo;ll message you when it opens.
            </p>
          </Print>

          <div className="close__form">
            <WaitlistForm />
          </div>

          <div className="close__actions">
            <Button variant="ghost" href={PROTOTYPE_URL}>
              Try the prototype
            </Button>
          </div>

          <p className="t-caption close__micro">
            No spam. One message when we open. Leave with one word.
          </p>
          <p className="t-caption close__proto">It&rsquo;s a prototype, running on sample data.</p>

          {/* The tagline's second and final appearance. */}
          <p className="t-display-m close__tag">Know earlier. Act sooner.</p>
        </FrameCell>
      </div>
    </Section>
  )
}
