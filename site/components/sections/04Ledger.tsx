'use client'

import { useRef } from 'react'
import { Section } from '@/components/layout/Section'
import { Container, Grid } from '@/components/layout/Container'
import { reveal, sceneTimeline, staggerFrom, useSectionAnimation } from '@/lib/animation'
import { PINNED_QUERY, UNPINNED_QUERY } from '@/lib/tokens'

const SCENE_COUNT = 2

const ROWS = [
  { step: 'Book a blood test', status: 'Solved. Labs collect at home in 2,500+ towns.', solved: true },
  { step: 'Understand the numbers', status: 'Solved, and free. Any chatbot will explain a report.', solved: true },
  { step: 'Know what to fix first', status: 'Nobody does this.', solved: false },
  { step: 'Come back and check it worked', status: 'Nobody does this.', solved: false },
]

/**
 * 04-ledger — the spine of the argument.
 *
 * Pinned with CSS sticky inside a track of declared height (Law 5, Law 6);
 * ScrollTrigger only reads progress and never touches layout. Every step
 * of the timeline derives from that progress, so scrolling backwards is
 * automatically correct.
 *
 * The resting state — solved rows receded, unsolved rows forward, closing
 * paragraphs present — is the finished argument. The timeline runs it
 * backwards from there.
 */
export function Ledger() {
  const root = useRef<HTMLElement>(null)

  useSectionAnimation(root, ({ root: node }) => {
    const track = node.querySelector('[data-scene-track]')
    if (!track) return
    const tl = sceneTimeline(track)

    // `from` animates towards the resting CSS value rather than a number
    // repeated here, so the recession level lives in one place only.
    tl.from('[data-ledger-row="solved"]', { opacity: 1, duration: 0.25 }, 0.2)
      .from('[data-ledger-dot]', { opacity: 0, duration: 0.25 }, 0.2)
      .from('[data-ledger-row="open"]', { x: 12, duration: 0.25 }, 0.45)
      // Weight is never animated (Law 3). Two identically-boxed copies of
      // the same text crossfade instead — the one sanctioned use of
      // absolute positioning on this site.
      .from('[data-ledger-name="heavy"]', { opacity: 0, duration: 0.25 }, 0.45)
      .to('[data-ledger-name="light"]', { opacity: 0, duration: 0.25 }, 0.45)
    staggerFrom(
      tl,
      node.querySelectorAll('[data-ledger-close] > *'),
      { opacity: 0, duration: 0.3 },
      { stagger: 0.05, at: 0.7 },
    )
  }, { query: PINNED_QUERY })

  // §04 mobile — no pinning. The final two rows are emphasised from the
  // start rather than animated into emphasis; only the standard reveal runs.
  useSectionAnimation(
    root,
    ({ root: node }) => {
      reveal(node.querySelectorAll('[data-ledger-row]'), { trigger: node.querySelector('[data-ledger-rows]')! })
      reveal(node.querySelectorAll('[data-ledger-close] > *'), {
        trigger: node.querySelector('[data-ledger-close]')!,
      })
    },
    { query: UNPINNED_QUERY },
  )

  return (
    <Section
      id="04-ledger"
      labelledBy="04-ledger-heading"
      className="ledger"
      style={{ ['--scene-count' as string]: SCENE_COUNT }}
      ref={root}
    >
      <div className="scene-track" data-scene-track>
        <div className="scene-sticky">
          <Container className="ledger__container">
            <Grid>
              <div className="place-wide">
                <h2 id="04-ledger-heading" className="t-h2 measure-head">
                  Four things have to happen. Two of them already do.
                </h2>

                <ul className="ledger__rows" data-ledger-rows>
                  {ROWS.map((row) => (
                    <li
                      key={row.step}
                      className="ledger__row"
                      data-ledger-row={row.solved ? 'solved' : 'open'}
                    >
                      <span className="ledger__name t-h3">
                        {row.solved ? (
                          row.step
                        ) : (
                          <>
                            <span aria-hidden="true" className="ledger__name-copy" data-ledger-name="light">
                              {row.step}
                            </span>
                            <span className="ledger__name-copy" data-ledger-name="heavy">
                              {row.step}
                            </span>
                          </>
                        )}
                      </span>
                      <span className="ledger__status t-body">
                        {row.solved && (
                          <span aria-hidden="true" className="ledger__dot" data-ledger-dot />
                        )}
                        {row.status}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="ledger__close" data-ledger-close>
                  <p className="t-body measure-body">
                    Explaining a blood report used to be worth money. It isn’t any more.
                  </p>
                  <p className="t-body measure-body">
                    So we don’t sell explanations. We built the twelve weeks after the report — the part
                    where you find out what to do, do it, and get proof that it changed.
                  </p>
                </div>
              </div>
            </Grid>
          </Container>
        </div>
      </div>
    </Section>
  )
}
