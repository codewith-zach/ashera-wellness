import { describe, it, expect } from 'vitest';
import { periodFromQuery, periodStart, periodLabel } from './period';
import { todayISO } from './date';
import dayjs from 'dayjs';

describe('periodFromQuery', () => {
  it('accepts known periods', () => {
    expect(periodFromQuery('7')).toBe('7');
    expect(periodFromQuery('14')).toBe('14');
    expect(periodFromQuery('30')).toBe('30');
    expect(periodFromQuery('90')).toBe('90');
    expect(periodFromQuery('all')).toBe('all');
  });

  it('falls back to 7 for anything else', () => {
    expect(periodFromQuery(null)).toBe('7');
    expect(periodFromQuery('3')).toBe('7');
    expect(periodFromQuery('garbage')).toBe('7');
  });
});

describe('periodStart', () => {
  it('returns null for all time', () => {
    expect(periodStart('all')).toBeNull();
  });

  it('starts N-1 days ago so the period includes today', () => {
    expect(periodStart('7')).toBe(dayjs().subtract(6, 'day').format('YYYY-MM-DD'));
    expect(periodStart('30')).toBe(dayjs().subtract(29, 'day').format('YYYY-MM-DD'));
  });
});

describe('periodLabel', () => {
  it('labels periods', () => {
    expect(periodLabel('all')).toBe('All time');
    expect(periodLabel('14')).toBe('Last 14 days');
  });
});
