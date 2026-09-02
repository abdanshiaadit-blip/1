'use client'

import { useRef } from 'react'
import { Section } from '@/components/layout/Section'
import { Container, Grid } from '@/components/layout/Container'
import { BodyToggle, BodyPanels } from '@/components/ui/BodyToggle'
import { CONDITIONS, type Body } from '@/lib/content'
import { reveal, useSectionAnimation } from '@/lib/animation'
import { MOTION_QUERY } from '@/lib/tokens'

/**
 * 12-conditions — where the visitor finds themselves, and the second
 * instance of the Body toggle.
 *
 * The women's state is longer and denser than the men's. That is the
 * honest state of the product and it is not artificially balanced; the
 * extra whitespace under the men's state is preferable to a reflow.
 */
export function Conditions() {
  const root = useRef<HTMLElement>(null)

  useSectionAnimation(
    root,
    ({ root: node }) => {
      reveal(node.querySelectorAll('[data-conditions-head] > *'))
      reveal(node.querySelectorAll('.body-panel[data-state="active"] [data-condition]'), { stagger: 0.07 })
    },
    { query: MOTION_QUERY },
  )

  return (
    <Section id="12-conditions" labelledBy="12-conditions-heading" ref={root}>
      <Container>
        <Grid>
          <div className="conditions__head" data-conditions-head>
            <h2 id="12-conditions-heading" className="t-h2 measure-head">
              What we’re looking for.
            </h2>
            <p className="t-body measure-body conditions__intro">
              These are the conditions that build quietly, that a blood test finds, and that most people
              don’t know to ask for.
            </p>
            <div className="conditions__toggle">
              <BodyToggle idPrefix="conditions" />
            </div>
          </div>

          <div className="conditions__body">
            <BodyPanels
              idPrefix="conditions"
              women={<ConditionList body="women" />}
              men={<ConditionList body="men" />}
            />
          </div>
        </Grid>
      </Container>
    </Section>
  )
}

function ConditionList({ body }: { body: Body }) {
  return (
    <ul className="conditions__list">
      {CONDITIONS[body].map((condition) => (
        <li key={condition.name} className="conditions__item" data-condition>
          <h3 className="t-h3">{condition.name}</h3>
          <p className="t-body measure-body conditions__text">{condition.body}</p>
        </li>
      ))}
    </ul>
  )
}
