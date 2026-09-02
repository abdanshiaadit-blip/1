'use client'

import { useRef } from 'react'
import { Section } from '@/components/layout/Section'
import { Container, Grid } from '@/components/layout/Container'
import { WaitlistButton } from '@/components/waitlist/WaitlistButton'
import { reveal, useSectionAnimation } from '@/lib/animation'
import { MOTION_QUERY } from '@/lib/tokens'

/**
 * 15-waitlist — the only conversion on the site, and the last of its three
 * centred moments. Nothing else is in this section: no image, no phone, no
 * chart. Ending on emptiness after a dense page is the point.
 */
export function Waitlist() {
  const root = useRef<HTMLElement>(null)

  useSectionAnimation(
    root,
    ({ root: node }) => {
      reveal(node.querySelectorAll('[data-waitlist-item]'), { stagger: 0.08 })
    },
    { query: MOTION_QUERY },
  )

  return (
    <Section id="15-waitlist" tone="forest" navDark labelledBy="15-waitlist-heading" className="final" ref={root}>
      <Container>
        <Grid>
          <div className="place-centre final__content">
            <h2 id="15-waitlist-heading" className="t-h1 final__heading" data-waitlist-item>
              We’re opening to a small first group.
            </h2>
            <p className="t-body measure-body final__para" data-waitlist-item>
              The founding cohort is limited, and everyone in it pays the same price with no discounts. We’d
              rather start with a few people and get it right than open to everyone and find out later.
            </p>
            <p className="t-body measure-body final__para" data-waitlist-item>
              Leave your number and we’ll message you on WhatsApp when a place is available.
            </p>
            <div className="final__cta" data-waitlist-item>
              <WaitlistButton />
            </div>
            <p className="t-caption final__note" data-waitlist-item>
              No payment now. No spam. We’ll only message you about your place.
            </p>
          </div>
        </Grid>
      </Container>
    </Section>
  )
}
