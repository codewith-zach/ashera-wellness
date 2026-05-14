// Master option lists for chip/multi-select fields, derived from PRD §6.3.

export const MOOD_OPTIONS = [
  { value: 1, emoji: '😞', label: 'Heavy' },
  { value: 2, emoji: '😔', label: 'Low' },
  { value: 3, emoji: '😐', label: 'Steady' },
  { value: 4, emoji: '😊', label: 'Bright' },
  { value: 5, emoji: '🌟', label: 'Radiant' },
] as const;

export const BODY_FEELINGS = [
  'Calm',
  'Tired',
  'Bloated',
  'Light',
  'Heavy',
  'Anxious',
  'Strong',
  'Achy',
];

export const SLEEP_QUALITY = ['Poor', 'Fair', 'Good', 'Deep'] as const;

export const HERBAL_TEAS = [
  'Herbal tea',
  'Tincture',
  'Capsules',
  'Powder',
  'Blends',
];

export const BOWEL_TEXTURE = ['Loose', 'Soft', 'Normal', 'Hard'] as const;
export const BOWEL_EASE = ['Easy', 'Strained', 'Painful'] as const;

export const AFTER_MEALS = [
  'Bloating',
  'Gas',
  'Headache',
  'Fatigue',
  'Nausea',
  'None',
];

export const SYMPTOM_OPTIONS = [
  'Headache',
  'Cramps',
  'Dizziness',
  'Brain Fog',
  'Anxiety',
  'Pain',
  'Allergies',
  'Fatigue',
];

export const CYCLE_PHASES = ['Period', 'Follicular', 'Ovulation', 'Luteal'] as const;
export const CYCLE_MUCUS = ['Dry', 'Sticky', 'Creamy', 'Egg-white'] as const;
export const CYCLE_MOOD = ['Stable', 'Sensitive', 'Irritable', 'Emotional'] as const;
export const LIBIDO_OPTIONS = ['Low', 'Normal', 'High'] as const;

export const SKIN_OPTIONS = [
  'Clear',
  'Dry',
  'Oily',
  'Acne',
  'Breakout',
  'Inflamed',
] as const;

export const PAIN_AREAS = [
  'None',
  'Head',
  'Stomach',
  'Lower back',
  'Pelvis',
  'Joints',
  'Other',
];

export const MOVE_INTENSITY = ['Low', 'Moderate', 'High'] as const;
export const MOVE_DURING = ['Good', 'Tired', 'Painful'] as const;
export const MOVE_AFTER = ['Energised', 'Neutral', 'Drained'] as const;

export const MIND_FEEL = ['Calm', 'Busy', 'Heavy', 'Clear'] as const;

export const PRACTICES = [
  'Breathing',
  'Stillness',
  'Journaling',
  'Prayer',
  'Grounding',
];

export const SELF_CARE_OPTIONS = [
  'Movement',
  'Meditation',
  'Journaling',
  'Sunlight',
  'Nature Walk',
  'Stretching',
  'Rest',
  'Bath or Shower',
  'Reading',
  'Creative Time',
  'Prayer',
  'Other',
];

export const BODY_RELATIONSHIP = [
  'Loving',
  'Conflicted',
  'Frustrated',
  'Disconnected',
  'Hopeful',
  'Exhausted',
];

export const NERVOUS_SAFETY = [
  'Not safe',
  'Sometimes',
  'Mostly',
  'Very safe',
] as const;

export const AFFIRMATIONS = [
  'Your body is wise. You are listening.',
  'Rest is not laziness — it is repair.',
  'Today is a soft place to begin again.',
  'You are allowed to take up space and be tender at once.',
  'Healing is not linear, and neither is your becoming.',
  'Your nervous system deserves a slow morning.',
  'You showed up. That is the practice.',
  'Small consistent care beats grand gestures.',
];

export function dailyAffirmation(date: string): string {
  const day = parseInt(date.replace(/-/g, ''), 10);
  return AFFIRMATIONS[day % AFFIRMATIONS.length];
}
