import { useProgress, useReveal } from '../lib/hooks'
import Words from '../components/Words'
import { india } from '../content/product'

/* ==========================================================================
   08 · Built for India.

   Quiet on purpose. No flag, no stock photography, no statistic — there is
   no sourced figure anywhere in this project, so there is none on this site.
   Six things that are simply true about how people here live, each one
   traceable to something the app actually does.
   ========================================================================== */

export default function India() {
  const { ref } = useProgress('through')
  const head = useReveal<HTMLDivElement>()

  return (
    <section ref={ref} className="hu-sec india" id="india" aria-labelledby="india-title">
      {/* Two slow layers. Depth, not movement for its own sake. */}
      <span className="india__layer india__layer--a" aria-hidden="true" />
      <span className="india__layer india__layer--b" aria-hidden="true" />

      <div className="wrap india__wrap">
        <div ref={head.ref} className={`india__head headrev ${head.shown ? 'in' : ''}`}>
          <span className="cap">{india.eyebrow}</span>
          <Words
            as="h2"
            id="india-title"
            className="display india__title"
            text={india.title}
            shown={head.shown}
          />
          <p className="lead india__lead">{india.lead}</p>
        </div>

        <ul className="india__list">
          {india.points.map((p, i) => (
            <Point key={p.k} k={p.k} v={p.v} i={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}

function Point({ k, v, i }: { k: string; v: string; i: number }) {
  const { ref, shown } = useReveal<HTMLLIElement>(0.2)
  return (
    <li
      ref={ref}
      className={`india__i rev ${shown ? 'in' : ''}`}
      style={{ transitionDelay: `${(i % 2) * 90}ms` }}
    >
      <h3 className="india__k">{k}</h3>
      <p className="india__v">{v}</p>
    </li>
  )
}
