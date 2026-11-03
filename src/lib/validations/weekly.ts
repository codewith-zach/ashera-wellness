import { z } from 'zod';
import { text } from './common';

export const weeklyReviewSchema = z.object({
  weekNumber: z.number().int().min(1).max(44),

  focusThisWeek: text.nullable().optional(),
  nonNegotiables: text.nullable().optional(),

  nervousSystemSafe: z.enum(['Unsafe', 'Neutral', 'Safe']).nullable().optional(),
  gratefulFor: text.nullable().optional(),
  weekWins: text.nullable().optional(),
  weekChallenges: text.nullable().optional(),
  foodTrigger: text.nullable().optional(),
  energySleepPattern: text.nullable().optional(),
  whatILearnt: text.nullable().optional(),
  improvementNeeded: text.nullable().optional(),
});

export type WeeklyReviewInput = z.infer<typeof weeklyReviewSchema>;
