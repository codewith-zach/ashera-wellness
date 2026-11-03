import { describe, it, expect } from 'vitest';
import { computeStreak, entriesThisWeek } from './streak';
import { lastNDates } from './date';

const iso = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

describe('computeStreak', () => {
  it('returns zeros for no entries', () => {
    expect(computeStreak([])).toEqual({ current: 0, longest: 0 });
  });

  it('counts a run ending today', () => {
    const dates = [iso(-3), iso(-2), iso(-1), iso(0)];
    expect(computeStreak(dates).current).toBe(4);
  });

  it('keeps a run ending yesterday alive', () => {
    const dates = [iso(-2), iso(-1)];
    expect(computeStreak(dates).current).toBe(2);
  });

  it('drops the current streak when the last entry is older than yesterday', () => {
    const dates = [iso(-5), iso(-4), iso(-3)];
    const { current, longest } = computeStreak(dates);
    expect(current).toBe(0);
    expect(longest).toBe(3);
  });

  it('finds the longest run across gaps', () => {
    const dates = [iso(-10), iso(-9), iso(-5), iso(-4), iso(-3), iso(0)];
    const { current, longest } = computeStreak(dates);
    expect(current).toBe(1);
    expect(longest).toBe(3);
  });

  it('ignores duplicate dates', () => {
    const dates = [iso(-1), iso(-1), iso(0), iso(0)];
    const { current, longest } = computeStreak(dates);
    expect(current).toBe(2);
    expect(longest).toBe(2);
  });

  it('never reports longest below the current run', () => {
    const dates = lastNDates(9).map((d, i) => d); // 9-day run ending today
    expect(dates.length).toBe(9);
    const { current, longest } = computeStreak(dates);
    expect(current).toBe(9);
    expect(longest).toBe(9);
  });
});

describe('entriesThisWeek', () => {
  it('counts entries from the start of the week onward', () => {
    const week = lastNDates(7); // ends today, starts within the current week or just before
    const count = entriesThisWeek(week);
    expect(count).toBeGreaterThanOrEqual(1);
    expect(count).toBeLessThanOrEqual(7);
  });

  it('excludes entries from previous weeks', () => {
    expect(entriesThisWeek([iso(-30)])).toBe(0);
  });
});
