'use client'

import { useRef } from 'react'
import { Section } from '@/components/layout/Section'
import { Container, Grid } from '@/components/layout/Container'
import { reveal, useSectionAnimation } from '@/lib/animation'
import { MOTION_QUERY } from '@/lib/tokens'

const BLOCKS = [
  {
    name: 'Indian reference levels.',
    body: 'Indian bodies carry risk at different thresholds. A cholesterol number that is fine in a European reference range is not automatically fine here, and neither is a waist measurement. We use the levels that apply to you.',
  },
  {
    name: 'Indian food.',
    body: 'Your plan is built out of what is already in your kitchen. More dal, different oil, the walk after dinner. Not almond flour and quinoa.',
  },
  {
    name: 'Blood drawn at your door.',
    body: 'Labs already collect at home across 2,500+ towns. We use that network rather than building our own, which is the only reason a yearly membership works at this price.',
  },
  {
    name: 'Your cycle, if you have one.',
    body: 'Results read differently at different points in a cycle. The app syncs it, and takes it into account rather than ignoring it.',
  },
]

/** 13-india — built here, for bodies here. No cards; text blocks with a
 *  1px top rule each. The only section using --paper-raised as its ground. */
export function India() {
  const root = useRef<HTMLElement>(null)

  useSectionAnimation(
    root,
    ({ root: node }) => {
      reveal(node.querySelectorAll('[data-india-heading]'), { stagger: 0 })
      reveal(node.querySelectorAll('[data-india-block]'), { stagger: 0.06 })
    },
    { query: MOTION_QUERY },
  )

  return (
    <Section id="13-india" tone="raised" labelledBy="13-india-heading" ref={root}>
      <Container>
        <Grid>
          <div className="place-wide">
            <h2 id="13-india-heading" className="t-h2 measure-head" data-india-heading>
              Built here, for bodies here.
            </h2>

            <div className="india">
              {BLOCKS.map((block) => (
                <div key={block.name} className="india__block" data-india-block>
                  <h3 className="t-h3">{block.name}</h3>
                  <p className="t-body india__text">{block.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Grid>
      </Container>
    </Section>
  )
}
