import dayjs from 'dayjs';

export type Period = '7' | '14' | '30' | '90' | 'all';

export function periodFromQuery(value: string | null): Period {
  if (value === '14' || value === '30' || value === '90' || value === 'all')
    return value;
  return '7';
}

export function periodStart(period: Period): string | null {
  if (period === 'all') return null;
  const days = parseInt(period, 10);
  return dayjs().subtract(days - 1, 'day').format('YYYY-MM-DD');
}

export function periodLabel(period: Period): string {
  if (period === 'all') return 'All time';
  return `Last ${period} days`;
}
