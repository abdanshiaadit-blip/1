'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { close, PROTOTYPE_URL, SCOPE_LINE } from '@/lib/content'

/**
 * 8 — Philosophy, then the founder, then the one thing we ask.
 *
 * The philosophy statement gets a whole screen with nothing else on it. That
 * restraint is the section: a sentence that has to share the frame with a
 * card and a button is not a statement, it is a caption.
 */
export function Close() {
  return (
    <section className="close on-dark" data-dark aria-labelledby="philo-h">
      <Philosophy />
      <Founder />
      <Cta />
      <Footer />
    </section>
  )
}

function Philosophy() {
  return (
    <div className="philo">
      <div className="philo__in wrap">
        <Reveal as="h2" id="philo-h" className="t-hero philo__h">
          {close.philosophy}
        </Reveal>
        <Reveal as="p" i={3} className="t-lede philo__sub">
          {close.tagline}
        </Reveal>
      </div>
    </div>
  )
}

function Founder() {
  const video = useRef<HTMLVideoElement>(null)

  /* Plays when it is on screen, pauses when it is not, and never has sound. */
  useEffect(() => {
    const el = video.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) void el.play().catch(() => {})
        else el.pause()
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className="founder" data-dark>
      <div className="wrap founder__grid">
        <Reveal as="figure" className="founder__figure">
          {/* The reel is supplied by the client. Until it is, the frame holds
              its own space at the right ratio so nothing shifts when it
              arrives — and it says what it is rather than showing a
              placeholder image pretending to be a person. */}
          {/* No <source> until the client supplies the reel. An element that
              points at a file which is not there is a 404 on every load and a
              broken control in the corner of the page. The frame holds the
              right ratio in the meantime, so nothing shifts when it lands. */}
          <video
            ref={video}
            className="founder__video"
            muted
            playsInline
            loop
            preload="metadata"
            poster="/founder-poster.svg"
            aria-label="Founder reel, coming from the client"
          />
        </Reveal>

        <Reveal as="div" i={1}>
          <p className="t-lede founder__body">{close.founder.body}</p>
          <p className="founder__sig">
            <span className="t-sub founder__name">{close.founder.name}</span>
            <span className="t-body founder__role"> · {close.founder.role}</span>
          </p>
        </Reveal>
      </div>
    </div>
  )
}

function Cta() {
  return (
    <div className="cta wrap">
      <Reveal as="h2" className="t-section cta__h">
        {close.cta.h2}
      </Reveal>
      <Reveal as="div" i={1}>
        <Button href={PROTOTYPE_URL} external>
          {close.cta.button}
        </Button>
      </Reveal>
      <Reveal as="p" i={2} className="t-body cta__sub">
        {close.cta.sub}
      </Reveal>
    </div>
  )
}

function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot__grid">
        <p className="foot__mark">HUMAN</p>
        <div>
          <p className="foot__scope">{SCOPE_LINE}</p>
          <p className="foot__meta">
            <span>Working app prototype</span>
            <a href="mailto:hello@human.health">hello@human.health</a>
            <span className="num">© {2026}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
