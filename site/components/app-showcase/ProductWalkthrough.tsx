'use client'

import { useRef } from 'react'
import { Container, Grid } from '@/components/layout/Container'
import { Phone, PhoneStack } from '@/components/app-showcase/Phone'
import { ScopeLine } from '@/components/ui/ScopeLine'
import { useBody } from '@/context/BodyContext'
import { EXAMPLE_MARKER } from '@/lib/content'
import { reveal, useSectionAnimation } from '@/lib/animation'
import { MOTION_QUERY, SCRUB } from '@/lib/tokens'
import type { ScreenId } from '@/lib/screens'

/**
 * Sections 07, 08 and 09 — the app showcase (§9.4).
 *
 * These three are the one sanctioned exception to "one component per
 * section" (§14.2). They share a single sticky rail, so they are built as
 * one component owning one GSAP context: three independent sticky boxes
 * flicker at the hand-off on fast scroll.
 *
 * The pattern itself is the safety argument. The phone never moves, so it
 * can never collide with text. The text is in normal flow, so it can never
 * be covered. The two columns never share coordinates.
 */

/** Every screen the rail will ever show, stacked from first paint. */
const LAYERS: ScreenId[] = [
  's2-results',
  's3-marker',
  's4-score',
  's5-priorities',
  's6-plan',
  's1-home',
  's7-progress',
  's8-coach',
]

type Scene = {
  lead: string
  body: string
  /** Index into LAYERS. */
  layer: number
  /** The zoom scene reuses the screen already on the rail (§9.5). */
  zoom?: boolean
  quote?: boolean
}

const SECTIONS: { id: string; heading: string; scenes: Scene[]; after?: string }[] = [
  {
    id: '07-results',
    heading: 'Eighty rows of numbers become something you can read.',
    scenes: [
      {
        lead: 'Every result, in one place.',
        body: 'Blood tests, past reports, prescriptions — one timeline you keep for years. Never a PDF you lose in your email.',
        layer: 0,
      },
      {
        lead: 'Every number, in plain words.',
        body: 'Each marker explained in a sentence, with what it means for you and why it matters. No jargon, no ranges you have to look up.',
        layer: 1,
      },
      {
        lead: 'One number for how you’re doing.',
        body: 'Your HUMAN Score, plus your body’s age and how your kidneys, liver and metabolism are ageing. One glance, then the detail underneath if you want it.',
        layer: 2,
      },
    ],
  },
  {
    id: '08-priorities',
    heading: 'A 96-marker report is 96 problems. We give you three.',
    scenes: [
      {
        lead: 'Three things, not ninety-six.',
        body: 'We rank what is worth fixing and name the one to start with this quarter. The other ninety-three are still there if you want them. Most people don’t.',
        layer: 3,
      },
      {
        lead: 'This quarter’s first job.',
        body: 'Your LDL cholesterol is high — that’s the one that warns of heart trouble. It’s your first job this quarter.',
        layer: 3,
        zoom: true,
        quote: true,
      },
      {
        lead: 'A plan you can actually follow.',
        body: 'More dal and vegetables, less fried food, a twenty-minute walk after dinner. Built around food you already eat, and the levels Indian bodies actually need.',
        layer: 4,
      },
    ],
    after: 'Every suggestion comes from a list a doctor has approved. The app cannot invent advice.',
  },
  {
    id: '09-daily',
    heading: 'One screen a day. One tap.',
    scenes: [
      {
        lead: 'Today, on one screen.',
        body: 'What to do today, and a single tap to confirm it. Workouts, medicine reminders, and a streak that quietly keeps you going.',
        layer: 5,
      },
      {
        lead: 'Compared to your own past.',
        body: 'Every number measured against your own last result, not a textbook range built for the whole population. Normal isn’t the goal. Better than last time is.',
        layer: 6,
      },
      {
        lead: 'Someone to ask.',
        body: 'A coach that has seen every result, every plan and every logged day, and answers whenever you ask. It can only say what our doctor has approved — it cannot make things up.',
        layer: 7,
      },
    ],
  },
]

const FLAT = SECTIONS.flatMap((section) => section.scenes)

export function ProductWalkthrough() {
  const root = useRef<HTMLDivElement>(null)
  const { body } = useBody()

  // Standard reveals run at every width; the rail itself is desktop only.
  useSectionAnimation(
    root,
    ({ root: node }) => {
      node.querySelectorAll('[data-rail-scene]').forEach((scene) => {
        reveal(scene.querySelectorAll('[data-rail-text] > *'), { trigger: scene })
      })
      reveal(node.querySelectorAll('[data-rail-heading]'), { stagger: 0 })
    },
    { query: MOTION_QUERY },
  )

  useSectionAnimation(root, ({ root: node, gsap }) => {
    const layers = gsap.utils.toArray<HTMLElement>(node.querySelectorAll('[data-screen-index]'))
    if (!layers.length) return

    // §9.4 — crossfade. Outgoing 1 → 0 over 320ms; incoming 0 → 1 over
    // 320ms starting at 120ms, so at every instant one screen is at 0.6 or
    // above and the phone is never blank.
    let current = 0
    const show = (next: number) => {
      if (next === current) return
      gsap.to(layers[current], { opacity: 0, duration: 0.32, ease: 'power2.inOut', overwrite: 'auto' })
      gsap.to(layers[next], {
        opacity: 1,
        duration: 0.32,
        delay: 0.12,
        ease: 'power2.inOut',
        overwrite: 'auto',
      })
      current = next
    }

    const scenes = gsap.utils.toArray<HTMLElement>(node.querySelectorAll('[data-rail-scene]'))
    scenes.forEach((scene, index) => {
      const layer = FLAT[index].layer
      gsap.timeline({
        scrollTrigger: {
          trigger: scene,
          start: 'center center',
          end: 'bottom center',
          onEnter: () => show(layer),
          onEnterBack: () => show(layer),
          onLeaveBack: () => show(FLAT[Math.max(index - 1, 0)].layer),
        },
      })
    })

    // §9.5 — the one scale transform on the site. Scrubbed to section 08's
    // own progress, so reversing the scroll reverses the zoom exactly.
    // The bezel does not scale; the viewport clips.
    // The blueprint's section ids begin with a digit, which is a valid
    // HTML id but not a valid CSS selector, so they are looked up by id.
    const eight = document.getElementById('08-priorities')
    const priorities = layers[3]
    if (eight && priorities) {
      gsap
        .timeline({
          scrollTrigger: { trigger: eight, start: 'top top', end: 'bottom bottom', scrub: SCRUB },
        })
        .fromTo(
          priorities,
          { scale: 1, transformOrigin: '50% 32%' },
          { scale: 1.75, transformOrigin: '50% 32%', ease: 'none', duration: 0.3 },
          0.35,
        )
        .to(priorities, { scale: 1.75, ease: 'none', duration: 0.2 }, 0.65)
        .to(priorities, { scale: 1, ease: 'none', duration: 0.15 }, 0.85)
    }
  })

  return (
    <div className="rail" ref={root}>
      <Container>
        <Grid>
          <div className="place-split-a rail__column">
            {SECTIONS.map((section) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}>
                <h2 id={`${section.id}-heading`} className="t-h2 measure-head" data-rail-heading>
                  {section.heading}
                </h2>

                {section.scenes.map((scene) => (
                  <div key={scene.lead} className="rail__scene" data-rail-scene>
                    <div data-rail-text>
                      <h3 className="t-body rail__lead">{scene.lead}</h3>
                      {scene.quote ? (
                        <p className="t-h3 rail__quote">{scene.body}</p>
                      ) : (
                        <p className="t-body measure-body rail__body">{scene.body}</p>
                      )}
                    </div>

                    {/* Mobile: the rail collapses and each block gets its
                        own phone in normal flow. The zoom scene has no
                        phone of its own — its caption does the work. */}
                    {!scene.zoom && (
                      <div className="rail__mobile-phone">
                        <Phone screen={LAYERS[scene.layer]} />
                      </div>
                    )}
                  </div>
                ))}

                {section.after && <p className="t-body measure-body rail__after">{section.after}</p>}

                <div className="rail__scope">
                  <ScopeLine />
                </div>
              </section>
            ))}
          </div>

          <div className="place-split-b rail__sticky-col">
            <div className="rail__sticky">
              <figure className="rail__figure">
                <PhoneStack screens={LAYERS} />
                <figcaption className="t-caption rail__caption">
                  Screens from the working app. The marker added for you here is {EXAMPLE_MARKER[body]}.
                </figcaption>
              </figure>
            </div>
          </div>
        </Grid>
      </Container>
    </div>
  )
}
