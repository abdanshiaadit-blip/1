'use client'

import { useRef } from 'react'
import { Section } from '@/components/layout/Section'
import { Container, Grid } from '@/components/layout/Container'
import { staggerFrom, useSectionAnimation } from '@/lib/animation'
import { MOTION_QUERY } from '@/lib/tokens'

const REFUSALS = [
  {
    name: 'No device.',
    body: 'No ring, no band, no sensor. If you already wear something, we read from it. Their tracking is better than ours and will stay better — there is no reason for us to compete with it.',
  },
  {
    name: 'No supplements.',
    body: 'Nothing in your plan is something we profit from selling you. A company that sells you the pill has a reason to find you a deficiency. We don’t.',
  },
  {
    name: 'No explanations.',
    body: 'Reading a blood report used to be worth money. Any chatbot does it free now, so we give it away. What’s left worth paying for is knowing what to do, and finding out whether it worked.',
  },
]

/**
 * 11-refusals — trust, built by naming what HUMAN deliberately does not
 * do. No cards, no icons, no crossed-out symbols: the restraint is the
 * argument. The columnar treatment is structural, because this is genuine
 * three-part parallel content.
 */
export function Refusals() {
  const root = useRef<HTMLElement>(null)

  useSectionAnimation(
    root,
    ({ root: node, gsap }) => {
      const columns = gsap.utils.toArray<HTMLElement>(node.querySelectorAll('[data-refusal]'))
      const container = node.querySelector('[data-refusals]')!
      const tl = gsap.timeline({ scrollTrigger: { trigger: container, start: 'top 85%', once: true } })

      // Each rule draws 100ms before its column's text arrives.
      staggerFrom(
        tl,
        columns.map((column) => column.querySelector('[data-refusal-rule]')!),
        { scaleY: 0, scaleX: 0, duration: 0.5, ease: 'power3.out' },
        { stagger: 0.08 },
      )
      staggerFrom(
        tl,
        columns.map((column) => column.querySelector('[data-refusal-text]')!),
        { opacity: 0, y: 16, duration: 0.56, ease: 'power3.out' },
        { stagger: 0.08, at: 0.1 },
      )
    },
    { query: MOTION_QUERY },
  )

  return (
    <Section id="11-refusals" labelledBy="11-refusals-heading" ref={root}>
      <Container>
        <Grid>
          <div className="place-wide">
            <h2 id="11-refusals-heading" className="t-h2 measure-head">
              Three things we don’t sell you.
            </h2>

            <div className="refusals" data-refusals>
              {REFUSALS.map((refusal) => (
                <div key={refusal.name} className="refusals__column" data-refusal>
                  <span aria-hidden="true" className="refusals__rule" data-refusal-rule />
                  <div data-refusal-text>
                    <h3 className="t-h3">{refusal.name}</h3>
                    <p className="t-body refusals__body">{refusal.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Grid>
      </Container>
    </Section>
  )
}
