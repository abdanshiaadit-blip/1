import { useApp } from '../state/app'
import { GlassCard, SectionHeader, Reveal, ListRow, Chip } from '../components/primitives'

export default function Profile() {
  const { p, openSheet } = useApp()
  const u = p.user

  return (
    <div className="scroll screen__scroll">
      <header className="pagehead">
        <h1 className="t-display">Profile</h1>
      </header>

      {/* -------------------------------------------------------- IDENTITY */}
      <section className="pad">
        <GlassCard className="idcard">
          <div className="idcard__av">{u.name.split(' ').map((n) => n[0]).join('')}</div>
          <div className="idcard__main">
            <div className="idcard__name">{u.name}</div>
            <div className="t-foot">
              {u.age} · {u.sex === 'male' ? 'Male' : 'Female'} · {u.city}
            </div>
            <div className="idcard__chips">
              <Chip state="optimal">{u.membership} member</Chip>
              <Chip>Since {u.memberSince}</Chip>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* ----------------------------------------------------------- HEALTH */}
      <Reveal>
        <section className="pad">
          <SectionHeader title="Your health context" />
          <p className="hint hint--top">
            Everything here feeds the Decision Engine. The more HUMAN knows, the more specific its
            recommendations become.
          </p>
          <GlassCard className="list">
            <ListRow title="Health goals" value={`${u.goals.length}`} onClick={() => openSheet('goals')} />
            <ListRow
              title="Medical history"
              value={`${u.conditions.length}`}
              onClick={() => openSheet('medical')}
            />
            <ListRow
              title="Family history"
              value={`${u.familyHistory.length}`}
              onClick={() => openSheet('medical')}
            />
            <ListRow
              title="Medications & supplements"
              value={`${u.medications.length + u.supplements.length}`}
              onClick={() => openSheet('medical')}
            />
            <ListRow
              title="Connected devices"
              value={`${u.devices.filter((d) => d.connected).length} of ${u.devices.length}`}
              onClick={() => openSheet('devices')}
              last
            />
          </GlassCard>
        </section>
      </Reveal>

      {/* ------------------------------------------------------ CARE CIRCLE */}
      <Reveal delay={40}>
        <section className="pad">
          <SectionHeader title="Care Circle" action="Manage" onAction={() => openSheet('careCircle')} />
          <GlassCard className="list">
            {p.careCircle.map((m, i) => (
              <ListRow
                key={m.id}
                title={m.name}
                sub={`${m.relation} · sees ${m.shares.length} of ${m.shares.length + m.locked.length} categories`}
                onClick={() => openSheet('careMember', m.id)}
                icon={
                  <span className="av av--lg" style={{ background: m.accent }}>
                    {m.initials}
                  </span>
                }
                last={i === p.careCircle.length - 1}
              />
            ))}
          </GlassCard>
          <p className="hint">
            Shared care, individual privacy. Sensitive categories stay locked unless you explicitly
            unlock them, per person.
          </p>
        </section>
      </Reveal>

      {/* -------------------------------------------------- ACCOUNT & SYSTEM */}
      <Reveal delay={60}>
        <section className="pad">
          <SectionHeader title="Account" />
          <GlassCard className="list">
            <ListRow
              title="Membership"
              sub={`HUMAN ${u.membership} · renews ${u.memberSince.split(' ')[0]} 2027`}
              onClick={() => openSheet('membership')}
            />
            <ListRow title="Reports & records" value={`${p.reports.length}`} onClick={() => openSheet('reports')} />
            <ListRow title="Privacy & data" onClick={() => openSheet('privacy')} />
            <ListRow title="Notifications" value="On" />
            <ListRow title="Sign out" last />
          </GlassCard>
        </section>
      </Reveal>

      <p className="footnote">
        HUMAN v1.0 · Prototype build. Health data is stored under India's Digital Personal Data
        Protection Act, 2023.
      </p>
      <div className="tabspace" />
    </div>
  )
}
