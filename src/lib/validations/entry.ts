import { z } from 'zod';
import { shortText, text, longText, tags } from './common';

export const dailyEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD required'),

  mood: z.number().int().min(1).max(5).nullable().optional(),
  moodEmoji: shortText.nullable().optional(),
  energyLevel: z.number().int().min(1).max(5).nullable().optional(),
  stressLevel: z.number().int().min(1).max(5).nullable().optional(),
  bodyFeelings: tags.default([]),

  sleepHours: z.number().min(0).max(14).nullable().optional(),
  sleepQuality: z.enum(['Poor', 'Fair', 'Good', 'Deep']).nullable().optional(),

  waterCups: z.number().int().min(0).max(12).nullable().optional(),

  breakfast: text.nullable().optional(),
  lunch: text.nullable().optional(),
  dinner: text.nullable().optional(),
  snacks: text.nullable().optional(),
  calProtein: text.nullable().optional(),
  herbalTeas: tags.default([]),
  bodyResponse: text.nullable().optional(),

  bowelTexture: z.enum(['Loose', 'Soft', 'Normal', 'Hard']).nullable().optional(),
  bowelEase: z.enum(['Easy', 'Strained', 'Painful']).nullable().optional(),
  afterMeals: tags.default([]),

  symptoms: tags.default([]),
  symptomsExtra: text.nullable().optional(),
  symptomBetter: text.nullable().optional(),
  symptomWorse: text.nullable().optional(),

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

  painAreas: tags.default([]),

  moveActivity: text.nullable().optional(),
  moveDuration: z.number().int().min(0).max(600).nullable().optional(),
  moveIntensity: z.enum(['Low', 'Moderate', 'High']).nullable().optional(),
  moveDuring: z.enum(['Good', 'Tired', 'Painful']).nullable().optional(),
  moveAfter: z.enum(['Energised', 'Neutral', 'Drained']).nullable().optional(),

  mindFeel: z.enum(['Calm', 'Busy', 'Heavy', 'Clear']).nullable().optional(),
  todayPracticed: tags.default([]),
  stressedBy: text.nullable().optional(),
  supportedBy: text.nullable().optional(),
  selfCare: tags.default([]),

  gratitude: longText.nullable().optional(),
  proudOf: longText.nullable().optional(),
  notes: longText.nullable().optional(),

  completedSections: tags.default([]),
});

export type DailyEntryInput = z.infer<typeof dailyEntrySchema>;
