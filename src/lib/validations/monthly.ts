import { z } from 'zod';
import { text, longText, tags } from './common';

export const monthlySetupSchema = z.object({
  monthNumber: z.number().int().min(1).max(11),
  year: z.number().int(),
  month: z.number().int().min(1).max(12),

  theme: text.nullable().optional(),
  affirmation: text.nullable().optional(),
  healthGoal: text.nullable().optional(),

  symptomsFrequent: tags.default([]),
  nervousSystemSafe: text.nullable().optional(),
  bodyRelationship: text.nullable().optional(),
  limitingBelief: text.nullable().optional(),

  stressLevels: z.array(z.number().int().min(0).max(10)).max(12).default([]),
  stressReactions: text.nullable().optional(),
  stressSources: text.nullable().optional(),

  bodyNeedsMore: tags.default([]),
  foodsToReduce: text.nullable().optional(),
  foodsMustHave: text.nullable().optional(),
  nervousSupport: tags.default([]),
  herbalSupports: tags.default([]),
  calmingRitual: text.nullable().optional(),

  selfCareFocus: tags.default([]),
  priorityThisMonth: text.nullable().optional(),

  labResults: longText.nullable().optional(),
  supplements: text.nullable().optional(),
  whatChanged: tags.default([]),
  bodyResponse: text.nullable().optional(),
  nextVisitFocus: text.nullable().optional(),

  appointments: tags.default([]),
  selfCareActivity: text.nullable().optional(),
});

export type MonthlySetupInput = z.infer<typeof monthlySetupSchema>;
