import { describe, it, expect } from 'vitest';
import { onboardingSchema } from './onboarding';

describe('onboardingSchema', () => {
  it('accepts a complete onboarding payload', () => {
    const parsed = onboardingSchema.safeParse({
      healingIntention: 'steady energy',
      majorHealthGoal: 'sleep through the night',
      goalFeeling: 'rested',
      goalWhyItMatters: 'to be present',
      commitmentLetter: 'I will show up gently.',
      nervousSystemSafe: 'Mostly',
      bodyRelationship: ['curious'],
    });
    expect(parsed.success).toBe(true);
  });

  it('rejects oversized commitment letters', () => {
    expect(
      onboardingSchema.safeParse({ commitmentLetter: 'x'.repeat(5001) }).success,
    ).toBe(false);
  });

  it('accepts a valid IANA timezone and rejects garbage', () => {
    expect(onboardingSchema.safeParse({ timezone: 'Europe/Lisbon' }).success).toBe(true);
    expect(onboardingSchema.safeParse({ timezone: 'not a zone!' }).success).toBe(false);
  });
});
