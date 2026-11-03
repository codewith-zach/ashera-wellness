import { describe, it, expect } from 'vitest';
import { zonedParts, userTimeZone } from './time';

// 2026-11-03 is a Tuesday; 23:30 UTC on Nov 2 is already Nov 3 in Asia/Tokyo.
const TUESDAY_NIGHT = new Date('2026-11-03T23:30:00Z');

describe('userTimeZone', () => {
  it('passes through valid zone names', () => {
    expect(userTimeZone('Europe/Lisbon')).toBe('Europe/Lisbon');
  });

  it('falls back to UTC for null and invalid names', () => {
    expect(userTimeZone(null)).toBe('UTC');
    expect(userTimeZone(undefined)).toBe('UTC');
    expect(userTimeZone('Mars/Olympus')).toBe('UTC');
  });
});

describe('zonedParts', () => {
  it('reports UTC values for a null timezone', () => {
    const parts = zonedParts(TUESDAY_NIGHT, null);
    expect(parts.date).toBe('2026-11-03');
    expect(parts.hour).toBe(23);
    expect(parts.weekday).toBe('Tue');
  });

  it('converts to the user zone: Tokyo is already the next day', () => {
    const parts = zonedParts(TUESDAY_NIGHT, 'Asia/Tokyo');
    expect(parts.date).toBe('2026-11-04');
    expect(parts.hour).toBe(8);
    expect(parts.weekday).toBe('Wed');
  });

  it('converts westward zones back a day', () => {
    const justPastUtcMidnight = new Date('2026-11-04T00:30:00Z');
    const parts = zonedParts(justPastUtcMidnight, 'America/New_York');
    expect(parts.date).toBe('2026-11-03');
    expect(parts.hour).toBe(19); // EST (UTC-5) — DST ended Nov 1, 2026
  });

  it('treats midnight as hour 0, not 24', () => {
    const utcMidnight = new Date('2026-11-04T00:00:00Z');
    expect(zonedParts(utcMidnight, 'UTC').hour).toBe(0);
  });
});
