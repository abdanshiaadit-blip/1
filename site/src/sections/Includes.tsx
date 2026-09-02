/**
 * 7.11 What a membership includes — 115vh flow. BRIEF.md Part 7.11.
 *
 * One card. surface-1, 1px hairline, 24px radius, no shadow, no glow. No
 * tiers, no comparison table, no "from ₹…", no placeholder price, no "most
 * popular" badge.
 *
 * **No price appears here or anywhere else on the site.** The line "We
 * haven't announced pricing. The waitlist hears first." does two jobs: it
 * answers the question honestly, and it converts the absence of a price into
 * a reason to leave a number.
 */

import FrameCell from '../components/FrameCell'
import Print from '../components/Print'
import Section from '../components/Section'
import { usePrefersReducedMotion, useTriggered } from '../lib/motion'

const INCLUDES = [
  'Three blood draws at your home, at a time you pick',
  'Ninety-six markers at the start, and the same ninety-six again at month six',
  'Ferritin for every woman, testosterone for every man',
  'A hormone panel if your symptoms call for it',
  'Your week-twelve retest',
  'Your three priorities, re-chosen every quarter',
  'A daily plan, and a coach that answers any time',
]

export default function Includes() {
  const [ref, on] = useTriggered<HTMLDivElement>()
  const reduced = usePrefersReducedMotion()

  return (
    <Section id="includes" vh={115} vhMobile={95}>
      <div className="page grid12 inc__grid" ref={ref}>
        <FrameCell name="inc-card" cols={[3, 10]} className="inc__cell">
          {/* G1: the card's border draws as ONE CONTINUOUS RULE, 1400ms.
              A border-color transition would be a rule fading in, which Part
              4.11 names as breaking the language — so it is a real stroke,
              dashed into existence from the top-left and travelling the whole
              perimeter once. */}
          <div className="inc__card">
            <svg className="inc__border" aria-hidden="true" preserveAspectRatio="none">
              <rect
                className="inc__borderline m-anim"
                x="0.5"
                y="0.5"
                rx="23.5"
                ry="23.5"
                width="calc(100% - 1px)"
                height="calc(100% - 1px)"
                fill="none"
                stroke="var(--hairline)"
                strokeWidth="1"
                pathLength={1}
                style={{
                  strokeDasharray: 1,
                  strokeDashoffset: reduced || on ? 0 : 1,
                  transition: reduced ? 'none' : 'stroke-dashoffset 1400ms var(--ease-instrument)',
                }}
              />
            </svg>
            <h2 className="t-display-m inc__h">
              <Print delay={1400}>What a membership includes.</Print>
            </h2>

            {/* The inclusions print as a single block, not seven beats. */}
            <Print delay={1660}>
              <ul className="inc__list">
                {INCLUDES.map((line) => (
                  <li key={line} className="inc__item t-body">
                    <span className="glyph glyph--check" aria-hidden="true" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </Print>

            <Print delay={1960}>
              <p className="t-body-l inc__pricing">
                We haven&rsquo;t announced pricing. The waitlist hears first.
              </p>
            </Print>

            {/* Verbatim, and required here as well as in the footer. */}
            <p className="t-caption inc__scope">
              HUMAN supports your health decisions. It does not replace your doctor. If
              something in your results looks urgent, we will tell you to see one.
            </p>
          </div>
        </FrameCell>
      </div>
    </Section>
  )
}
