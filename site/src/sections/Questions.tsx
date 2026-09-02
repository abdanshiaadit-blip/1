/**
 * 7.12 Questions — 140vh flow. BRIEF.md Part 7.12.
 *
 * Hairline-separated disclosure rows. No cards. Multiple may be open at once.
 *
 * Two things this section deliberately does not do: answer questions HUMAN
 * cannot answer yet (turnaround depends on an unsigned lab SLA), and name the
 * lab partner (the agreement is not signed).
 */

import Disclosure from '../components/Disclosure'
import FrameCell from '../components/FrameCell'
import Print from '../components/Print'
import Section from '../components/Section'

const QA: [string, string][] = [
  ['Who actually draws my blood?', 'A trained phlebotomist from our partner lab, at your home, at a time you choose. You don’t go anywhere.'],
  ['Is this a lab, or a doctor, or an app?', 'The lab does the testing. A doctor decides what the app is allowed to tell you. The app is where you read it, plan around it, and see whether it changed.'],
  ['What if my results look bad?', 'You’ll see it in plain words, not in red ink, and we’ll tell you clearly if it’s something to take to a doctor now rather than something to work on over twelve weeks.'],
  ['What if I miss the second test?', 'Someone calls you at week ten, eleven and twelve. That is a real person’s actual job here.'],
  ['What happens to my data?', 'It’s yours. It’s health data under India’s DPDP Act, we treat it that way, and we don’t sell it to anyone. You can ask us to delete it.'],
  ['Can I cancel?', 'Yes. You can stop the membership at any time, and you keep every result we’ve taken.'],
  ['Do I need to be ill for this to be worth it?', 'No. It’s most useful when nothing hurts yet — that’s the window where a number can still be changed.'],
  ['Why only 150 people?', 'Because the first batch is how we find out whether this works, and we want to run it with a group small enough that someone here can call every single one of them by name. Once we know what we’re doing, we’ll open it wider.'],
  ['How much will it cost?', 'We haven’t announced pricing. The waitlist hears first, before anyone else.'],
  ['When does it open?', 'We’re not putting a date on it until the lab agreement and the first group of members are settled. Rather than guess publicly, we’ll message the waitlist.'],
  ['Can I see it before I sign up?', 'Yes. The prototype is live and open to anyone — it runs on sample data, so nothing in it is a real person’s result.'],
  ['Is it different for men and women?', 'Yes. Same membership, different panel. Ferritin and a hormone workup on one side, testosterone on the other.'],
]

export default function Questions() {
  return (
    <Section id="questions" vh={140} vhMobile={100}>
      <div className="page grid12 qs__grid">
        <FrameCell name="qs-head" cols={[1, 4]} className="qs__head">
          <h2 className="t-display-m">
            <Print>Questions.</Print>
          </h2>
        </FrameCell>
        <FrameCell name="qs-list" cols={[6, 12]} className="qs__list">
          {QA.map(([q, a]) => (
            <Disclosure key={q} question={q} answer={a} />
          ))}
        </FrameCell>
      </div>
    </Section>
  )
}
