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

    // Home renders p.priorities[0] and the first unfinished experiment.
    check(p.priorities.some((x) => x.rank === 1), 'no rank-1 priority')
    check(p.experiments.some((e) => !e.readout), 'no active experiment')
    void experiments
  }

  if (problems.length) {
    console.error(`HUMAN data integrity — ${problems.length} problem(s):\n` + problems.join('\n'))
  }
  return problems
}
