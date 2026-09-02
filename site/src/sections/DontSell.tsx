/**
 * 7.9 What we don't sell — 110vh flow. BRIEF.md Part 7.9.
 *
 * "Convert product restraint into trust. The stiller half of the page begins
 * here."
 *
 * One beat. A hairline strike draws through each item while the text drops
 * from `text` to `text-3`. The strike IS the rule. That is the section's only
 * animation — and naming a competitor, or saying "unlike others", would be
 * weaker than letting the strike do the comparison silently.
 */

import FrameCell from '../components/FrameCell'
import Print from '../components/Print'
import Rule from '../components/Rule'
import Section from '../components/Section'
import { useTriggered } from '../lib/motion'

const ITEMS = ['A ring', 'A sensor', 'Supplements', 'Powders', 'A separate charge to explain your report']

export default function DontSell() {
  const [ref, on] = useTriggered<HTMLDivElement>()

  return (
    <Section id="dont-sell" vh={110} vhMobile={90}>
      <div className="page grid12 sell__grid" ref={ref}>
        <FrameCell name="sell-head" cols={[1, 6]} className="sell__head">
          <h2 className="t-display-m">
            <Print>We have nothing else to sell you.</Print>
          </h2>

          <ul className="sell__list">
            {ITEMS.map((item, i) => (
              <li key={item} className={`sell__item ${on ? 'is-struck' : ''}`} style={{ transitionDelay: `${i * 90}ms` }}>
                <span className="t-body-l sell__text">{item}</span>
                <span className="sell__strike" aria-hidden="true">
                  <Rule origin="left" duration={340} delay={i * 90} />
                </span>
              </li>
            ))}
          </ul>
        </FrameCell>

        <FrameCell name="sell-body" cols={[8, 12]} className="sell__body">
          <Print delay={480} stagger>
            <p className="t-body">
              A company that sells you a pill has a reason to find you a deficiency. We
              don&rsquo;t sell anything you swallow or wear, so the plan can say &ldquo;more dal
              and a walk after dinner&rdquo; with nothing riding on it.
            </p>
            <p className="t-body">
              We read from the watch and the cycle app you already use. Their tracking is
              better than ours and will stay better.
            </p>
            <p className="t-body">
              <strong className="sell__who">Who this is for.</strong> Women aged twenty-eight
              to fifty-two, and men the same age. Plenty of people join for a parent. All of it
              is the same price.
            </p>
          </Print>
        </FrameCell>
      </div>
    </Section>
  )
}
