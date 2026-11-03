import { describe, it, expect } from 'vitest';
import { dailyEntrySchema, onboardingSchema } from './entry';

describe('dailyEntrySchema', () => {
  it('accepts a minimal entry and defaults array fields', () => {
    const parsed = dailyEntrySchema.safeParse({ date: '2026-01-05' });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.bodyFeelings).toEqual([]);
      expect(parsed.data.symptoms).toEqual([]);
      expect(parsed.data.completedSections).toEqual([]);
    }
  });

  it('accepts a full-shaped entry', () => {
    const parsed = dailyEntrySchema.safeParse({
      date: '2026-01-05',
      mood: 3,
      sleepHours: 8,
      sleepQuality: 'Deep',
      waterCups: 8,
      symptoms: ['Fatigue'],
      gratitude: 'tea with a friend',
    });
    expect(parsed.success).toBe(true);
  });

  it('rejects malformed dates', () => {
    expect(dailyEntrySchema.safeParse({ date: '05-01-2026' }).success).toBe(false);
    expect(dailyEntrySchema.safeParse({ date: '2026-1-5' }).success).toBe(false);
  });

  it('rejects out-of-range scales', () => {
    expect(dailyEntrySchema.safeParse({ date: '2026-01-05', mood: 6 }).success).toBe(false);
    expect(dailyEntrySchema.safeParse({ date: '2026-01-05', waterCups: 13 }).success).toBe(false);
    expect(dailyEntrySchema.safeParse({ date: '2026-01-05', sleepHours: 20 }).success).toBe(false);
  });

  it('enforces size bounds on arrays and tag strings', () => {
    expect(
      dailyEntrySchema.safeParse({ date: '2026-01-05', symptoms: Array(41).fill('x') }).success,
    ).toBe(false);
    expect(
      dailyEntrySchema.safeParse({ date: '2026-01-05', symptoms: ['x'.repeat(101)] }).success,
    ).toBe(false);
  });

  it('enforces text length bounds', () => {
    expect(
      dailyEntrySchema.safeParse({ date: '2026-01-05', notes: 'x'.repeat(5001) }).success,
    ).toBe(false);
    expect(
      dailyEntrySchema.safeParse({ date: '2026-01-05', breakfast: 'x'.repeat(1001) }).success,
    ).toBe(false);
  });
});

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
});
