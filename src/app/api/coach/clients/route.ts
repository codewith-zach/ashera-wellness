import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { computeStreak } from '@/lib/utils/streak';
import dayjs from 'dayjs';

export async function GET() {
  const user = await requireUser();
  if (user.role !== 'coach') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const clients = await prisma.user.findMany({
    where: { coachId: user.id },
    select: {
      id: true,
      displayName: true,
      email: true,
      journalStartDate: true,
      entries: {
        select: { date: true, mood: true, sleepHours: true },
        orderBy: { date: 'desc' },
      },
    },
  });

  const today = dayjs().format('YYYY-MM-DD');
  const weekAgo = dayjs().subtract(7, 'day').format('YYYY-MM-DD');

  const result = clients.map((c) => {
    const dates = c.entries.map((e) => e.date);
    const { current: streak } = computeStreak(dates);
    const lastEntry = dates[0] ?? null;
    const daysSinceLastEntry = lastEntry
      ? dayjs(today).diff(dayjs(lastEntry), 'day')
      : Infinity;
    const atRisk = daysSinceLastEntry >= 7;

    // This-week stats
    const thisWeek = c.entries.filter((e) => e.date >= weekAgo);
    const weekMoods = thisWeek.map((e) => e.mood).filter((v): v is number => v != null);
    const weekSleeps = thisWeek.map((e) => e.sleepHours).filter((v): v is number => v != null);
    const avgMoodWeek = weekMoods.length
      ? Number((weekMoods.reduce((a, b) => a + b, 0) / weekMoods.length).toFixed(1))
      : null;
    const avgSleepWeek = weekSleeps.length
      ? Number((weekSleeps.reduce((a, b) => a + b, 0) / weekSleeps.length).toFixed(1))
      : null;

    return {
      id: c.id,
      displayName: c.displayName,
      email: c.email,
      streak,
      lastEntry,
      daysSinceLastEntry,
      atRisk,
      totalEntries: c.entries.length,
      avgMoodWeek,
      avgSleepWeek,
      entriesThisWeek: thisWeek.length,
    };
  });

  // Aggregate across all clients
  const allWeekMoods = result.flatMap((c) => (c.avgMoodWeek != null ? [c.avgMoodWeek] : []));
  const allWeekSleeps = result.flatMap((c) => (c.avgSleepWeek != null ? [c.avgSleepWeek] : []));
  const agg = {
    clientCount: result.length,
    atRiskCount: result.filter((c) => c.atRisk).length,
    avgMoodWeek: allWeekMoods.length
      ? Number((allWeekMoods.reduce((a, b) => a + b, 0) / allWeekMoods.length).toFixed(1))
      : null,
    avgSleepWeek: allWeekSleeps.length
      ? Number((allWeekSleeps.reduce((a, b) => a + b, 0) / allWeekSleeps.length).toFixed(1))
      : null,
  };

  return NextResponse.json({ clients: result, aggregate: agg });
}
