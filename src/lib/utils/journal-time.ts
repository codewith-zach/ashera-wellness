import dayjs from 'dayjs';

/**
 * The journal is an 11-month, 44-week arc that begins on the user's
 * `journalStartDate`. These helpers translate calendar dates into the
 * journal's internal numbering (used by Monthly + Weekly forms).
 */

export interface JournalNow {
  monthNumber: number; // 1–11 (clamped)
  weekNumber: number; // 1–44 (clamped)
  monthYear: number; // calendar year of the current journal month
  monthCalendar: number; // calendar month 1–12
}

export function journalNow(start: Date | null | undefined, now: Date = new Date()): JournalNow {
  const startDay = start ? dayjs(start) : dayjs(now);
  const today = dayjs(now);

  const daysIn = today.diff(startDay, 'day');
  const monthNumber = Math.max(1, Math.min(11, Math.floor(daysIn / 30) + 1));
  const weekNumber = Math.max(1, Math.min(44, Math.floor(daysIn / 7) + 1));

  // For "calendar month/year" of the current journal month:
  const monthOffset = monthNumber - 1;
  const monthDate = startDay.add(monthOffset, 'month');

  return {
    monthNumber,
    weekNumber,
    monthYear: monthDate.year(),
    monthCalendar: monthDate.month() + 1,
  };
}
