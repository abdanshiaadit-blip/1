/* ==========================================================================
   HUMAN — Profile: Aadit Rao
   34 · male · Bengaluru · member since Jun 2025 · loop cycle 3, stage ACT
   Demonstrates: Decision Engine, Experiment Engine, India-native intelligence,
   Passport, Outcome Intelligence.
   ========================================================================== */

import type { Profile } from './types'
import { adherence } from './util'

export const aadit: Profile = {
  user: {
    id: 'u_aadit',
    name: 'Aadit Rao',
    firstName: 'Aadit',
    sex: 'male',
    age: 34,
    city: 'Bengaluru',
    memberSince: 'June 2025',
    membership: 'Annual',
    goals: ['Reverse prediabetes risk', 'Protect heart health', 'Sustain energy through the day'],
    conditions: ['Prediabetes range (2025)', 'Grade 1 fatty liver (2024 USG)'],
    medications: [],
    supplements: [
      { name: 'Vitamin D3', dose: '60,000 IU weekly', since: 'Jul 2026' },
      { name: 'Methylcobalamin (B12)', dose: '1500 mcg daily', since: 'Jul 2026' },
    ],
    familyHistory: [
      { relation: 'Father', condition: 'Type 2 diabetes, diagnosed at 47' },
      { relation: 'Paternal grandfather', condition: 'Myocardial infarction at 58' },
      { relation: 'Mother', condition: 'Hypothyroidism' },
    ],
    devices: [
      { name: 'Apple Watch Series 10', kind: 'Activity · heart · sleep', connected: true },
      { name: 'Apple Health', kind: 'Steps · workouts', connected: true },
      { name: 'Oura Ring', kind: 'Sleep · recovery', connected: false },
    ],
  },

  intel: {
    score: 81,
    delta: 11,
    baselineScore: 70,
    history: [
      { date: 'Jun 25', score: 70, event: 'Baseline assessment' },
      { date: 'Sep 25', score: 72 },
      { date: 'Dec 25', score: 74, event: 'Cycle 1 review' },
      { date: 'Mar 26', score: 77 },
      { date: 'Jul 26', score: 81, event: 'Cycle 2 retest' },
    ],
    contributions: [
      { systemId: 'metabolic', weight: 22, state: 'attention' },
      { systemId: 'cardiovascular', weight: 20, state: 'monitor' },
      { systemId: 'nutritional', weight: 14, state: 'attention' },
      { systemId: 'liver', weight: 12, state: 'monitor' },
      { systemId: 'sleep', weight: 10, state: 'monitor' },
      { systemId: 'recovery', weight: 9, state: 'stable' },
      { systemId: 'hormonal', weight: 7, state: 'stable' },
      { systemId: 'thyroid', weight: 6, state: 'optimal' },
    ],
    methodNote:
      'Health Intelligence is a HUMAN composite of your body systems, weighted by how much each currently influences your long-term risk profile. It is a prototype construct for tracking your own change over time — not a validated clinical instrument, and not comparable between people.',
  },

  /* ---------------------------------------------------------------------
     Biological Age — the primary outcome on HOME.
     Baseline Jun 2025: 35.6 against a chronological 33 — 2.6 years OLDER.
     Now: 32.2 against 34 — 1.8 years younger. The gap has closed by 4.4
     years across three loop cycles, which is the whole thesis in one number.
     --------------------------------------------------------------------- */
  bioAge: {
    chronological: 34,
    estimate: 32.2,
    delta: -1.8,
    previous: 33.3,
    previousDate: '20 Mar 2026',
    baseline: { date: 'Jun 2025', estimate: 35.6, chronological: 33 },
    trend: 'improving',
    headline: '1.8 years younger than your age',
    summary:
      'Your current estimate reflects the health signals HUMAN has available across your health profile. At baseline you estimated 2.6 years older than your age; you now estimate 1.8 years younger.',
    basis: '68 markers across 4 assessments since June 2025, alongside 14 months of wearable and logged signals.',
    methodNote:
      'Your biological age is an estimate based on the health signals currently available to HUMAN. It is not a medical diagnosis, it is not a clinically validated instrument, and it does not predict disease or lifespan. A move of this size over 14 months reflects how responsive the estimate is to the signals HUMAN holds — read the direction of travel, not the exact figure.',
    history: [
      { date: 'Jun 25', estimate: 35.6, chronological: 33, event: 'Baseline assessment' },
      { date: 'Sep 25', estimate: 35.2, chronological: 33 },
      { date: 'Dec 25', estimate: 34.5, chronological: 33, event: 'Cycle 1 review' },
      { date: 'Mar 26', estimate: 33.3, chronological: 34 },
      { date: 'Jul 26', estimate: 32.2, chronological: 34, event: 'Cycle 2 retest' },
    ],
    systems: [
      {
        systemId: 'metabolic',
        estimate: 36.2,
        delta: 2.2,
        trend: 'improving',
        since: -1.6,
        interpretation: 'The one area currently estimating older than you are — and the one moving fastest.',
        why: 'Your metabolic estimate is influenced by the health signals currently available to HUMAN, including your glucose markers, lipid profile, activity and sleep timing. HbA1c at 5.9% and fasting insulin at 14.2 hold it above your chronological age; four consecutive falls in both, and a much higher evening step count, are what have pulled it down 1.6 years since March.',
        signalIds: ['hba1c', 'insulin', 'trig', 'hdl', 'glucose'],
        lifestyleSignals: [
          { label: 'Evening step count', value: '3,180 · from 1,240', state: 'optimal' },
          { label: 'Post-dinner walks', value: '18 of 30 sessions', state: 'monitor' },
          { label: 'Sleep timing consistency', value: '±92 min', state: 'monitor' },
        ],
        drivers: [
          {
            kind: 'positive',
            label: 'Regular post-meal movement',
            detail: 'Evening steps up from 1,240 to 3,180 a day since the Dinner Walk Protocol began.',
          },
          {
            kind: 'positive',
            label: 'Improved glucose markers',
            detail: 'HbA1c 6.2 → 5.9% and fasting glucose 111 → 104 mg/dL across four measurements.',
          },
          {
            kind: 'opportunity',
            label: 'Fasting insulin still well above optimal',
            detail: '14.2 µIU/mL sits inside the lab range but far above the 3–8 we would consider optimal.',
          },
          {
            kind: 'opportunity',
            label: 'Inconsistent sleep timing',
            detail: 'Your sleep midpoint moves ±92 minutes across the week, which is associated with poorer glucose handling.',
          },
        ],
      },
      {
        systemId: 'nutritional',
        estimate: 35.4,
        delta: 1.4,
        trend: 'drifting',
        since: 0.6,
        interpretation: 'Your current nutrition-related signals are an opportunity for improvement.',
        why: 'This estimate is shaped mainly by vitamin D at 18 ng/mL, B12 at the low end of range and a mildly raised homocysteine. Iron stores are comfortable. Supplementation only began in July, after your last draw, so nothing here has been re-measured yet.',
        signalIds: ['vitd', 'b12', 'homocysteine', 'ferritin'],
        lifestyleSignals: [
          { label: 'Vitamin D3 adherence', value: 'Weekly · 4 of 6 doses', state: 'optimal' },
          { label: 'Direct sun exposure', value: 'Low · indoor work', state: 'monitor' },
        ],
        drivers: [
          {
            kind: 'positive',
            label: 'Repletion already underway',
            detail: 'Weekly vitamin D3 and daily B12 started 14 July, on schedule.',
          },
          {
            kind: 'opportunity',
            label: 'Vitamin D in the deficient range',
            detail: '18 ng/mL at your last draw, below the 30 ng/mL usually taken as sufficiency.',
          },
          {
            kind: 'opportunity',
            label: 'B12 low-normal with raised homocysteine',
            detail: '246 pg/mL alongside homocysteine 14.2 µmol/L — a pattern often seen together.',
          },
        ],
      },
      {
        systemId: 'cardiovascular',
        estimate: 34.8,
        delta: 0.8,
        trend: 'improving',
        since: -0.8,
        interpretation: 'Close to your age, held there by particle count rather than by cholesterol.',
        why: 'ApoB at 104 mg/dL and an elevated Lp(a) are what keep this estimate above your chronological age. Your LDL, blood pressure and falling hs-CRP pull the other way. Lp(a) is largely inherited and is treated here as fixed context, not as something the estimate expects you to change.',
        signalIds: ['apob', 'lpa', 'ldl', 'hscrp'],
        lifestyleSignals: [
          { label: 'Resting heart rate', value: '62 bpm · −6', state: 'optimal' },
          { label: 'Aerobic minutes', value: '148 / week', state: 'stable' },
        ],
        drivers: [
          {
            kind: 'positive',
            label: 'Inflammation trending down',
            detail: 'hs-CRP 3.1 → 2.4 mg/L across three measurements.',
          },
          {
            kind: 'positive',
            label: 'ApoB falling with your metabolic work',
            detail: '112 → 104 mg/dL since baseline, without a separate cardiovascular plan.',
          },
          {
            kind: 'opportunity',
            label: 'Elevated Lp(a) — inherited, not modifiable',
            detail: '42 mg/dL. It will not respond to your plan, and it raises the value of everything that will.',
          },
        ],
      },
      {
        systemId: 'sleep',
        estimate: 34.4,
        delta: 0.4,
        trend: 'drifting',
        since: 0.5,
        interpretation: 'Enough hours. It is the timing that moves this estimate.',
        why: 'Duration averages 6h 54m, which is adequate. The variability is the signal: your sleep midpoint moves by more than 90 minutes across the week, and that has widened slightly since March.',
        signalIds: [],
        lifestyleSignals: [
          { label: 'Average duration', value: '6h 54m', state: 'stable' },
          { label: 'Midpoint variability', value: '±92 min', state: 'monitor' },
          { label: 'Lights out by 11:30pm', value: '14 of 30 nights', state: 'monitor' },
        ],
        drivers: [
          {
            kind: 'positive',
            label: 'Duration is adequate and rising',
            detail: '6h 41m → 6h 54m since the current protocol began.',
          },
          {
            kind: 'opportunity',
            label: 'Irregular sleep timing',
            detail: 'A ±92 minute midpoint swing across the week, wider than it was in March.',
          },
        ],
      },
      {
        systemId: 'liver',
        estimate: 33.9,
        delta: -0.1,
        trend: 'improving',
        since: -1.7,
        interpretation: 'On track — and the fastest-improving system in your profile.',
        why: 'ALT and GGT are mildly raised, consistent with the grade 1 fatty liver reported in 2024. Both have fallen substantially since baseline, and AST is back inside range. Liver fat in this pattern moves with metabolic health, so your current plan is doing this work too.',
        signalIds: ['alt', 'ast', 'ggt'],
        lifestyleSignals: [{ label: 'Alcohol', value: 'Rare', state: 'optimal' }],
        drivers: [
          {
            kind: 'positive',
            label: 'ALT down a quarter since baseline',
            detail: '61 → 46 U/L across five measurements.',
          },
          {
            kind: 'positive',
            label: 'AST back inside range',
            detail: '41 → 32 U/L.',
          },
          {
            kind: 'opportunity',
            label: 'ALT and GGT not yet in the optimal band',
            detail: 'ALT 46 U/L against an optimal 10–30. Improving, not finished.',
          },
        ],
      },
      {
        systemId: 'hormonal',
        estimate: 30.6,
        delta: -3.4,
        trend: 'holding',
        since: -0.4,
        interpretation: 'A strength, with cortisol worth keeping an eye on.',
        why: 'Total testosterone at 512 ng/dL sits comfortably in the optimal band and has risen slowly since baseline. Morning cortisol has drifted upward across three measurements — still in range, but it is the one thing holding this estimate from going lower.',
        signalIds: ['testo', 'cortisol'],
        lifestyleSignals: [{ label: 'Reported work load', value: 'High · self-logged', state: 'monitor' }],
        drivers: [
          {
            kind: 'positive',
            label: 'Testosterone in the optimal band',
            detail: '486 → 512 ng/dL since baseline.',
          },
          {
            kind: 'opportunity',
            label: 'Cortisol drifting upward',
            detail: '16.8 → 19.4 µg/dL across three morning draws. In range, but the direction matters.',
          },
        ],
      },
      {
        systemId: 'thyroid',
        estimate: 29.2,
        delta: -4.8,
        trend: 'holding',
        since: -0.1,
        interpretation: 'Currently one of your strongest health areas.',
        why: 'TSH at 2.4 mIU/L and free T4 at 1.24 ng/dL are both in the middle of range and have been steady across four measurements. With your mother’s hypothyroidism we keep this on an annual check rather than dropping it.',
        signalIds: ['tsh', 'ft4'],
        lifestyleSignals: [],
        drivers: [
          {
            kind: 'positive',
            label: 'Stable across four measurements',
            detail: 'TSH 2.6 → 2.4 mIU/L with no drift in either direction.',
          },
          {
            kind: 'opportunity',
            label: 'Family history keeps it on the schedule',
            detail: 'A first-degree relative with hypothyroidism is why this stays measured yearly rather than dropped.',
          },
        ],
      },
      {
        systemId: 'recovery',
        estimate: 27.9,
        delta: -6.1,
        trend: 'improving',
        since: -2.3,
        interpretation: 'Your fitness signals are the strongest thing in your profile right now.',
        why: 'This estimate is built from wearable signals rather than blood: resting heart rate, heart-rate variability and activity. Your resting heart rate has fallen 6 bpm since the dinner walks began and HRV has edged up. These are supporting signals, not lab results, and HUMAN weights them accordingly.',
        signalIds: [],
        lifestyleSignals: [
          { label: 'Resting heart rate', value: '62 bpm · from 68', state: 'optimal' },
          { label: 'HRV', value: '54 ms · +6', state: 'optimal' },
          { label: 'Evening step count', value: '3,180 / day', state: 'optimal' },
        ],
        drivers: [
          {
            kind: 'positive',
            label: 'Resting heart rate down 6 bpm',
            detail: '68 → 62 bpm since 17 July, alongside the Dinner Walk Protocol.',
          },
          {
            kind: 'positive',
            label: 'HRV rising',
            detail: '48 → 54 ms over the same window.',
          },
          {
            kind: 'opportunity',
            label: 'Wearable signals are supporting evidence only',
            detail: 'They move faster than blood markers, so HUMAN reads them as early direction rather than as a result.',
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------------
     AI Coach — deterministic answers written against Aadit's own record.
     Every answer names real values from this profile. Nothing here claims
     access to data the prototype does not hold.
     --------------------------------------------------------------------- */
  coach: {
    headline: 'Metabolic health is still your biggest opportunity — and it is the one that is moving.',
    cta: 'Your metabolic health is improving. Want to understand why?',
    contextLine: 'Your health, understood in context.',
    context: [
      { label: 'Blood assessments', value: '4 since Jun 2025 · 68 markers' },
      { label: 'Biological age', value: '32.2 estimated · 8 systems' },
      { label: 'Experiments', value: '2 run · 30 days of adherence logged' },
      { label: 'Wearables', value: 'Apple Watch · sleep, heart rate, steps' },
      { label: 'History', value: 'Fatty liver 2024 · family history · supplements' },
      { label: 'Care Circle', value: '2 people · not used in your answers' },
    ],
    opener: {
      short:
        'Aadit — your estimated biological age fell to 32.2 at your July assessment, 1.8 years below your chronological age. Metabolic health is still the system estimating oldest, and it is the one your current plan is working on.',
      blocks: [
        {
          label: 'Where you are',
          body: 'Week 5 of 6 of the Dinner Walk Protocol, 18 of 30 sessions logged. Your plan review is on 28 August and the Metabolic Follow-up is due 2 September.',
        },
        {
          label: 'What I would ask me',
          body: 'Pick one of the questions below. I have your full record open — assessments, trends, experiments, adherence and what happened last time.',
        },
      ],
      refs: [
        { kind: 'bioage', label: 'Biological Age' },
        { kind: 'experiment', id: 'e_dinner_walk', label: 'Dinner Walk Protocol' },
      ],
    },
    prompts: [
      {
        id: 'q_bioage',
        question: 'Why did my biological age change?',
        chip: 'Why did my biological age change?',
        answer: {
          short:
            'Your estimate fell 1.1 years since March, to 32.2. The largest single change was in your recovery signals, with metabolic and liver close behind. Two systems moved the other way.',
          blocks: [
            {
              label: 'Why it changed',
              body: 'Recovery moved 2.3 years younger — resting heart rate 68 → 62 bpm and HRV 48 → 54 ms since the dinner walks began. Liver moved 1.7 years younger as ALT fell to 46 U/L, and metabolic moved 1.6 years younger on a fourth consecutive fall in HbA1c and fasting glucose.',
            },
            {
              label: 'What moved the wrong way',
              body: 'Nutritional drifted 0.6 years older — vitamin D at 18 ng/mL was still deficient at your July draw. Sleep drifted 0.5 years older as your midpoint variability widened to ±92 minutes.',
            },
            {
              label: 'What matters',
              body: 'Metabolic still estimates 2.2 years above your chronological age, so it remains the system with the most room in it. Your recovery gains are wearable signals — encouraging, and faster-moving than blood.',
            },
            {
              label: 'What to do',
              body: 'Nothing new. Finish the Dinner Walk Protocol — you have 12 days and 12 sessions left — and keep the weekly vitamin D3 going.',
            },
            {
              label: 'When to reassess',
              body: 'Plan review 28 August. The Metabolic Follow-up on 2 September is what will actually update the metabolic and nutritional parts of this estimate.',
            },
          ],
          refs: [
            { kind: 'bioage', label: 'Biological Age detail' },
            { kind: 'systemage', id: 'metabolic', label: 'Metabolic age' },
            { kind: 'systemage', id: 'recovery', label: 'Recovery age' },
            { kind: 'biomarker', id: 'vitd', label: 'Vitamin D' },
          ],
          safety:
            'Biological age here is a HUMAN estimate built from the signals available to it, not a measurement and not a diagnosis. Treat the direction as the signal rather than the decimal.',
        },
      },
      {
        id: 'q_focus',
        question: 'What should I focus on this month?',
        chip: 'What should I focus on this month?',
        answer: {
          short:
            'Finish what you started. Twelve days and twelve walk sessions remain, and the whole point of the September retest is to read a completed protocol rather than a half-run one.',
          blocks: [
            {
              label: 'Why this and not something else',
              body: 'HUMAN found four things worth acting on. Three are deliberately held back: your particle-count risk shares a root cause with this one, vitamin D repletion needs no daily decision from you, and sleep timing has one light action folded into the current plan.',
            },
            {
              label: 'What matters most',
              body: 'Adherence, not intensity. You are at 18 of 30 sessions. A marker that does not move after 60% adherence tells us something very different from one that does not move after 95% — and only one of those is worth acting on.',
            },
            {
              label: 'What to do',
              body: 'Walk after dinner five evenings a week for the next twelve days. Keep eating dal or sabzi before rice. Keep Sunday’s vitamin D3. Change nothing else — if several things move at once, September tells us nothing.',
            },
            {
              label: 'When to reassess',
              body: 'Review 28 August, retest 2 September. Your particle-count priority is queued for promotion at that review.',
            },
          ],
          refs: [
            { kind: 'priority', id: 'p_metabolic', label: 'Metabolic Reset' },
            { kind: 'experiment', id: 'e_dinner_walk', label: 'Dinner Walk Protocol' },
            { kind: 'priority', id: 'p_cardio', label: 'What is being held back' },
          ],
        },
      },
      {
        id: 'q_experiment',
        question: 'Is my Dinner Walk Protocol working?',
        chip: 'Is my current experiment working?',
        answer: {
          short:
            'The early signals are encouraging, but HUMAN needs the September measurement before concluding that the protocol is responsible for the change.',
          blocks: [
            {
              label: 'What you actually did',
              body: 'You have followed the protocol on 18 of the 30 days elapsed — 60% adherence, with a current 3-day streak. Evening step count rose from 1,240 to 3,180 a day over the same window.',
            },
            {
              label: 'What moved alongside it',
              body: 'Resting heart rate fell from 68 to 62 bpm and sleep duration edged up from 6h 41m to 6h 54m. Your self-rated energy went from 3.1 to 3.8 out of 5.',
            },
            {
              label: 'What that does and does not mean',
              body: 'These changes coincided with the protocol. Resting heart rate usually responds to sustained aerobic activity before blood markers do, so this is the sort of early movement we would expect if it is working — it is not evidence that it is. Nothing here has been re-measured in blood yet.',
            },
            {
              label: 'What to do',
              body: 'Continue unchanged to 28 August. At 60% adherence, pushing the remaining twelve sessions matters more than anything else you could add.',
            },
            {
              label: 'When to reassess',
              body: 'Readout at the 28 August review, then the Metabolic Follow-up on 2 September. HbA1c reflects roughly three months of glucose, so early September is the first point where a new value carries real information.',
            },
          ],
          refs: [
            { kind: 'experiment', id: 'e_dinner_walk', label: 'Protocol & adherence' },
            { kind: 'readout', id: 'e_chai_done', label: 'Your last readout' },
            { kind: 'retest', id: 'p_metabolic', label: 'September retest' },
          ],
          safety:
            'This is a structured observation of your own data over a fixed window, not a controlled trial. It can show what moved together. It cannot establish what caused what.',
        },
      },
      {
        id: 'q_bloods',
        question: 'Explain my latest blood test.',
        chip: 'Explain my latest blood test.',
        answer: {
          short:
            'Your 2 July panel — 68 markers — showed the fourth consecutive improvement in your metabolic and liver markers, with vitamin D still the clearest outstanding deficiency.',
          blocks: [
            {
              label: 'What looks good',
              body: 'Thyroid is steady and comfortably in range across four tests. Testosterone sits in the optimal band. Ferritin, AST and LDL are all where we would want them.',
            },
            {
              label: 'What changed',
              body: 'HbA1c 6.0 → 5.9%. Fasting glucose 106 → 104 mg/dL. ALT 49 → 46 U/L. ApoB 106 → 104 mg/dL. Every one of those moved in the right direction, and none of them moved dramatically — which is what sustained change usually looks like.',
            },
            {
              label: 'What deserves attention',
              body: 'Fasting insulin at 14.2 µIU/mL is inside the lab range but well above optimal. Triglycerides at 186 with HDL at 38 is the insulin-resistance pattern we are targeting. Vitamin D at 18 ng/mL is in the deficient range.',
            },
            {
              label: 'What matters most',
              body: 'Insulin. It is the marker that usually moves years before glucose does, and it is the reason HUMAN made metabolic health your priority even though no single number on this panel looks alarming.',
            },
            {
              label: 'What to do next',
              body: 'No change to the plan. The vitamin D3 you started on 14 July is already the answer to the nutritional finding — it just has not been re-measured yet.',
            },
            {
              label: 'When to retest',
              body: 'Metabolic Follow-up on 2 September: HbA1c, glucose, insulin, triglycerides, HDL, ALT, AST, GGT, vitamin D, B12 and hs-CRP. Twelve markers, not sixty-eight.',
            },
          ],
          refs: [
            { kind: 'biomarker', id: 'insulin', label: 'Fasting insulin' },
            { kind: 'biomarker', id: 'hba1c', label: 'HbA1c' },
            { kind: 'biomarker', id: 'vitd', label: 'Vitamin D' },
            { kind: 'retest', id: 'p_metabolic', label: 'What gets retested' },
          ],
          safety:
            'A prediabetes-range HbA1c together with an elevated Lp(a) and a father diagnosed at 47 is worth a physician review at your next consultation. HUMAN organises and explains results; it does not diagnose, and it does not replace that conversation.',
        },
      },
      {
        id: 'q_retest',
        question: 'What should I retest, and when?',
        chip: 'What should I retest?',
        answer: {
          short:
            'Eleven markers on 2 September. Not the full panel, and not sooner.',
          blocks: [
            {
              label: 'Why that date',
              body: 'HbA1c reflects roughly three months of average glucose. Your last draw was 2 July, so anything before late August would largely re-read the same period. Vitamin D takes eight to twelve weeks of supplementation to plateau, and you started on 14 July — the two schedules land in the same week.',
            },
            {
              label: 'Why not everything',
              body: 'Retesting all 68 markers would cost you more and tell you less. Lp(a) is genetic and will not have moved. Thyroid has been stable across four tests. Re-measuring only what your plan targets is what makes a change interpretable rather than noise.',
            },
            {
              label: 'What to do',
              body: 'Book the Metabolic Follow-up for the morning of 2 September, fasting, home collection. It is 12 markers and ₹1,499.',
            },
            {
              label: 'When to reassess',
              body: 'Results in 24 hours. That readout closes cycle 3 and decides whether your particle-count priority gets promoted.',
            },
          ],
          refs: [
            { kind: 'retest', id: 'p_metabolic', label: 'Metabolic Follow-up' },
            { kind: 'biomarker', id: 'lpa', label: 'Why Lp(a) is not retested' },
          ],
        },
      },
      {
        id: 'q_lpa',
        question: 'What does my Lp(a) actually mean for me?',
        chip: 'What does my Lp(a) mean?',
        answer: {
          short:
            'It is elevated at 42 mg/dL, it is largely inherited, and nothing in your plan will change it. It is context, not a target.',
          blocks: [
            {
              label: 'Why it is in your record at all',
              body: 'Lp(a) is set largely by your genes and stays broadly stable through life. HUMAN measured it once so that we know it. It is rarely included in routine Indian health packages, and elevated levels are more prevalent in South Asian populations.',
            },
            {
              label: 'What it changes',
              body: 'It does not change what you do. It changes how seriously HUMAN treats everything you can change. With an elevated Lp(a) and a grandfather who had a heart attack at 58, your ApoB, insulin and blood pressure carry more weight than the numbers alone would suggest.',
            },
            {
              label: 'What to do',
              body: 'Nothing specific to Lp(a). Continue the metabolic work — ApoB has already fallen from 112 to 104 mg/dL without a separate cardiovascular plan.',
            },
            {
              label: 'When to reassess',
              body: 'Not scheduled for retest. It is included in the Cardiovascular Deep Dive if your clinician wants a fuller picture.',
            },
          ],
          refs: [
            { kind: 'biomarker', id: 'lpa', label: 'Lipoprotein(a)' },
            { kind: 'biomarker', id: 'apob', label: 'ApoB' },
            { kind: 'systemage', id: 'cardiovascular', label: 'Cardiovascular age' },
          ],
          safety:
            'An elevated Lp(a) alongside your family history is worth raising with a physician. It does not mean an event is coming, and HUMAN cannot tell you your cardiovascular risk — a clinician can put this in context properly.',
        },
      },
      {
        id: 'q_learned',
        question: 'What have you learned about me so far?',
        chip: 'What have you learned about me?',
        answer: {
          short:
            'Three things, across three loop cycles. The most useful one is about how you stick to protocols, not about your blood.',
          blocks: [
            {
              label: 'What holds for you',
              body: 'Protocols attached to an existing daily habit have held far better than ones needing a new time slot — dinner walk 60% and chai reduction 84%, against morning gym 31% in cycle 1. That is why your current plan hangs off dinner rather than off 6am.',
            },
            {
              label: 'What moves together',
              body: 'Your HbA1c has moved most in the periods when your evening step count was highest, and your ALT falls alongside your triglycerides rather than independently.',
            },
            {
              label: 'What that does not mean',
              body: 'These are observations about one person over a small number of measurements. They do not establish cause — other things changed in every one of those windows.',
            },
            {
              label: 'What to do',
              body: 'When we design cycle 4 in September, we will attach it to an existing habit by default rather than asking you to build a new one.',
            },
          ],
          refs: [
            { kind: 'readout', id: 'e_chai_done', label: 'Sugar-in-Chai readout' },
            { kind: 'passport', label: 'Health Passport' },
          ],
        },
      },
    ],
  },

  loop: {
    stage: 'ACT',
    stageSince: '17 Jul 2026',
    nextReviewDate: '28 Aug',
    nextReviewIn: 13,
    cycleNumber: 3,
  },

  systems: [
    {
      id: 'metabolic',
      name: 'Metabolic',
      state: 'attention',
      score: 68,
      headline: 'Glucose handling is your highest-leverage area',
      summary:
        'HbA1c sits in the prediabetes range and your triglyceride-to-HDL ratio suggests your body is working hard to clear glucose after meals. This is the system your current plan is built around.',
      markerIds: ['hba1c', 'glucose', 'trig', 'hdl', 'insulin'],
      metric: { label: 'HbA1c', value: '5.9', unit: '%' },
      series: [6.2, 6.1, 6.1, 6.0, 5.9],
      seriesLabel: 'HbA1c · 14 months',
    },
    {
      id: 'cardiovascular',
      name: 'Cardiovascular',
      state: 'monitor',
      score: 74,
      headline: 'Particle count matters more than your cholesterol number',
      summary:
        'Your LDL cholesterol looks unremarkable, but ApoB — the count of atherogenic particles — is higher than ideal, and your Lp(a) is elevated. Lp(a) is largely inherited and is more common at higher levels in South Asian populations.',
      markerIds: ['apob', 'ldl', 'lpa', 'hscrp', 'hdl'],
      metric: { label: 'ApoB', value: '104', unit: 'mg/dL' },
      series: [112, 110, 109, 106, 104],
      seriesLabel: 'ApoB · 14 months',
    },
    {
      id: 'hormonal',
      name: 'Hormonal',
      state: 'stable',
      score: 86,
      headline: 'Stable, with cortisol worth watching',
      summary:
        'Testosterone and morning cortisol are within range. Cortisol has drifted upward across three measurements alongside your reported work load — not a concern on its own, but relevant to sleep and glucose.',
      markerIds: ['testo', 'cortisol'],
      metric: { label: 'Testosterone', value: '512', unit: 'ng/dL' },
      series: [486, 494, 502, 508, 512],
      seriesLabel: 'Total testosterone · 14 months',
    },
    {
      id: 'nutritional',
      name: 'Nutritional',
      state: 'attention',
      score: 64,
      headline: 'Vitamin D and B12 are both low',
      summary:
        'Vitamin D is in the deficient range and B12 is at the low end. Both are extremely common in urban India — indoor work with limited direct sun, and predominantly vegetarian eating. You started supplementing in July; the next retest will tell us whether it is working.',
      markerIds: ['vitd', 'b12', 'ferritin', 'homocysteine'],
      metric: { label: 'Vitamin D', value: '18', unit: 'ng/mL' },
      series: [14, 15, 16, 17, 18],
      seriesLabel: 'Vitamin D · 14 months',
    },
    {
      id: 'liver',
      name: 'Liver',
      state: 'monitor',
      score: 72,
      headline: 'Improving, and tracking your metabolic work',
      summary:
        'ALT and GGT are mildly raised, consistent with the grade 1 fatty liver seen on ultrasound in 2024. Both have fallen since your baseline. Liver fat in this pattern usually moves with metabolic health rather than independently.',
      markerIds: ['alt', 'ast', 'ggt'],
      metric: { label: 'ALT', value: '46', unit: 'U/L' },
      series: [61, 58, 54, 49, 46],
      seriesLabel: 'ALT · 14 months',
    },
    {
      id: 'thyroid',
      name: 'Thyroid',
      state: 'optimal',
      score: 94,
      headline: 'Working well',
      summary:
        'TSH and free T4 are comfortably in range and steady across four measurements. Given your mother\'s hypothyroidism we keep this on an annual check rather than dropping it.',
      markerIds: ['tsh', 'ft4'],
      metric: { label: 'TSH', value: '2.4', unit: 'mIU/L' },
      series: [2.6, 2.5, 2.5, 2.4, 2.4],
      seriesLabel: 'TSH · 14 months',
    },
    {
      id: 'recovery',
      name: 'Recovery',
      state: 'stable',
      score: 79,
      headline: 'Resting heart rate is trending down',
      summary:
        'Your resting heart rate has fallen 6 bpm since the dinner walk protocol began and HRV has edged up. These are wearable signals rather than lab results, so we read them as supporting evidence, not proof.',
      markerIds: [],
      metric: { label: 'Resting HR', value: '62', unit: 'bpm' },
      series: [68, 67, 66, 64, 62],
      seriesLabel: 'Resting heart rate · 14 months',
    },
    {
      id: 'sleep',
      name: 'Sleep',
      state: 'monitor',
      score: 71,
      headline: 'Enough hours, inconsistent timing',
      summary:
        'Duration averages 6h 54m, which is adequate. The bigger signal is variability: your sleep midpoint moves by more than 90 minutes across the week. Irregular timing is independently associated with poorer glucose handling.',
      markerIds: [],
      metric: { label: 'Avg duration', value: '6h 54m' },
      series: [6.4, 6.5, 6.7, 6.8, 6.9],
      seriesLabel: 'Sleep duration · 14 months',
    },
  ],

  biomarkers: [
    {
      id: 'hba1c',
      name: 'Haemoglobin A1c',
      short: 'HbA1c',
      systemId: 'metabolic',
      value: 5.9,
      unit: '%',
      state: 'attention',
      range: { low: 4.0, high: 5.6, optLow: 4.8, optHigh: 5.4, floor: 4.0, ceil: 7.5 },
      direction: 'down',
      deltaLabel: '−0.3 since baseline',
      history: [
        { date: 'Jun 25', value: 6.2, label: 'Baseline' },
        { date: 'Sep 25', value: 6.1 },
        { date: 'Dec 25', value: 6.1 },
        { date: 'Mar 26', value: 6.0 },
        { date: 'Jul 26', value: 5.9 },
      ],
      meaning:
        'HbA1c reflects your average blood glucose over roughly the last three months. At 5.9% you are in what is commonly classified as the prediabetes range. It has fallen steadily since your baseline, which is the direction we want.',
      indiaContext:
        'South Asians tend to develop insulin resistance at lower body weights and younger ages than most reference populations, so a 5.9% at 34 carries more weight here than the number alone suggests. With a father diagnosed at 47, this is worth taking seriously now rather than later.',
      influences: [
        'Total carbohydrate load per meal, especially refined rice and wheat',
        'Movement in the 30–60 minutes after eating',
        'Sleep timing consistency',
        'Visceral fat',
      ],
      relatedPriorityId: 'p_metabolic',
      clinicianNote:
        'Values in this range are worth discussing with your physician, particularly with a first-degree relative who has type 2 diabetes.',
    },
    {
      id: 'glucose',
      name: 'Fasting glucose',
      short: 'Glucose',
      systemId: 'metabolic',
      value: 104,
      unit: 'mg/dL',
      state: 'monitor',
      range: { low: 70, high: 99, optLow: 75, optHigh: 92, floor: 60, ceil: 140 },
      direction: 'down',
      deltaLabel: '−7 since baseline',
      history: [
        { date: 'Jun 25', value: 111, label: 'Baseline' },
        { date: 'Sep 25', value: 109 },
        { date: 'Dec 25', value: 108 },
        { date: 'Mar 26', value: 106 },
        { date: 'Jul 26', value: 104 },
      ],
      meaning:
        'Your blood glucose after an overnight fast. Slightly above the usual cut-off, and moving in the right direction.',
      influences: ['Previous evening meal size and timing', 'Sleep quality', 'Stress', 'Activity'],
      relatedPriorityId: 'p_metabolic',
    },
    {
      id: 'insulin',
      name: 'Fasting insulin',
      short: 'Insulin',
      systemId: 'metabolic',
      value: 14.2,
      unit: 'µIU/mL',
      state: 'attention',
      range: { low: 2.6, high: 24.9, optLow: 3, optHigh: 8, floor: 2, ceil: 30 },
      direction: 'down',
      deltaLabel: '−3.1 since baseline',
      history: [
        { date: 'Jun 25', value: 17.3, label: 'Baseline' },
        { date: 'Sep 25', value: 16.8 },
        { date: 'Dec 25', value: 16.1 },
        { date: 'Mar 26', value: 15.0 },
        { date: 'Jul 26', value: 14.2 },
      ],
      meaning:
        'Insulin is often the earliest signal to move. It sits inside the standard laboratory range but well above what we would consider optimal — meaning your body is producing a lot of insulin to keep glucose where it is. This is why we prioritised metabolic health even though no single number looks alarming.',
      influences: ['Meal composition', 'Post-meal movement', 'Visceral fat', 'Sleep'],
      relatedPriorityId: 'p_metabolic',
    },
    {
      id: 'trig',
      name: 'Triglycerides',
      short: 'Triglycerides',
      systemId: 'metabolic',
      value: 186,
      unit: 'mg/dL',
      state: 'attention',
      range: { low: 40, high: 149, optLow: 50, optHigh: 100, floor: 40, ceil: 300 },
      direction: 'down',
      deltaLabel: '−26 since baseline',
      history: [
        { date: 'Jun 25', value: 212, label: 'Baseline' },
        { date: 'Sep 25', value: 206 },
        { date: 'Dec 25', value: 198 },
        { date: 'Mar 26', value: 192 },
        { date: 'Jul 26', value: 186 },
      ],
      meaning:
        'Triglycerides are fats carried in the blood. Raised levels alongside low HDL is a recognised pattern of insulin resistance, and it is the specific combination we are targeting.',
      indiaContext:
        'This pattern is very common on a high-refined-carbohydrate Indian diet — white rice, maida-based breads, sweets and chai with sugar — even in people who are not overweight and who eat little meat.',
      influences: ['Refined carbohydrate intake', 'Alcohol', 'Fructose and sweets', 'Physical activity'],
      relatedPriorityId: 'p_metabolic',
    },
    {
      id: 'hdl',
      name: 'HDL cholesterol',
      short: 'HDL',
      systemId: 'metabolic',
      value: 38,
      unit: 'mg/dL',
      state: 'attention',
      range: { low: 40, high: 90, optLow: 50, optHigh: 80, floor: 25, ceil: 90 },
      direction: 'up',
      deltaLabel: '+3 since baseline',
      history: [
        { date: 'Jun 25', value: 35, label: 'Baseline' },
        { date: 'Sep 25', value: 35 },
        { date: 'Dec 25', value: 36 },
        { date: 'Mar 26', value: 37 },
        { date: 'Jul 26', value: 38 },
      ],
      meaning:
        'HDL below 40 mg/dL in men is generally considered low. It has risen slowly since baseline. HDL responds mainly to sustained activity rather than to diet changes alone, which is one reason your current plan is movement-based.',
      influences: ['Aerobic activity', 'Refined carbohydrate intake', 'Smoking', 'Body composition'],
      relatedPriorityId: 'p_metabolic',
    },
    {
      id: 'apob',
      name: 'Apolipoprotein B',
      short: 'ApoB',
      systemId: 'cardiovascular',
      value: 104,
      unit: 'mg/dL',
      state: 'monitor',
      range: { low: 40, high: 100, optLow: 50, optHigh: 80, floor: 40, ceil: 160 },
      direction: 'down',
      deltaLabel: '−8 since baseline',
      history: [
        { date: 'Jun 25', value: 112, label: 'Baseline' },
        { date: 'Sep 25', value: 110 },
        { date: 'Dec 25', value: 109 },
        { date: 'Mar 26', value: 106 },
        { date: 'Jul 26', value: 104 },
      ],
      meaning:
        'ApoB counts the number of cholesterol-carrying particles that can lodge in an artery wall. It generally tracks cardiovascular risk more closely than LDL cholesterol does. Yours is modestly above the usual target while your LDL looks unremarkable — which is exactly why we measure it.',
      influences: ['Saturated fat intake', 'Insulin resistance', 'Genetics', 'Body composition'],
      clinicianNote:
        'Worth reviewing with a physician alongside your Lp(a) and family history when you next consult.',
    },
    {
      id: 'ldl',
      name: 'LDL cholesterol',
      short: 'LDL',
      systemId: 'cardiovascular',
      value: 118,
      unit: 'mg/dL',
      state: 'monitor',
      range: { low: 50, high: 129, optLow: 60, optHigh: 100, floor: 40, ceil: 200 },
      direction: 'down',
      deltaLabel: '−9 since baseline',
      history: [
        { date: 'Jun 25', value: 127, label: 'Baseline' },
        { date: 'Sep 25', value: 125 },
        { date: 'Dec 25', value: 123 },
        { date: 'Mar 26', value: 120 },
        { date: 'Jul 26', value: 118 },
      ],
      meaning:
        'The cholesterol carried in LDL particles. Within the commonly quoted range, but read it next to your ApoB rather than on its own.',
      influences: ['Saturated fat', 'Fibre intake', 'Genetics'],
    },
    {
      id: 'lpa',
      name: 'Lipoprotein(a)',
      short: 'Lp(a)',
      systemId: 'cardiovascular',
      value: 42,
      unit: 'mg/dL',
      state: 'monitor',
      range: { low: 0, high: 30, optLow: 0, optHigh: 20, floor: 0, ceil: 100 },
      direction: 'flat',
      deltaLabel: 'Largely genetic · stable',
      history: [
        { date: 'Jun 25', value: 43, label: 'Baseline' },
        { date: 'Jul 26', value: 42 },
      ],
      meaning:
        'Lp(a) is set largely by your genes and stays broadly stable through life. It does not respond meaningfully to diet or exercise, so we measure it once, note it, and use it to inform how aggressively we manage everything else that is modifiable.',
      indiaContext:
        'Elevated Lp(a) is more prevalent in South Asian populations, and is one of the reasons cardiovascular events occur at younger ages in this group. It is rarely measured in routine Indian health packages.',
      influences: ['Genetics — not meaningfully modifiable by lifestyle'],
      clinicianNote:
        'An elevated Lp(a) with a grandfather who had a heart attack at 58 is worth raising with a physician. It does not mean an event is coming; it means the modifiable risks deserve more attention.',
    },
    {
      id: 'hscrp',
      name: 'High-sensitivity CRP',
      short: 'hs-CRP',
      systemId: 'cardiovascular',
      value: 2.4,
      unit: 'mg/L',
      state: 'monitor',
      range: { low: 0, high: 3.0, optLow: 0, optHigh: 1.0, floor: 0, ceil: 10 },
      direction: 'down',
      deltaLabel: '−0.7 since baseline',
      history: [
        { date: 'Jun 25', value: 3.1, label: 'Baseline' },
        { date: 'Dec 25', value: 2.8 },
        { date: 'Jul 26', value: 2.4 },
      ],
      meaning:
        'A general marker of low-grade inflammation. Single readings can be raised by any recent infection, so we read the trend rather than one value.',
      influences: ['Recent illness', 'Visceral fat', 'Sleep', 'Smoking', 'Air quality'],
    },
    {
      id: 'vitd',
      name: 'Vitamin D (25-OH)',
      short: 'Vitamin D',
      systemId: 'nutritional',
      value: 18,
      unit: 'ng/mL',
      state: 'attention',
      range: { low: 30, high: 100, optLow: 40, optHigh: 60, floor: 5, ceil: 100 },
      direction: 'up',
      deltaLabel: '+4 since baseline',
      history: [
        { date: 'Jun 25', value: 14, label: 'Baseline' },
        { date: 'Sep 25', value: 15 },
        { date: 'Dec 25', value: 16 },
        { date: 'Mar 26', value: 17 },
        { date: 'Jul 26', value: 18 },
      ],
      meaning:
        'Below 20 ng/mL is generally classified as deficiency. You began weekly supplementation in July, after this draw — so this value is your pre-supplement level and we expect the next measurement to look quite different.',
      indiaContext:
        'Deficiency is widespread across urban India despite abundant sunlight: indoor work, early commutes, covered clothing, higher melanin and air pollution all reduce effective synthesis. It is one of the most consistently low markers we see.',
      influences: ['Direct midday sun exposure', 'Supplementation', 'Body fat', 'Air quality'],
    },
    {
      id: 'b12',
      name: 'Vitamin B12',
      short: 'B12',
      systemId: 'nutritional',
      value: 246,
      unit: 'pg/mL',
      state: 'monitor',
      range: { low: 200, high: 900, optLow: 400, optHigh: 800, floor: 100, ceil: 1000 },
      direction: 'flat',
      deltaLabel: '+8 since baseline',
      history: [
        { date: 'Jun 25', value: 238, label: 'Baseline' },
        { date: 'Dec 25', value: 241 },
        { date: 'Jul 26', value: 246 },
      ],
      meaning:
        'Technically inside the laboratory range but at the low end, where symptoms can still occur. Your homocysteine is mildly raised, which often accompanies functionally low B12.',
      indiaContext:
        'B12 comes almost entirely from animal foods. In a largely vegetarian diet, low-normal B12 is the expected finding rather than the exception, and reference ranges built on non-vegetarian populations can make it look more reassuring than it is.',
      influences: ['Vegetarian or vegan diet', 'Supplementation', 'Absorption', 'Metformin use'],
    },
    {
      id: 'ferritin',
      name: 'Ferritin',
      short: 'Ferritin',
      systemId: 'nutritional',
      value: 118,
      unit: 'ng/mL',
      state: 'optimal',
      range: { low: 30, high: 300, optLow: 50, optHigh: 150, floor: 10, ceil: 350 },
      direction: 'flat',
      deltaLabel: 'Stable',
      history: [
        { date: 'Jun 25', value: 112, label: 'Baseline' },
        { date: 'Jul 26', value: 118 },
      ],
      meaning: 'Your iron stores. Comfortably in range.',
      influences: ['Dietary iron', 'Blood loss', 'Inflammation'],
    },
    {
      id: 'homocysteine',
      name: 'Homocysteine',
      short: 'Homocysteine',
      systemId: 'nutritional',
      value: 14.2,
      unit: 'µmol/L',
      state: 'monitor',
      range: { low: 5, high: 15, optLow: 5, optHigh: 10, floor: 4, ceil: 30 },
      direction: 'flat',
      deltaLabel: '−0.4 since baseline',
      history: [
        { date: 'Jun 25', value: 14.6, label: 'Baseline' },
        { date: 'Jul 26', value: 14.2 },
      ],
      meaning:
        'Raised homocysteine often reflects low B12 or folate. We are tracking it together with your B12 rather than treating it as a separate problem.',
      influences: ['B12 and folate status', 'Kidney function', 'Genetics'],
    },
    {
      id: 'alt',
      name: 'Alanine transaminase',
      short: 'ALT',
      systemId: 'liver',
      value: 46,
      unit: 'U/L',
      state: 'attention',
      range: { low: 7, high: 40, optLow: 10, optHigh: 30, floor: 5, ceil: 100 },
      direction: 'down',
      deltaLabel: '−15 since baseline',
      history: [
        { date: 'Jun 25', value: 61, label: 'Baseline' },
        { date: 'Sep 25', value: 58 },
        { date: 'Dec 25', value: 54 },
        { date: 'Mar 26', value: 49 },
        { date: 'Jul 26', value: 46 },
      ],
      meaning:
        'A liver enzyme that rises when liver cells are under strain. Consistent with the grade 1 fatty liver reported on your 2024 ultrasound. It has come down by a quarter since baseline, which is a genuinely encouraging trend.',
      indiaContext:
        'Non-alcoholic fatty liver is very common in urban India and frequently occurs at lower body weights than in Western populations. It tends to improve alongside metabolic health rather than needing a separate plan.',
      influences: ['Liver fat', 'Alcohol', 'Refined carbohydrate load', 'Weight change', 'Medications'],
      relatedPriorityId: 'p_metabolic',
    },
    {
      id: 'ast',
      name: 'Aspartate transaminase',
      short: 'AST',
      systemId: 'liver',
      value: 32,
      unit: 'U/L',
      state: 'stable',
      range: { low: 8, high: 40, optLow: 10, optHigh: 30, floor: 5, ceil: 90 },
      direction: 'down',
      deltaLabel: '−9 since baseline',
      history: [
        { date: 'Jun 25', value: 41, label: 'Baseline' },
        { date: 'Dec 25', value: 36 },
        { date: 'Jul 26', value: 32 },
      ],
      meaning: 'A second liver enzyme, read alongside ALT. Now within range.',
      influences: ['Liver fat', 'Alcohol', 'Recent intense exercise'],
    },
    {
      id: 'ggt',
      name: 'Gamma-glutamyl transferase',
      short: 'GGT',
      systemId: 'liver',
      value: 52,
      unit: 'U/L',
      state: 'monitor',
      range: { low: 8, high: 61, optLow: 10, optHigh: 30, floor: 5, ceil: 120 },
      direction: 'down',
      deltaLabel: '−13 since baseline',
      history: [
        { date: 'Jun 25', value: 65, label: 'Baseline' },
        { date: 'Dec 25', value: 58 },
        { date: 'Jul 26', value: 52 },
      ],
      meaning:
        'Inside the reference range but above where we would like it. GGT tends to move with liver fat and alcohol intake.',
      influences: ['Alcohol', 'Liver fat', 'Medications'],
    },
    {
      id: 'tsh',
      name: 'Thyroid stimulating hormone',
      short: 'TSH',
      systemId: 'thyroid',
      value: 2.4,
      unit: 'mIU/L',
      state: 'optimal',
      range: { low: 0.4, high: 4.5, optLow: 1.0, optHigh: 2.5, floor: 0.2, ceil: 8 },
      direction: 'flat',
      deltaLabel: 'Stable across 4 tests',
      history: [
        { date: 'Jun 25', value: 2.6, label: 'Baseline' },
        { date: 'Dec 25', value: 2.5 },
        { date: 'Mar 26', value: 2.4 },
        { date: 'Jul 26', value: 2.4 },
      ],
      meaning:
        'The pituitary signal that regulates your thyroid. Steady and comfortably in range.',
      influences: ['Autoimmune thyroid disease', 'Iodine', 'Age', 'Family history'],
    },
    {
      id: 'ft4',
      name: 'Free T4',
      short: 'Free T4',
      systemId: 'thyroid',
      value: 1.24,
      unit: 'ng/dL',
      state: 'optimal',
      range: { low: 0.8, high: 1.8, optLow: 1.0, optHigh: 1.5, floor: 0.5, ceil: 2.5 },
      direction: 'flat',
      deltaLabel: 'Stable',
      history: [
        { date: 'Jun 25', value: 1.21, label: 'Baseline' },
        { date: 'Jul 26', value: 1.24 },
      ],
      meaning: 'The circulating thyroid hormone itself. In range.',
      influences: ['Thyroid function', 'Medications'],
    },
    {
      id: 'uric',
      name: 'Uric acid',
      short: 'Uric acid',
      systemId: 'metabolic',
      value: 6.4,
      unit: 'mg/dL',
      state: 'monitor',
      range: { low: 3.4, high: 7.0, optLow: 3.5, optHigh: 5.5, floor: 2, ceil: 10 },
      direction: 'flat',
      deltaLabel: '−0.3 since baseline',
      history: [
        { date: 'Jun 25', value: 6.7, label: 'Baseline' },
        { date: 'Jul 26', value: 6.4 },
      ],
      meaning:
        'Upper end of the range. Uric acid often travels with insulin resistance and with fructose intake.',
      influences: ['Fructose and sweets', 'Alcohol', 'Insulin resistance', 'Kidney function'],
    },
    {
      id: 'testo',
      name: 'Total testosterone',
      short: 'Testosterone',
      systemId: 'hormonal',
      value: 512,
      unit: 'ng/dL',
      state: 'optimal',
      range: { low: 300, high: 900, optLow: 450, optHigh: 800, floor: 200, ceil: 1000 },
      direction: 'up',
      deltaLabel: '+26 since baseline',
      history: [
        { date: 'Jun 25', value: 486, label: 'Baseline' },
        { date: 'Dec 25', value: 502 },
        { date: 'Jul 26', value: 512 },
      ],
      meaning: 'Within range and stable.',
      influences: ['Sleep', 'Body composition', 'Training', 'Age'],
    },
    {
      id: 'cortisol',
      name: 'Morning cortisol',
      short: 'Cortisol',
      systemId: 'hormonal',
      value: 19.4,
      unit: 'µg/dL',
      state: 'monitor',
      range: { low: 6, high: 23, optLow: 8, optHigh: 16, floor: 3, ceil: 30 },
      direction: 'up',
      deltaLabel: '+2.6 since baseline',
      history: [
        { date: 'Jun 25', value: 16.8, label: 'Baseline' },
        { date: 'Dec 25', value: 18.1 },
        { date: 'Jul 26', value: 19.4 },
      ],
      meaning:
        'Within the laboratory range but drifting up across three measurements. Cortisol varies a lot by time of day and by how you slept the night before, so we treat a single value cautiously and watch the direction.',
      influences: ['Sleep', 'Psychological stress', 'Time of blood draw', 'Illness'],
    },
  ],

  priorities: [
    {
      id: 'p_metabolic',
      rank: 1,
      title: 'Metabolic Reset',
      systemId: 'metabolic',
      state: 'attention',
      whyShort: 'Focus on improving post-meal glucose stability.',
      whyDetail:
        'Four signals point the same way: HbA1c at 5.9%, fasting insulin well above optimal, triglycerides raised with low HDL, and a mildly elevated ALT. Individually none of these is alarming. Together they describe a single underlying pattern — your body is working hard to clear glucose after meals — and it is the pattern most likely to shape your next twenty years. Your father was diagnosed with type 2 diabetes at 47. Acting on this now, at 34, is the highest-leverage thing available to you.',
      evidenceMarkerIds: ['hba1c', 'insulin', 'trig', 'hdl', 'alt'],
      actionIds: ['a_walk', 'a_sequence', 'a_sleep'],
      trackedSignals: [
        { label: 'Post-meal glucose stability', value: 'Improving', state: 'stable' },
        { label: 'Resting heart rate', value: '62 bpm · −6', state: 'optimal' },
        { label: 'Walk adherence', value: '18 of 30 sessions', state: 'monitor' },
        { label: 'Sleep timing consistency', value: '±92 min', state: 'monitor' },
      ],
      reviewDate: '28 Aug 2026',
      retest: {
        panelId: 'pn_metabolic',
        panelName: 'Metabolic Follow-up',
        dueDate: '2 Sep 2026',
        rationale:
          'HbA1c reflects roughly three months of average glucose, so retesting it sooner than about twelve weeks tells us very little. Your last draw was 2 July. Early September is the first point at which a new value carries real information — so we retest six markers then, not the full panel.',
      },
      clinicianNote:
        'Your combination of prediabetes-range HbA1c, elevated Lp(a) and a first-degree family history is worth a physician review at your next consultation. HUMAN can prepare a summary for that visit.',
    },
    {
      id: 'p_cardio',
      rank: 2,
      title: 'Particle-count risk',
      systemId: 'cardiovascular',
      state: 'monitor',
      whyShort: 'ApoB and Lp(a) both sit above target.',
      whyDetail:
        'Your ApoB is modestly raised and your Lp(a) is elevated and largely genetic. This matters, and we are not ignoring it — but ApoB tends to fall as insulin resistance improves, so the metabolic work you are doing now is also the first-line answer here.',
      evidenceMarkerIds: ['apob', 'lpa', 'hscrp'],
      actionIds: [],
      trackedSignals: [{ label: 'ApoB', value: '104 mg/dL · −8', state: 'monitor' }],
      reviewDate: '2 Sep 2026',
      retest: {
        panelId: 'pn_heart',
        panelName: 'Cardiovascular Panel',
        dueDate: 'Jan 2027',
        rationale: 'Lipid changes take three to six months to show. No value in retesting sooner.',
      },
      suppressedReason:
        'Held back deliberately. It shares a root cause with your current priority, and running two plans at once reliably produces worse adherence than running one. This is queued for the review on 28 August.',
    },
    {
      id: 'p_nutrition',
      rank: 3,
      title: 'Vitamin D and B12 repletion',
      systemId: 'nutritional',
      state: 'attention',
      whyShort: 'Both low; supplementation already started.',
      whyDetail:
        'Vitamin D at 18 ng/mL is in the deficient range and B12 sits at the low end with a mildly raised homocysteine alongside it. You started supplementing in July.',
      evidenceMarkerIds: ['vitd', 'b12', 'homocysteine'],
      actionIds: ['a_supp'],
      trackedSignals: [{ label: 'Supplement adherence', value: 'Weekly · on track', state: 'optimal' }],
      reviewDate: '2 Sep 2026',
      retest: {
        panelId: 'pn_metabolic',
        panelName: 'Metabolic Follow-up',
        dueDate: '2 Sep 2026',
        rationale: 'Vitamin D takes roughly eight to twelve weeks of supplementation to plateau.',
      },
      suppressedReason:
        'Already in motion and requires no daily decision from you, so it does not need to occupy your attention as a priority. It is folded into the September retest.',
    },
    {
      id: 'p_sleep',
      rank: 4,
      title: 'Sleep timing consistency',
      systemId: 'sleep',
      state: 'monitor',
      whyShort: 'Your sleep midpoint moves ±92 minutes across the week.',
      whyDetail:
        'Duration is adequate at just under seven hours. The variability is the more interesting signal, and irregular sleep timing has been associated with poorer glucose handling independently of how long you sleep.',
      evidenceMarkerIds: ['hba1c', 'cortisol'],
      actionIds: ['a_sleep'],
      trackedSignals: [{ label: 'Midpoint variability', value: '±92 min', state: 'monitor' }],
      reviewDate: '28 Aug 2026',
      retest: {
        panelId: 'pn_metabolic',
        panelName: 'Metabolic Follow-up',
        dueDate: '2 Sep 2026',
        rationale: 'Tracked through your wearable rather than through blood.',
      },
      suppressedReason:
        'A strong candidate for your next cycle. We have added one light sleep-timing action to your current plan rather than promoting it to a full priority.',
    },
  ],

  experiments: [
    {
      id: 'e_dinner_walk',
      title: 'Dinner Walk Protocol',
      question:
        'Does a short walk after your largest meal shift your post-meal glucose stability and metabolic markers?',
      priorityId: 'p_metabolic',
      protocol: [
        {
          title: 'Walk 10 minutes after dinner',
          detail:
            'Begin within 15 minutes of finishing. Easy pace — a conversational stroll, not a workout. Around the block is enough.',
        },
        {
          title: 'At least 5 evenings a week',
          detail: '30 sessions across the 6-week protocol. Missing a day is expected; missing a week is not.',
        },
        {
          title: 'Eat dal or vegetables before rice or roti',
          detail:
            'Same meal, same quantity, different order. Protein and fibre first tends to blunt the glucose rise that follows.',
        },
        {
          title: 'Keep everything else the same',
          detail:
            'No other deliberate changes during the six weeks. If several things change at once we learn nothing about which one mattered.',
        },
      ],
      weeks: 6,
      weekNow: 5,
      startDate: '17 Jul 2026',
      endDate: '28 Aug 2026',
      trackedSignals: [
        { label: 'Resting heart rate', baseline: '68 bpm', now: '62 bpm', state: 'optimal' },
        { label: 'Evening step count', baseline: '1,240', now: '3,180', state: 'optimal' },
        { label: 'Sleep duration', baseline: '6h 41m', now: '6h 54m', state: 'stable' },
        { label: 'Subjective energy', baseline: '3.1 / 5', now: '3.8 / 5', state: 'stable' },
      ],
      // 30 days elapsed of 42; 18 sessions completed against a 30-session target.
      adherence: adherence('110110111011011010110101101101', 42),
      readout: undefined,
    },
    {
      id: 'e_chai_done',
      title: 'Sugar-in-Chai Reduction',
      question: 'Does removing added sugar from your daily chai move your triglycerides?',
      priorityId: 'p_metabolic',
      protocol: [
        {
          title: 'Cut chai sugar by half in week 1, to zero by week 3',
          detail: 'Gradual, because taste adapts over about two weeks and abrupt removal rarely holds.',
        },
        { title: 'Keep the number of cups the same', detail: 'We are testing the sugar, not the chai.' },
        { title: 'No other deliberate diet changes', detail: 'One variable at a time.' },
      ],
      weeks: 8,
      weekNow: 8,
      startDate: '9 Nov 2025',
      endDate: '4 Jan 2026',
      trackedSignals: [
        { label: 'Triglycerides', baseline: '212 mg/dL', now: '198 mg/dL', state: 'attention' },
        { label: 'Added sugar (est.)', baseline: '~34 g/day', now: '~6 g/day', state: 'optimal' },
        { label: 'Afternoon energy dips', baseline: 'Most days', now: 'Occasional', state: 'stable' },
      ],
      adherence: adherence('111011111111111011111111111111101111111111', 42),
      readout: {
        observed: [
          'Triglycerides fell 14 mg/dL across the eight weeks.',
          'Adherence was 84% — 47 of 56 days.',
          'You logged fewer afternoon energy dips from week 4 onward.',
          'HbA1c did not change measurably over this window.',
        ],
        caveat:
          'Triglycerides fell during a window in which you also reduced chai sugar. Several other things changed in the same period, including a fortnight of travel, and we did not run a comparison condition. This is an observation about what moved together, not evidence that one caused the other.',
        decision:
          'Kept. The change held without effort after week 3, the direction was right, and it costs nothing to continue. Rolled into your baseline habits rather than tracked as an active protocol.',
      },
    },
  ],

  actions: [
    {
      id: 'a_walk',
      title: '10-minute walk after dinner',
      why: 'Supports your current metabolic-health goal.',
      priorityId: 'p_metabolic',
      target: '30 sessions across 6 weeks',
      streak: 3,
      doneToday: false,
      progress: { done: 18, total: 30 },
      time: 'After dinner',
    },
    {
      id: 'a_sequence',
      title: 'Dal or sabzi before rice',
      why: 'Same meal, different order — tends to blunt the post-meal glucose rise.',
      priorityId: 'p_metabolic',
      target: 'Every main meal',
      streak: 11,
      doneToday: true,
      progress: { done: 24, total: 30 },
      time: 'Lunch & dinner',
    },
    {
      id: 'a_sleep',
      title: 'Lights out by 11:30pm',
      why: 'Reducing sleep-timing variability supports the same goal from a different angle.',
      priorityId: 'p_sleep',
      target: '5 nights a week',
      streak: 2,
      doneToday: false,
      progress: { done: 14, total: 30 },
      time: 'Tonight',
    },
    {
      id: 'a_supp',
      title: 'Vitamin D3 — weekly dose',
      why: 'Repleting a deficiency found in your July results.',
      priorityId: 'p_nutrition',
      target: 'Once weekly',
      streak: 4,
      doneToday: true,
      progress: { done: 4, total: 6 },
      time: 'Sunday',
    },
  ],

  timeline: [
    {
      id: 't1',
      date: '2 Jul 2026',
      year: 2026,
      type: 'result',
      title: 'Comprehensive Panel — 68 markers',
      summary:
        'HbA1c down to 5.9%. ALT down 15 points from baseline. Vitamin D still deficient at 18 ng/mL. Health Intelligence rose to 81.',
      systemId: 'metabolic',
    },
    {
      id: 't2',
      date: '17 Jul 2026',
      year: 2026,
      type: 'intervention',
      title: 'Started Dinner Walk Protocol',
      summary: 'Six-week structured experiment targeting post-meal glucose stability.',
      systemId: 'metabolic',
    },
    {
      id: 't3',
      date: '14 Jul 2026',
      year: 2026,
      type: 'prescription',
      title: 'Vitamin D3 60,000 IU weekly',
      summary: 'Started after the July panel showed 25-OH vitamin D at 18 ng/mL.',
      systemId: 'nutritional',
    },
    {
      id: 't4',
      date: '28 Jun 2026',
      year: 2026,
      type: 'test',
      title: 'Blood draw — home collection',
      summary: 'Fasting sample collected at 7:10am, Indiranagar. Redcliffe Labs.',
    },
    {
      id: 't5',
      date: '20 Mar 2026',
      year: 2026,
      type: 'result',
      title: 'Metabolic Follow-up — 12 markers',
      summary: 'HbA1c 6.0%. First measurable fall since baseline. Cycle 2 review closed.',
      systemId: 'metabolic',
    },
    {
      id: 't6',
      date: '4 Jan 2026',
      year: 2026,
      type: 'intervention',
      title: 'Completed Sugar-in-Chai Reduction',
      summary:
        'Eight-week protocol. Adherence 84%. Triglycerides fell 14 mg/dL over the same window, alongside other changes.',
      systemId: 'metabolic',
    },
    {
      id: 't7',
      date: '12 Dec 2025',
      year: 2025,
      type: 'result',
      title: 'Metabolic Follow-up — 12 markers',
      summary: 'HbA1c held at 6.1%. ALT down to 54 U/L.',
      systemId: 'liver',
    },
    {
      id: 't8',
      date: '9 Nov 2025',
      year: 2025,
      type: 'symptom',
      title: 'Reported afternoon energy dips',
      summary: 'Consistent 3–4pm fatigue logged over three weeks. Fed into metabolic prioritisation.',
      systemId: 'metabolic',
    },
    {
      id: 't9',
      date: '12 Jun 2025',
      year: 2025,
      type: 'milestone',
      title: 'Baseline assessment · joined HUMAN',
      summary:
        'First comprehensive panel. Health Intelligence 70. Metabolic health identified as the leading priority.',
    },
    {
      id: 't10',
      date: '3 Aug 2024',
      year: 2024,
      type: 'imaging',
      title: 'Abdominal ultrasound',
      summary: 'Grade 1 fatty liver reported. Uploaded to HUMAN at sign-up.',
      systemId: 'liver',
    },
    {
      id: 't11',
      date: '17 Feb 2023',
      year: 2023,
      type: 'note',
      title: 'Corporate health check',
      summary: 'Fasting glucose 108 mg/dL, flagged but not followed up. Added to Passport at sign-up.',
      systemId: 'metabolic',
    },
    {
      id: 't12',
      date: '9 Sep 2021',
      year: 2021,
      type: 'note',
      title: 'Earliest record on file',
      summary: 'Routine lipid profile. Triglycerides 178 mg/dL. Uploaded by you in 2025.',
      systemId: 'cardiovascular',
    },
  ],

  learnings: [
    {
      id: 'l1',
      statement: 'Your HbA1c has moved most in the periods when your evening step count was highest.',
      basis: 'Three measurement intervals since June 2025, compared against wearable activity.',
      caveat:
        'This is an observation about your own data over a small number of points. It does not establish that the walking caused the change — other things changed too.',
    },
    {
      id: 'l2',
      statement:
        'Protocols you attach to an existing daily habit have held far better than ones needing a new time slot.',
      basis: 'Dinner walk 60% adherence and chai reduction 84%, versus morning gym 31% in cycle 1.',
      caveat: 'Adherence pattern from three protocols. Suggestive, not conclusive.',
    },
    {
      id: 'l3',
      statement: 'Your ALT falls alongside your triglycerides rather than independently.',
      basis: 'Five paired measurements since baseline.',
      caveat:
        'Consistent with what is generally expected for fatty liver, but this is your data only, and correlation between two markers does not tell us which drives which.',
    },
  ],

  careCircle: [
    {
      id: 'c1',
      name: 'Priya Rao',
      relation: 'Wife',
      initials: 'PR',
      accent: 'var(--accent-women)',
      shares: ['Health milestones', 'Appointments', 'Current priority', 'Retest reminders'],
      locked: ['Full biomarker data', 'Medical records', 'Mental health'],
      lastActive: 'Viewed 2 days ago',
    },
    {
      id: 'c2',
      name: 'Suresh Rao',
      relation: 'Father · 61',
      initials: 'SR',
      accent: 'var(--state-stable)',
      shares: ['Appointments', 'Medication reminders'],
      locked: ['All biomarkers', 'Medical records', 'Current priority', 'Mental health'],
      lastActive: 'Viewed last week',
    },
  ],

  insights: [
    {
      id: 'i1',
      eyebrow: 'Pattern',
      statement: 'Your resting heart rate has fallen 6 bpm since the dinner walks began.',
      detail:
        'From 68 bpm in the two weeks before you started to 62 bpm now. Resting heart rate usually responds to sustained aerobic activity before blood markers do, so we treat this as an early supporting signal — not as evidence the protocol is working. The September retest is what will actually answer that.',
      systemId: 'recovery',
    },
    {
      id: 'i2',
      eyebrow: 'Worth knowing',
      statement: 'Your Lp(a) will not respond to anything in your current plan — and that is expected.',
      detail:
        'Lp(a) is set largely by genetics and stays broadly stable through life. We measured it once so that we know it, and it raises the value of everything that is modifiable. It is not a target; it is context.',
      systemId: 'cardiovascular',
    },
    {
      id: 'i3',
      eyebrow: 'India context',
      statement: 'Vitamin D deficiency is the single most common finding we would expect in your profile.',
      detail:
        'Indoor work, an early commute and higher melanin all reduce how much vitamin D you make from sunlight, and Bengaluru\'s air quality reduces it further. Yours was 18 ng/mL in July. You are now supplementing, and September will tell us whether the dose is right.',
      systemId: 'nutritional',
    },
  ],

  reports: [
    { id: 'r1', name: 'Comprehensive Panel', date: '2 Jul 2026', kind: 'Lab report', lab: 'Redcliffe Labs', markerCount: 68 },
    { id: 'r2', name: 'Metabolic Follow-up', date: '20 Mar 2026', kind: 'Lab report', lab: 'Redcliffe Labs', markerCount: 12 },
    { id: 'r3', name: 'Metabolic Follow-up', date: '12 Dec 2025', kind: 'Lab report', lab: 'Redcliffe Labs', markerCount: 12 },
    { id: 'r4', name: 'Baseline Assessment', date: '12 Jun 2025', kind: 'Lab report', lab: 'Redcliffe Labs', markerCount: 62 },
    { id: 'r5', name: 'Abdominal ultrasound', date: '3 Aug 2024', kind: 'Imaging', lab: 'Manipal Hospital' },
    { id: 'r6', name: 'Corporate health check', date: '17 Feb 2023', kind: 'Lab report', lab: 'Employer programme' },
  ],
}
