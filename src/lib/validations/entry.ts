import { z } from 'zod';

export const dailyEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD required'),

  mood: z.number().int().min(1).max(5).nullable().optional(),
  moodEmoji: z.string().nullable().optional(),
  energyLevel: z.number().int().min(1).max(5).nullable().optional(),
  stressLevel: z.number().int().min(1).max(5).nullable().optional(),
  bodyFeelings: z.array(z.string()).default([]),

  sleepHours: z.number().min(0).max(14).nullable().optional(),
  sleepQuality: z.enum(['Poor', 'Fair', 'Good', 'Deep']).nullable().optional(),

  waterCups: z.number().int().min(0).max(12).nullable().optional(),

  breakfast: z.string().nullable().optional(),
  lunch: z.string().nullable().optional(),
  dinner: z.string().nullable().optional(),
  snacks: z.string().nullable().optional(),
  calProtein: z.string().nullable().optional(),
  herbalTeas: z.array(z.string()).default([]),
  bodyResponse: z.string().nullable().optional(),

  bowelTexture: z.enum(['Loose', 'Soft', 'Normal', 'Hard']).nullable().optional(),
  bowelEase: z.enum(['Easy', 'Strained', 'Painful']).nullable().optional(),
  afterMeals: z.array(z.string()).default([]),

  symptoms: z.array(z.string()).default([]),
  symptomsExtra: z.string().nullable().optional(),
  symptomBetter: z.string().nullable().optional(),
  symptomWorse: z.string().nullable().optional(),

  cyclePhase: z
    .enum(['Period', 'Follicular', 'Ovulation', 'Luteal'])
    .nullable()
    .optional(),
  cycleMucus: z
    .enum(['Dry', 'Sticky', 'Creamy', 'Egg-white'])
    .nullable()
    .optional(),
  cycleMood: z
    .enum(['Stable', 'Sensitive', 'Irritable', 'Emotional'])
    .nullable()
    .optional(),
  libido: z.enum(['Low', 'Normal', 'High']).nullable().optional(),

  skinCondition: z
    .enum(['Clear', 'Dry', 'Oily', 'Acne', 'Breakout', 'Inflamed'])
    .nullable()
    .optional(),

  painAreas: z.array(z.string()).default([]),

  moveActivity: z.string().nullable().optional(),
  moveDuration: z.number().int().min(0).max(600).nullable().optional(),
  moveIntensity: z.enum(['Low', 'Moderate', 'High']).nullable().optional(),
  moveDuring: z.enum(['Good', 'Tired', 'Painful']).nullable().optional(),
  moveAfter: z.enum(['Energised', 'Neutral', 'Drained']).nullable().optional(),

  mindFeel: z.enum(['Calm', 'Busy', 'Heavy', 'Clear']).nullable().optional(),
  todayPracticed: z.array(z.string()).default([]),
  stressedBy: z.string().nullable().optional(),
  supportedBy: z.string().nullable().optional(),
  selfCare: z.array(z.string()).default([]),

  gratitude: z.string().nullable().optional(),
  proudOf: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),

  completedSections: z.array(z.string()).default([]),
});

export type DailyEntryInput = z.infer<typeof dailyEntrySchema>;

export const onboardingSchema = z.object({
  healingIntention: z.string().nullable().optional(),
  majorHealthGoal: z.string().nullable().optional(),
  goalFeeling: z.string().nullable().optional(),
  goalWhyItMatters: z.string().nullable().optional(),
  commitmentLetter: z.string().nullable().optional(),
  nervousSystemSafe: z
    .enum(['Not safe', 'Sometimes', 'Mostly', 'Very safe'])
    .nullable()
    .optional(),
  bodyRelationship: z.array(z.string()).default([]),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
