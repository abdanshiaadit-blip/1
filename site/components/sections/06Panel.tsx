'use client'

import { useRef } from 'react'
import { Section } from '@/components/layout/Section'
import { Container, Grid } from '@/components/layout/Container'
import { BodyToggle, BodyPanels } from '@/components/ui/BodyToggle'
import { MarkerRow } from '@/components/ui/MarkerRow'
import { Tag } from '@/components/ui/Tag'
import { ADDED_MARKERS, CORE_GROUPS, CORE_TOTAL, PANEL_COPY, type Body } from '@/lib/content'
import { reveal, useSectionAnimation } from '@/lib/animation'
import { MOTION_QUERY } from '@/lib/tokens'

/**
 * 06-panel — the sharpest differentiator, demonstrated rather than
 * asserted: the visitor flips a switch and watches the panel change.
 *
 * Never pinned. Someone who wants to toggle back and forth must be free
 * to do it without being trapped in a scene.
 */
export function Panel() {
  const root = useRef<HTMLElement>(null)

  useSectionAnimation(
    root,
    ({ root: node }) => {
      reveal(node.querySelectorAll('[data-panel-reveal]'))
    },
    { query: MOTION_QUERY },
  )

  return (
    <Section id="06-panel" labelledBy="06-panel-heading" ref={root}>
      <Container>
        <Grid className="panel__head">
          <div className="place-split-a">
            <h2 id="06-panel-heading" className="t-h2 measure-head" data-panel-reveal>
              Everyone gets the same {CORE_TOTAL}. Then we add what your body actually needs.
            </h2>
            <p className="t-body measure-body panel__para" data-panel-reveal>
              The core panel covers thyroid, cholesterol, liver, kidney, blood sugar, vitamins and
              inflammation. That part is the same for everyone.
            </p>
            <p className="t-body measure-body panel__para" data-panel-reveal>
              What it misses is different for each body. So we add different things.
            </p>
            <div className="panel__toggle" data-panel-reveal>
              <BodyToggle idPrefix="panel" />
            </div>
          </div>

          <div className="place-split-b" data-panel-reveal>
            <h3 className="t-caption panel__list-heading">The core panel, for everyone</h3>
            <ul className="panel__tags">
              {CORE_GROUPS.map((group) => (
                <Tag key={group.name} name={group.name} count={group.count} />
              ))}
            </ul>
          </div>
        </Grid>

        <BodyPanels
          idPrefix="panel"
          women={<PanelState body="women" />}
          men={<PanelState body="men" />}
        />
      </Container>
    </Section>
  )
}

function PanelState({ body }: { body: Body }) {
  const copy = PANEL_COPY[body]
  return (
    <div className="grid-h panel__state">
      <div className="place-split-a">
        {copy.blocks.map((block) => (
          <div key={block.heading} className="panel__block">
            <h3 className="t-h3">{block.heading}</h3>
            {block.body.map((paragraph) => (
              <p key={paragraph} className="t-body measure-body panel__para">
                {paragraph}
              </p>
            ))}
          </div>
        ))}
        <p className="t-caption panel__note">{copy.note}</p>
      </div>

      <div className="place-split-b">
        <h3 className="t-caption panel__list-heading panel__list-heading--added">Added for you</h3>
        <ul className="panel__markers">
          {ADDED_MARKERS[body].map((marker) => (
            <MarkerRow key={marker.name} name={marker.name} value={marker.who} />
          ))}
        </ul>
      </div>
    </div>
  )
}
