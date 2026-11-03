import { z } from 'zod';
import { text, longText, tags } from './common';

export const onboardingSchema = z.object({
  healingIntention: text.nullable().optional(),
  majorHealthGoal: text.nullable().optional(),
  goalFeeling: text.nullable().optional(),
  goalWhyItMatters: longText.nullable().optional(),
  commitmentLetter: longText.nullable().optional(),
  nervousSystemSafe: z
    .enum(['Not safe', 'Sometimes', 'Mostly', 'Very safe'])
    .nullable()
    .optional(),
  bodyRelationship: tags.default([]),
  timezone: z
    .string()
    .max(64)
    .regex(/^[A-Za-z0-9_+\-/]+$/, 'IANA timezone name required')
    .nullable()
    .optional(),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
