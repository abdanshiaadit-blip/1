'use client'

import { useRef } from 'react'
import { Section } from '@/components/layout/Section'
import { Container, Grid } from '@/components/layout/Container'
import { reveal, sceneTimeline, useSectionAnimation } from '@/lib/animation'
import { PINNED_QUERY, UNPINNED_QUERY } from '@/lib/tokens'

const SCENE_COUNT = 2

const STEPS = [
  { verb: 'Test', body: 'A 96-marker panel, drawn at home, plus what your own body needs.' },
  { verb: 'Understand', body: 'Every marker in plain words, and one score for how you’re doing.' },
  { verb: 'Choose', body: 'We pick the three things worth fixing this quarter. Not all ninety-six.' },
  { verb: 'Act', body: 'One plan, built around Indian food and the levels Indian bodies need.' },
  { verb: 'Track', body: 'One tap a day. Your watch and cycle sync on their own.' },
  { verb: 'Improve', body: 'We retest at week 12 and show you whether it moved. Then the next thing.' },
]

const CENTRES = STEPS.map((_, i) => (1200 / STEPS.length) * i + 1200 / STEPS.length / 2)

/**
 * 05-loop — the product as a repeating cycle rather than a one-off
 * purchase. This is genuine sequential content, so numbering is
 * legitimate here and only here.
 *
 * The connecting line is a single path with `pathLength="1"`, so the draw
 * is resolution-independent and no pixel length is ever computed.
 */
export function Loop() {
  const root = useRef<HTMLElement>(null)

  useSectionAnimation(root, ({ root: node }) => {
    const track = node.querySelector('[data-scene-track]')
    if (!track) return
    const tl = sceneTimeline(track)

    tl.from('[data-loop-line]', { strokeDashoffset: 100, duration: 0.55 }, 0)
    STEPS.forEach((_, index) => {
      const at = 0.04 + (index / STEPS.length) * 0.5
      tl.from(`[data-loop-node="${index}"]`, { opacity: 0, duration: 0.06 }, at)
        .from(`[data-loop-step="${index}"] [data-loop-number]`, { opacity: 0, duration: 0.06 }, at)
        .from(`[data-loop-step="${index}"] [data-loop-verb]`, { opacity: 0, duration: 0.06 }, at + 0.02)
        .from(`[data-loop-step="${index}"] [data-loop-body]`, { opacity: 0, duration: 0.06 }, at + 0.04)
    })
    tl.from('[data-loop-return]', { strokeDashoffset: 100, duration: 0.2 }, 0.55).from(
      '[data-loop-close]',
      { opacity: 0, duration: 0.25 },
      0.75,
    )
  }, { query: PINNED_QUERY })

  // §05 mobile — the redesign, not a shrink: the connecting line becomes
  // vertical and draws downward as each step arrives with the standard
  // reveal. Nothing is scrubbed and nothing is pinned.
  useSectionAnimation(
    root,
    ({ root: node, gsap }) => {
      reveal(node.querySelectorAll('[data-loop-step]'), { stagger: 0.06 })
      gsap.from(node.querySelectorAll('[data-loop-stem]'), {
        scaleY: 0,
        duration: 0.4,
        ease: 'power3.out',
        stagger: 0.06,
        scrollTrigger: { trigger: node.querySelector('[data-loop-steps]'), start: 'top 85%', once: true },
      })
    },
    { query: UNPINNED_QUERY },
  )

  return (
    <Section
      id="05-loop"
      tone="forest"
      navDark
      labelledBy="05-loop-heading"
      className="loop"
      style={{ ['--scene-count' as string]: SCENE_COUNT }}
      ref={root}
    >
      <div className="scene-track" data-scene-track>
        <div className="scene-sticky">
          <Container className="loop__container">
            <Grid>
              <div className="place-full">
                <h2 id="05-loop-heading" className="t-h2 measure-head">
                  One loop, repeated for years.
                </h2>

                <div className="loop__rail">
                  {/* Both connector SVGs scale uniformly. Non-uniform
                      scaling makes the browser measure dashes in rendered
                      space while `pathLength` normalises against user
                      space, so the drawn line stops short of its own end
                      point — and it turns the step nodes into ellipses. */}
                  <svg className="loop__line-svg" viewBox="0 0 1200 40" aria-hidden="true">
                      {/* pathLength keeps the draw resolution-independent —
                          no pixel length is ever computed from geometry —
                          and 100 rather than 1 because GSAP rounds
                          stroke-dashoffset to whole units, which would
                          collapse a 0–1 range into an on/off switch. */}
                    <path
                      data-loop-line
                      d={`M ${CENTRES[0]} 20 L ${CENTRES[CENTRES.length - 1]} 20`}
                      stroke="var(--color-rule-on-dark)"
                      strokeWidth={1}
                      fill="none"
                      pathLength={100}
                      strokeDasharray={100}
                      strokeDashoffset={0}
                    />
                    {CENTRES.map((cx, index) => (
                      <circle
                        key={cx}
                        data-loop-node={index}
                        cx={cx}
                        cy={20}
                        r={4}
                        fill="var(--color-forest)"
                        stroke="var(--color-paper-on-dark-soft)"
                        strokeWidth={1}
                      />
                    ))}
                  </svg>

                  <ol className="loop__steps" data-loop-steps>
                    {STEPS.map((step, index) => (
                      <li key={step.verb} className="loop__step" data-loop-step={index}>
                        <span aria-hidden="true" className="loop__stem rule-draw--vertical" data-loop-stem />
                        <span className="t-caption loop__number" data-loop-number>
                          {index + 1}
                        </span>
                        <h3 className="t-h3 loop__verb" data-loop-verb>
                          {step.verb}
                        </h3>
                        {/* The paragraph's opacity belongs to the scrubbed
                            reveal; the inner span's belongs to the hover
                            brighten. Sharing one element would mean a CSS
                            transition and a GSAP tween writing the same
                            property, and GSAP would record the mid-transition
                            value as the tween's destination. */}
                        <p className="t-small loop__body" data-loop-body>
                          <span className="loop__body-inner">{step.body}</span>
                        </p>
                      </li>
                    ))}
                  </ol>

                  {/* The loop is drawn, not implied: the line returns from
                      step six to step one. Omitted on mobile, where the
                      stack closes with the words instead. */}
                  {/* This one scales uniformly. Under `preserveAspectRatio="none"`
                      a curve's rendered length no longer matches its user-space
                      length, so `pathLength` normalisation and the dash pattern
                      disagree and part of the curve shows through while it is
                      meant to be hidden. A straight line is unaffected, which is
                      why the connector above can still stretch. */}
                  <svg className="loop__return-svg" viewBox="0 0 1200 64" aria-hidden="true">
                    <path
                      data-loop-return
                      d={`M ${CENTRES[CENTRES.length - 1]} 0 C ${CENTRES[CENTRES.length - 1] + 90} 0 ${
                        CENTRES[CENTRES.length - 1] + 90
                      } 44 ${CENTRES[CENTRES.length - 1] - 30} 44 L ${CENTRES[0] + 30} 44 C ${
                        CENTRES[0] - 90
                      } 44 ${CENTRES[0] - 90} 0 ${CENTRES[0]} 0`}
                      stroke="var(--color-rule-on-dark)"
                      strokeWidth={1}
                      fill="none"
                      pathLength={100}
                      strokeDasharray={100}
                      strokeDashoffset={0}
                    />
                  </svg>

                  <p className="t-small loop__again">and again</p>
                </div>

                <p className="t-body measure-body loop__close" data-loop-close>
                  Not a report you get once. A membership that measures you, tells you what to fix, helps
                  you do it, and measures again.
                </p>
              </div>
            </Grid>
          </Container>
        </div>
      </div>
    </Section>
  )
}
