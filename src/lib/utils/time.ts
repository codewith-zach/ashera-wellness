/**
 * Timezone helpers for reminders. Users store an IANA timezone name
 * (captured from the browser at onboarding); null falls back to UTC.
 */

export interface ZonedParts {
  /** Local calendar date in the zone, YYYY-MM-DD */
  date: string;
  /** Local hour, 0–23 */
  hour: number;
  /** Short weekday name in the zone, e.g. "Mon" */
  weekday: string;
}

export function userTimeZone(tz: string | null | undefined): string {
  if (!tz) return 'UTC';
  try {
    // Probe validity — throws a RangeError for unknown zone names.
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return tz;
  } catch {
    return 'UTC';
  }
}

export function zonedParts(date: Date, tz: string | null | undefined): ZonedParts {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: userTimeZone(tz),
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    weekday: 'short',
  }).formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  let hour = parseInt(get('hour'), 10);
  if (hour === 24) hour = 0; // hour12:false can format midnight as 24
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    hour,
    weekday: get('weekday'),
  };
}
