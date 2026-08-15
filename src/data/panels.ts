import type { Panel } from './types'

/** Blood assessments. Prices are planning assumptions, labelled as such in-product. */
export const panels: Panel[] = [
  {
    id: 'pn_baseline',
    name: 'HUMAN Baseline',
    markerCount: 68,
    price: 3999,
    turnaround: 'Results in 48 hours',
    forWhom: 'Your starting point. Everything HUMAN needs to build your first plan.',
    recommended: true,
    tag: 'Start here',
    includes: [
      { group: 'Metabolic', markers: ['HbA1c', 'Fasting glucose', 'Fasting insulin', 'HOMA-IR', 'Uric acid'] },
      { group: 'Cardiovascular', markers: ['ApoB', 'Lp(a)', 'LDL', 'HDL', 'Triglycerides', 'hs-CRP'] },
      { group: 'Liver & kidney', markers: ['ALT', 'AST', 'GGT', 'Bilirubin', 'Creatinine', 'eGFR'] },
      { group: 'Nutritional', markers: ['Vitamin D', 'Vitamin B12', 'Ferritin', 'Homocysteine', 'Folate'] },
      { group: 'Thyroid', markers: ['TSH', 'Free T4', 'Free T3'] },
      { group: 'Hormonal', markers: ['Testosterone', 'SHBG', 'Cortisol'] },
      { group: 'Blood', markers: ['Complete blood count', 'ESR'] },
    ],
  },
  {
    id: 'pn_women',
    name: "Women's Hormonal & Iron",
    markerCount: 44,
    price: 3499,
    turnaround: 'Results in 48 hours',
    forWhom:
      'Cycle irregularity, fatigue, hair or skin changes, or planning ahead for fertility. Timed to day 2–5 of your cycle.',
    tag: "Women's health",
    includes: [
      { group: 'Ovarian & pituitary', markers: ['AMH', 'LH', 'FSH', 'Oestradiol', 'Prolactin'] },
      { group: 'Androgens', markers: ['Total testosterone', 'Free androgen index', 'SHBG', 'DHEA-S'] },
      { group: 'Thyroid', markers: ['TSH', 'Free T4', 'Anti-TPO'] },
      { group: 'Iron', markers: ['Ferritin', 'Haemoglobin', 'Iron', 'TIBC', 'Transferrin saturation'] },
      { group: 'Metabolic', markers: ['HbA1c', 'Fasting insulin', 'Fasting glucose'] },
      { group: 'Nutritional', markers: ['Vitamin D', 'Vitamin B12', 'Folate'] },
    ],
  },
  {
    id: 'pn_metabolic',
    name: 'Metabolic Follow-up',
    markerCount: 12,
    price: 1499,
    turnaround: 'Results in 24 hours',
    forWhom: 'Re-measure only what your current plan is working on. Not a repeat of everything.',
    tag: 'Retest',
    includes: [
      { group: 'Metabolic', markers: ['HbA1c', 'Fasting glucose', 'Fasting insulin', 'Triglycerides', 'HDL'] },
      { group: 'Liver', markers: ['ALT', 'AST', 'GGT'] },
      { group: 'Nutritional', markers: ['Vitamin D', 'Vitamin B12'] },
      { group: 'Inflammation', markers: ['hs-CRP'] },
    ],
  },
  {
    id: 'pn_heart',
    name: 'Cardiovascular Deep Dive',
    markerCount: 22,
    price: 2999,
    turnaround: 'Results in 48 hours',
    forWhom:
      'Family history of heart disease, or an elevated ApoB or Lp(a) that needs a fuller picture.',
    includes: [
      { group: 'Particles', markers: ['ApoB', 'Lp(a)', 'LDL-P', 'Small dense LDL'] },
      { group: 'Standard lipids', markers: ['Total cholesterol', 'LDL', 'HDL', 'Triglycerides', 'Non-HDL'] },
      { group: 'Inflammation', markers: ['hs-CRP', 'Lp-PLA2', 'Homocysteine'] },
      { group: 'Metabolic', markers: ['HbA1c', 'Fasting insulin'] },
    ],
  },
]

export const panelById = (id: string) => panels.find((p) => p.id === id)
