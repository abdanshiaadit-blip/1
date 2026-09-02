/**
 * 7.1 Boot + opening — 130vh. BRIEF.md Part 7.1.
 *
 * "In four seconds, on a phone, establish that this is an instrument and give
 * her a small, specific unease about her own body. Not fear. Unease."
 *
 * Everything in the type cell aligns to one optical left edge — headline, sub,
 * buttons, micro. One vertical axis. That single decision does more for
 * "expensive" than any animation on the page.
 *
 * What stays still: everything, after the boot. The hero does not have a
 * moving headline. Stillness after arrival is the point.
 */

import Button from '../components/Button'
import CalibrationField from '../components/CalibrationField'
import FrameCell from '../components/FrameCell'
import Print from '../components/Print'
import Rule from '../components/Rule'
import Ticks from '../components/Ticks'
import { PROTOTYPE_URL } from '../lib/constants'

export default function Hero({ booted = true }: { booted?: boolean }) {
  /* display-l, not display-xl. The type cell is cols 1-7 = 708px at the
     canonical width, and the longest headline line measures 946px at
     display-xl against 655px at display-l. Part 2.5 says the manually placed
     line breaks ARE the design, so the size gives way rather than the breaks:
     at display-xl this headline rewraps to four lines and the composition the
     brief specifies stops existing. */
  return (
    <section data-section="hero" className="hero">
      <div className="sec__horizon">
        <Rule origin="left" duration={900} tone="hairline" threshold={0.85} />
      </div>
      <div className="page grid12 hero__grid">
        <FrameCell name="hero-type" cols={[1, 7]} className="hero__type">
          {/* The rule the intro left behind. While the intro is on screen it
              owns the only rule there is; the hero's baseline appears already
              drawn at the handover rather than drawing a second one, which is
              the two-rules-on-screen failure 7.0.6 exists to prevent. */}
          <span data-hero-baseline className="hero__baselinewrap">
            <Rule
              origin="left"
              duration={680}
              className="hero__baseline"
              progress={booted ? undefined : 0}
            />
          </span>

          <h1 className="t-display-l hero__h">
            <Print stagger>
              <span className="hero__line">Your body has been</span>
              <span className="hero__line">telling you for years.</span>
            </Print>
          </h1>

          <Print delay={370}>
            <p className="t-body-l hero__sub hero__sub--desktop">
              HUMAN tests your blood, tells you the three things worth fixing, and tests you
              again twelve weeks later to show whether it worked.
            </p>
            <p className="t-body-l hero__sub hero__sub--mobile">
              HUMAN tests your blood, tells you what to fix, and tests you again twelve weeks
              later to show whether it worked.
            </p>
          </Print>

          <Print delay={425}>
            <div className="hero__actions">
              <Button variant="primary" onClick={goToWaitlist}>
                Join the waitlist
              </Button>
              <Button variant="ghost" href={PROTOTYPE_URL}>
                Try the prototype
              </Button>
            </div>
          </Print>

          <Print delay={480}>
            <p className="t-caption hero__micro">
              The first batch is 150 people. We&rsquo;re not open yet — the prototype is live,
              running on sample data.
            </p>
          </Print>
        </FrameCell>

        <FrameCell name="hero-field" cols={[9, 12]} className="hero__field">
          {/* Beat 2. Decorative, clipped to this cell, absent on touch and
              under reduced motion. It should read as an instrument noticing
              you — never as a particle field. */}
          <CalibrationField />
          {/* Five G3 ticks along the right edge, capped at five. */}
          <div className="hero__ticks">
            <Ticks count={5} orientation="vertical" delay={600} length={10} />
          </div>
        </FrameCell>
      </div>

      {/* One 40px vertical rule, bottom centre, drawing downward — once, never
          again. No mouse icon, no bouncing chevron, no "scroll" label. */}
      <div className="hero__cue" aria-hidden="true">
        <Rule origin="top" duration={900} />
      </div>
    </section>
  )
}

function goToWaitlist() {
  document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  window.setTimeout(() => document.getElementById('whatsapp')?.focus(), 700)
}
