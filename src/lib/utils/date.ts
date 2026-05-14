import dayjs from 'dayjs';

export function todayISO(): string {
  return dayjs().format('YYYY-MM-DD');
}

export function isoFromDate(d: Date): string {
  return dayjs(d).format('YYYY-MM-DD');
}

export function longDate(iso: string): string {
  return dayjs(iso).format('dddd, D MMMM YYYY');
}

export function timeBasedGreeting(name?: string | null): string {
  const hour = new Date().getHours();
  let g = 'Good evening';
  if (hour < 12) g = 'Good morning';
  else if (hour < 17) g = 'Good afternoon';
  return name ? `${g}, ${name}` : g;
}

export function lastNDates(n: number): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    out.push(dayjs().subtract(i, 'day').format('YYYY-MM-DD'));
  }
  return out;
}
