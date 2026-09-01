import { useEffect, useRef } from 'react'
import { useReveal } from '../lib/hooks'
import Words from '../components/Words'
import { founder } from '../content/founder'

/* ==========================================================================
   10 · Founder.

   No profile card, no title block, no "meet the team" grid. One person,
   first person, four sentences — and only what the project materials
   actually support.

   Name, portrait and reel are optional. If site/src/content/founder.ts has
   them, they render; if not, the section stands on the words alone rather
   than on invented detail.
   ========================================================================== */

/** Plays when it enters view, pauses when it leaves. Never autoplays into an
 *  empty room, and never fights a reduced-motion preference. */
function Reel({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) void v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.4 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      className="fnd__media"
      src={src}
      poster={poster || undefined}
      muted
      loop
      playsInline
      preload="metadata"
      controls
    />
  )
}

export default function Founder() {
  const head = useReveal<HTMLDivElement>()
  const body = useReveal<HTMLDivElement>()
  const hasMedia = Boolean(founder.reel || founder.portrait)

  return (
    <section className="hu-sec fnd" id="founder" aria-labelledby="fnd-title">
      <div className="wrap">
        <div ref={head.ref} className={`fnd__head headrev ${head.shown ? 'in' : ''}`}>
          <span className="cap">{founder.eyebrow}</span>
          <Words
            as="h2"
            id="fnd-title"
            className="display fnd__title"
            text={founder.title}
            shown={head.shown}
          />
        </div>

        <div
          ref={body.ref}
          className={`fnd__grid ${hasMedia ? 'fnd__grid--media' : ''} rev ${body.shown ? 'in' : ''}`}
        >
          {hasMedia && (
            <figure className="fnd__figure">
              {founder.reel ? (
                <Reel src={founder.reel} poster={founder.reelPoster} />
              ) : (
                <img
                  className="fnd__media"
                  src={founder.portrait}
                  alt={founder.name ? `${founder.name}, ${founder.role} of HUMAN` : 'The founder of HUMAN'}
                  loading="lazy"
                  decoding="async"
                />
              )}
            </figure>
          )}

          <div className="fnd__words">
            {founder.lines.map((l) => (
              <p key={l} className="fnd__line">
                {l}
              </p>
            ))}

            {founder.name && (
              <p className="fnd__sign">
                <span className="fnd__name">{founder.name}</span>
                <span className="fnd__role">{founder.role}</span>
              </p>
            )}
          </div>

          {/* Previous experience, and what it taught. Never presented as a
              HUMAN product. */}
          <aside className="fnd__prev">
            <span className="cap">{founder.previous.label}</span>
            <p className="fnd__prevname">{founder.previous.name}</p>
            <p className="fnd__prevwhat">{founder.previous.what}</p>
            <p className="fnd__prevlearned">{founder.previous.learned}</p>
          </aside>
        </div>
      </div>
    </section>
  )
}
