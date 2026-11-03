import { describe, it, expect } from 'vitest';
import { todayISO, isoFromDate, lastNDates, longDate } from './date';

describe('todayISO', () => {
  it('formats the current date as YYYY-MM-DD', () => {
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('isoFromDate', () => {
  it('formats a Date as YYYY-MM-DD', () => {
    expect(isoFromDate(new Date('2026-03-05T15:00:00Z'))).toBe('2026-03-05');
  });
});

describe('lastNDates', () => {
  it('returns n dates ending today in ascending order', () => {
    const dates = lastNDates(5);
    expect(dates).toHaveLength(5);
    expect(dates[dates.length - 1]).toBe(todayISO());
    expect(dates).toEqual([...dates].sort());
  });
});

describe('longDate', () => {
  it('renders a long human-readable date', () => {
    expect(longDate('2026-11-03')).toBe('Tuesday, 3 November 2026');
  });
});
