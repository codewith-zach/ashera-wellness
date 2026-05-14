import { z } from 'zod';

export const monthlySetupSchema = z.object({
  monthNumber: z.number().int().min(1).max(11),
  year: z.number().int(),
  month: z.number().int().min(1).max(12),

  theme: z.string().nullable().optional(),
  affirmation: z.string().nullable().optional(),
  healthGoal: z.string().nullable().optional(),

  symptomsFrequent: z.array(z.string()).default([]),
  nervousSystemSafe: z.string().nullable().optional(),
  bodyRelationship: z.string().nullable().optional(),
  limitingBelief: z.string().nullable().optional(),

  stressLevels: z.array(z.number().int().min(0).max(10)).default([]),
  stressReactions: z.string().nullable().optional(),
  stressSources: z.string().nullable().optional(),

  bodyNeedsMore: z.array(z.string()).default([]),
  foodsToReduce: z.string().nullable().optional(),
  foodsMustHave: z.string().nullable().optional(),
  nervousSupport: z.array(z.string()).default([]),
  herbalSupports: z.array(z.string()).default([]),
  calmingRitual: z.string().nullable().optional(),

  selfCareFocus: z.array(z.string()).default([]),
  priorityThisMonth: z.string().nullable().optional(),

  labResults: z.string().nullable().optional(),
  supplements: z.string().nullable().optional(),
  whatChanged: z.array(z.string()).default([]),
  bodyResponse: z.string().nullable().optional(),
  nextVisitFocus: z.string().nullable().optional(),

  appointments: z.array(z.string()).default([]),
  selfCareActivity: z.string().nullable().optional(),
});

export type MonthlySetupInput = z.infer<typeof monthlySetupSchema>;

export const weeklyReviewSchema = z.object({
  weekNumber: z.number().int().min(1).max(44),

  focusThisWeek: z.string().nullable().optional(),
  nonNegotiables: z.string().nullable().optional(),

  nervousSystemSafe: z.enum(['Unsafe', 'Neutral', 'Safe']).nullable().optional(),
  gratefulFor: z.string().nullable().optional(),
  weekWins: z.string().nullable().optional(),
  weekChallenges: z.string().nullable().optional(),
  foodTrigger: z.string().nullable().optional(),
  energySleepPattern: z.string().nullable().optional(),
  whatILearnt: z.string().nullable().optional(),
  improvementNeeded: z.string().nullable().optional(),
});

export type WeeklyReviewInput = z.infer<typeof weeklyReviewSchema>;
