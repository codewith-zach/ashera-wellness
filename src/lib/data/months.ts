// 11-month healing arc — themes + suggested affirmations the user can adopt
// or rewrite. Loosely modelled on the PRD's reference to monthly themes.

export interface MonthTheme {
  number: number;
  title: string;
  affirmation: string;
}

export const MONTH_THEMES: MonthTheme[] = [
  {
    number: 1,
    title: 'Returning to the Body',
    affirmation:
      'My body is wise, and I am learning to listen without rushing the answer.',
  },
  {
    number: 2,
    title: 'Rooting in Stillness',
    affirmation: 'In the slow moments, my nervous system finds its way home.',
  },
  {
    number: 3,
    title: 'Listening to the Hormones',
    affirmation:
      'My cycles are language, not chaos. I receive what they reveal with care.',
  },
  {
    number: 4,
    title: 'The Soft Reset',
    affirmation:
      'I can begin again — softly, daily, as many times as I need to.',
  },
  {
    number: 5,
    title: 'Tending the Gut',
    affirmation: 'I nourish my body the way I would nourish someone I love.',
  },
  {
    number: 6,
    title: 'Mid-Year Mirror',
    affirmation:
      'I look at how far I have come without dismissing how far I still want to go.',
  },
  {
    number: 7,
    title: 'Movement as Medicine',
    affirmation: 'My body wants to move — gently, joyfully, as itself.',
  },
  {
    number: 8,
    title: 'Boundaries & Nervous System Safety',
    affirmation:
      'No is a complete sentence. Safety is a practice, not a personality.',
  },
  {
    number: 9,
    title: 'The Quiet Repair',
    affirmation:
      'Healing happens in the parts of life that no one is watching.',
  },
  {
    number: 10,
    title: 'Coming Home to Self',
    affirmation:
      'I am the home I was searching for. I am safe in my own company.',
  },
  {
    number: 11,
    title: 'Crossing the Threshold',
    affirmation:
      'I carry forward what I have built. The threshold is mine to cross.',
  },
];

export function themeFor(number: number): MonthTheme {
  return MONTH_THEMES[Math.max(0, Math.min(10, number - 1))];
}
