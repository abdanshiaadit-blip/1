/**
 * 7.10 What we can't tell you yet — 100vh flow. BRIEF.md Part 7.10.
 *
 * "The section no other health startup will run. It turns the company's
 * biggest gap — zero proof — into its most credible asset."
 *
 * One short rule above the block, then the paragraphs print as a SINGLE unit
 * (not staggered), then the signature prints alone after a 400ms gap. Three
 * ticks. Nothing else. There is no button in this section.
 *
 * The signature is the single appearance of Gambetta Italic on the whole site.
 * It signals that one sentence was written by a person, not a company.
 */

import FrameCell from '../components/FrameCell'
import Print from '../components/Print'
import Rule from '../components/Rule'
import Section from '../components/Section'
import Ticks from '../components/Ticks'

export default function DontKnow() {
  return (
    <Section id="dont-know" vh={100} vhMobile={80} wash>
      <div className="page grid12 know__grid">
        <FrameCell name="know" cols={[3, 10]} className="know__cell">
          <div className="know__rule">
            <Rule origin="left" duration={680} />
          </div>
          <Ticks count={3} gap={20} delay={760} className="know__ticks" />

          <h2 className="t-display-m know__h">
            <Print delay={370}>What we can&rsquo;t tell you yet.</Print>
          </h2>

          {/* One unit, deliberately. Staggering these would make an admission
              feel choreographed, which is the opposite of the point. */}
          <Print delay={640}>
            <div className="know__body">
              <p className="t-body-l">
                HUMAN hasn&rsquo;t launched. There are no members, no reviews and no results to
                show you, and I&rsquo;m not going to invent any.
              </p>
              <p className="t-body-l">
                Here is the honest position. Nobody in Indian preventive health has published
                how many people actually come back for the second test. Not us, not anyone. The
                first hundred and fifty members are how we find out.
              </p>
              <p className="t-body-l">Whatever that number turns out to be, we&rsquo;ll publish it.</p>
            </div>
          </Print>

          <Print delay={1040}>
            <p className="know__sign">Aadit Bhatt, founder</p>
          </Print>
        </FrameCell>
      </div>
    </Section>
  )
}
