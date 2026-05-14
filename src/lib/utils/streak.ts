import dayjs from 'dayjs';

/**
 * Streak = count of consecutive days, ending today (or yesterday if today not
 * yet logged), with at least one entry. PRD §6.8.
 */
export function computeStreak(entryDates: string[]): {
  current: number;
  longest: number;
} {
  if (entryDates.length === 0) return { current: 0, longest: 0 };

  const set = new Set(entryDates);
  const sorted = [...entryDates].sort();

  // Longest run anywhere
  let longest = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = dayjs(sorted[i - 1]);
    const curr = dayjs(sorted[i]);
    if (curr.diff(prev, 'day') === 1) {
      run += 1;
      longest = Math.max(longest, run);
    } else if (curr.diff(prev, 'day') === 0) {
      // duplicate, ignore
    } else {
      run = 1;
    }
  }

  // Current run ending today (or yesterday)
  const today = dayjs().format('YYYY-MM-DD');
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
  let cursor: dayjs.Dayjs;
  if (set.has(today)) cursor = dayjs(today);
  else if (set.has(yesterday)) cursor = dayjs(yesterday);
  else return { current: 0, longest };

  let current = 0;
  while (set.has(cursor.format('YYYY-MM-DD'))) {
    current += 1;
    cursor = cursor.subtract(1, 'day');
  }

  return { current, longest: Math.max(longest, current) };
}

export function entriesThisWeek(entryDates: string[]): number {
  const startOfWeek = dayjs().startOf('week');
  return entryDates.filter((d) => dayjs(d).isAfter(startOfWeek.subtract(1, 'day')))
    .length;
}
