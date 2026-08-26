/* Dev-only referential integrity check.
   Every cross-reference in a Profile must resolve — a dangling marker or
   priority id renders as a silently missing row rather than an error, so we
   surface it loudly during development. Tree-shaken out of production. */

import type { Profile } from './types'

export function validateProfiles(profiles: Record<string, Profile>) {
  const problems: string[] = []

  for (const [key, p] of Object.entries(profiles)) {
    const markers = new Set(p.biomarkers.map((b) => b.id))
    const systems = new Set(p.systems.map((s) => s.id))
    const priorities = new Set(p.priorities.map((x) => x.id))
    const actions = new Set(p.actions.map((a) => a.id))
    const experiments = new Set(p.experiments.map((e) => e.id))

    const check = (ok: boolean, msg: string) => {
      if (!ok) problems.push(`[${key}] ${msg}`)
    }

    p.systems.forEach((s) =>
      s.markerIds.forEach((m) => check(markers.has(m), `system "${s.id}" → unknown marker "${m}"`)),
    )
    p.biomarkers.forEach((b) => {
      check(systems.has(b.systemId), `marker "${b.id}" → unknown system "${b.systemId}"`)
      if (b.relatedPriorityId)
        check(priorities.has(b.relatedPriorityId), `marker "${b.id}" → unknown priority "${b.relatedPriorityId}"`)
    })
    p.priorities.forEach((x) => {
      check(systems.has(x.systemId), `priority "${x.id}" → unknown system "${x.systemId}"`)
      x.evidenceMarkerIds.forEach((m) =>
        check(markers.has(m), `priority "${x.id}" → unknown evidence marker "${m}"`),
      )
      x.actionIds.forEach((a) => check(actions.has(a), `priority "${x.id}" → unknown action "${a}"`))
    })
    p.actions.forEach((a) =>
      check(priorities.has(a.priorityId), `action "${a.id}" → unknown priority "${a.priorityId}"`),
    )
    p.experiments.forEach((e) =>
      check(priorities.has(e.priorityId), `experiment "${e.id}" → unknown priority "${e.priorityId}"`),
    )
    p.intel.contributions.forEach((c) =>
      check(systems.has(c.systemId), `intel contribution → unknown system "${c.systemId}"`),
    )
    p.insights.forEach((i) =>
      check(systems.has(i.systemId), `insight "${i.id}" → unknown system "${i.systemId}"`),
    )
    p.timeline.forEach((t) => {
      if (t.systemId) check(systems.has(t.systemId), `timeline "${t.id}" → unknown system "${t.systemId}"`)
    })
    p.womens?.insights.forEach((i) =>
      i.linkedMarkerIds.forEach((m) =>
        check(markers.has(m), `womens insight "${i.id}" → unknown marker "${m}"`),
      ),
    )
    p.womens?.connectedMarkerIds.forEach((m) =>
      check(markers.has(m), `womens connected → unknown marker "${m}"`),
    )

    /* ---- Biological Age ------------------------------------------------
       The estimate is the primary metric on HOME, so an incoherent one is
       worse than a missing one: it would read as authoritative and be wrong. */
    const b = p.bioAge
    check(b.chronological === p.user.age, `bioAge.chronological ${b.chronological} != user.age ${p.user.age}`)
    check(
      Math.abs(b.delta - (b.estimate - b.chronological)) < 0.051,
      `bioAge.delta ${b.delta} does not equal estimate − chronological (${(b.estimate - b.chronological).toFixed(1)})`,
    )
    check(b.history.length > 1, 'bioAge history needs at least two points')
    const lastPoint = b.history[b.history.length - 1]
    check(
      Math.abs(lastPoint.estimate - b.estimate) < 0.051,
      `bioAge history ends at ${lastPoint.estimate}, but estimate is ${b.estimate}`,
    )
    check(
      Math.abs(b.history[0].estimate - b.baseline.estimate) < 0.051,
      'bioAge history does not start at the stated baseline',
    )
    b.systems.forEach((sa) => {
      check(systems.has(sa.systemId), `bioAge system → unknown system "${sa.systemId}"`)
      check(
        Math.abs(sa.delta - (sa.estimate - b.chronological)) < 0.051,
        `bioAge system "${sa.systemId}" delta ${sa.delta} does not match its estimate`,
      )
      sa.signalIds.forEach((m) =>
        check(markers.has(m), `bioAge system "${sa.systemId}" → unknown marker "${m}"`),
      )
      check(
        sa.drivers.some((d) => d.kind === 'positive'),
        `bioAge system "${sa.systemId}" has no positive contributor`,
      )
    })
    // Every body system should carry an age, or the detail view is incomplete.
    p.systems.forEach((sys) =>
      check(
        b.systems.some((sa) => sa.systemId === sys.id),
        `system "${sys.id}" has no biological-age estimate`,
      ),
    )

    /* ---- AI Coach -------------------------------------------------------
       Every reference is a deep link. A dangling one renders a dead chip. */
    const refOk = (r: { kind: string; id?: string }, where: string) => {
      switch (r.kind) {
        case 'biomarker': return check(!!r.id && markers.has(r.id), `${where} → unknown marker "${r.id}"`)
        case 'system':
          return check(
            !!r.id && (systems as Set<string>).has(r.id),
            `${where} → unknown system "${r.id}"`,
          )
        case 'systemage':
          return check(
            !!r.id && b.systems.some((sa) => sa.systemId === r.id),
            `${where} → unknown system age "${r.id}"`,
          )
        case 'priority':
        case 'retest':
          return check(!!r.id && priorities.has(r.id), `${where} → unknown priority "${r.id}"`)
        case 'experiment':
          return check(!!r.id && experiments.has(r.id), `${where} → unknown experiment "${r.id}"`)
        case 'readout':
          return check(
            !!r.id && p.experiments.some((e) => e.id === r.id && e.readout),
            `${where} → "${r.id}" has no readout`,
          )
        case 'womens':
          return check(!!p.womens, `${where} → women's health referenced but absent`)
        default:
          return
      }
    }
    p.coach.opener.refs.forEach((r) => refOk(r, 'coach opener'))
    const promptIds = new Set<string>()
    p.coach.prompts.forEach((q) => {
      check(!promptIds.has(q.id), `duplicate coach prompt id "${q.id}"`)
      promptIds.add(q.id)
      check(q.answer.blocks.length > 1, `coach prompt "${q.id}" has fewer than two blocks`)
      q.answer.refs.forEach((r) => refOk(r, `coach prompt "${q.id}"`))
    })

    // Home renders p.priorities[0] and the first unfinished experiment.
    check(p.priorities.some((x) => x.rank === 1), 'no rank-1 priority')
    check(p.experiments.some((e) => !e.readout), 'no active experiment')
  }

  if (problems.length) {
    console.error(`HUMAN data integrity — ${problems.length} problem(s):\n` + problems.join('\n'))
  }
  return problems
}
