import { describe, it, expect } from 'vitest';
import { MILESTONES, milestoneFor, newlyEarned } from './milestones';

describe('milestoneFor', () => {
  it('finds defined milestones', () => {
    expect(milestoneFor(7)?.title).toBe('Seedling');
    expect(milestoneFor(90)?.title).toBe('Transformed');
  });

  it('returns null for undefined day counts', () => {
    expect(milestoneFor(8)).toBeNull();
    expect(milestoneFor(0)).toBeNull();
  });
});

describe('newlyEarned', () => {
  it('returns every milestone reached by the streak', () => {
    const earned = newlyEarned(21, []);
    expect(earned.map((m) => m.days)).toEqual([7, 14, 21]);
  });

  it('excludes already-acknowledged milestones', () => {
    const earned = newlyEarned(30, [7, 14]);
    expect(earned.map((m) => m.days)).toEqual([21, 30]);
  });

  it('returns nothing for a fresh streak with prior acknowledgements', () => {
    expect(newlyEarned(3, [7])).toEqual([]);
  });

  it('caps at the defined set', () => {
    const all = newlyEarned(365, []);
    expect(all).toEqual(MILESTONES);
  });
});
