// PRD §6.8 — streak milestone definitions and detection helpers.

export interface Milestone {
  days: number;
  emoji: string;
  title: string;
  message: string;
}

export const MILESTONES: Milestone[] = [
  {
    days: 7,
    emoji: '🌱',
    title: 'Seedling',
    message:
      'Seven days of showing up. Something quiet but real is rooting in your daily life.',
  },
  {
    days: 14,
    emoji: '🌿',
    title: 'Growing',
    message:
      'Two weeks of listening to your body. The practice is becoming you, not just your to-do list.',
  },
  {
    days: 21,
    emoji: '🌸',
    title: 'Blooming',
    message:
      'Twenty-one days. Old patterns are softening; new ones are blooming in their place.',
  },
  {
    days: 30,
    emoji: '🌟',
    title: 'Radiant',
    message:
      'A whole month of choosing yourself. Look at what your steady tenderness has built.',
  },
  {
    days: 60,
    emoji: '💫',
    title: 'Luminous',
    message:
      'Sixty days. This is no longer a habit — this is who you are now.',
  },
  {
    days: 90,
    emoji: '✨',
    title: 'Transformed',
    message:
      'Ninety days. The threshold is yours. You crossed it gently, on purpose.',
  },
];

export function milestoneFor(days: number): Milestone | null {
  return MILESTONES.find((m) => m.days === days) ?? null;
}

/**
 * Returns milestones that the current streak just reached but haven't yet been
 * acknowledged. Compares against the user's previously-recorded list.
 */
export function newlyEarned(currentStreak: number, alreadyEarned: number[]): Milestone[] {
  const seen = new Set(alreadyEarned);
  return MILESTONES.filter((m) => m.days <= currentStreak && !seen.has(m.days));
}
