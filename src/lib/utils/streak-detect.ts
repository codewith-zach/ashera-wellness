import dayjs from 'dayjs';

/**
 * Detect whether the user is "returning after a break" — i.e. they have prior
 * entries, but the most recent was 2+ days ago and today's not yet logged.
 * Used to surface PRD §6.8's "gentle return" message.
 */
export function detectGentleReturn(entryDates: string[]): {
  isReturning: boolean;
  priorBest: number;
} {
  if (entryDates.length === 0) return { isReturning: false, priorBest: 0 };
  const sorted = [...entryDates].sort();
  const last = sorted[sorted.length - 1];
  const daysSinceLast = dayjs().diff(dayjs(last), 'day');
  if (daysSinceLast < 2) return { isReturning: false, priorBest: 0 };

  // Compute the run length leading up to (and including) `last`.
  const set = new Set(entryDates);
  let cursor = dayjs(last);
  let run = 0;
  while (set.has(cursor.format('YYYY-MM-DD'))) {
    run += 1;
    cursor = cursor.subtract(1, 'day');
  }

  return { isReturning: true, priorBest: run };
}
