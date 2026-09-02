'use client'

import { useRef } from 'react'
import { Section } from '@/components/layout/Section'
import { Container, Grid } from '@/components/layout/Container'
import { reveal, useSectionAnimation } from '@/lib/animation'
import { MOTION_QUERY } from '@/lib/tokens'

const BLOCKS = [
  {
    name: 'A doctor decides what the app is allowed to say.',
    body: 'Every suggestion in your plan comes from a protocol a doctor has approved. The coach can answer anything you ask, but it can only answer from that protocol. It cannot invent advice, and it cannot go beyond what has been signed off.',
  },
  {
    name: 'Someone whose job is getting you back.',
    body: 'A care coordinator handles your bookings, your scheduling, and the week 10, 11 and 12 messages. Not automated reminders — a person.',
  },
  {
    name: 'And a scope we’re clear about.',
    body: 'HUMAN informs and supports your care. It is not a diagnosis, it does not replace your doctor, and if a result looks urgent we will tell you to see one.',
  },
]

/**
 * 14-people — who is accountable, including the medical scope. No
 * headshots, no team grid, no logos. The founder's note is the only
 * italic body copy on the site, because it is a genuine change of voice.
 */
export function People() {
  const root = useRef<HTMLElement>(null)

  useSectionAnimation(
    root,
    ({ root: node, gsap }) => {
      reveal(node.querySelectorAll('[data-people-block]'), { stagger: 0.06 })
      gsap.from(node.querySelector('[data-people-rule]'), {
        scaleX: 0,
        duration: 0.5,
        ease: 'power3.out',
        scrollTrigger: { trigger: node.querySelector('[data-people-note]'), start: 'top 85%', once: true },
      })
      reveal(node.querySelectorAll('[data-people-note] > *'), { delay: 0.16 })
    },
    { query: MOTION_QUERY },
  )

  return (
    <Section id="14-people" labelledBy="14-people-heading" ref={root}>
      <Container>
        <Grid>
          <div className="place-text">
            <h2 id="14-people-heading" className="t-h2 measure-head" data-people-block>
              Who stands behind the advice.
            </h2>

            {BLOCKS.map((block) => (
              <div key={block.name} className="people__block" data-people-block>
                <h3 className="t-h3">{block.name}</h3>
                <p className="t-body measure-body people__text">{block.body}</p>
              </div>
            ))}

            <span aria-hidden="true" className="people__rule rule-draw" data-people-rule />

            <div className="people__note" data-people-note>
              <h3 className="t-h3">A note from the founder</h3>
              <p className="t-lead people__quote">
                I’m Aadit. I’m studying nutrition and dietetics, and I built the first version of HUMAN on
                my own because I couldn’t find anything that did the part I actually wanted — the twelve
                weeks after the report.
              </p>
              <p className="t-lead people__quote">
                I built a company before this one and it failed. I learned more from that than from anything
                that worked. It’s also why the first person I brought in here is a doctor, not a marketer.
              </p>
            </div>
          </div>
        </Grid>
      </Container>
    </Section>
  )
}
