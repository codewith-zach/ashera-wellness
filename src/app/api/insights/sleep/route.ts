import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { periodFromQuery, periodStart } from '@/lib/utils/period';

export async function GET(req: NextRequest) {
  const user = await requireUser();
  const { searchParams } = new URL(req.url);
  const period = periodFromQuery(searchParams.get('period'));
  const start = periodStart(period);

  const entries = await prisma.dailyEntry.findMany({
    where: {
      userId: user.id,
      ...(start ? { date: { gte: start } } : {}),
    },
    select: { date: true, sleepHours: true, sleepQuality: true },
    orderBy: { date: 'asc' },
  });

  const series = entries.map((e) => ({
    date: e.date,
    hours: e.sleepHours,
    quality: e.sleepQuality,
  }));

  const hours = series.map((s) => s.hours).filter((h): h is number => h != null);
  const avgHours = hours.length
    ? Number((hours.reduce((a, b) => a + b, 0) / hours.length).toFixed(2))
    : null;

  const qualityDistribution: Record<string, number> = {
    Poor: 0,
    Fair: 0,
    Good: 0,
    Deep: 0,
  };
  for (const s of series) {
    if (s.quality && s.quality in qualityDistribution) {
      qualityDistribution[s.quality] += 1;
    }
  }

  return NextResponse.json({
    period,
    series,
    avgHours,
    qualityDistribution,
  });
}
