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
    select: { date: true, mood: true, energyLevel: true, stressLevel: true },
    orderBy: { date: 'asc' },
  });

  const series = entries.map((e) => ({
    date: e.date,
    mood: e.mood,
    energy: e.energyLevel,
    stress: e.stressLevel,
  }));

  function avg(field: 'mood' | 'energy' | 'stress'): number | null {
    const vals = series.map((s) => s[field]).filter((v): v is number => v != null);
    if (!vals.length) return null;
    return Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2));
  }

  return NextResponse.json({
    period,
    series,
    avgMood: avg('mood'),
    avgEnergy: avg('energy'),
    avgStress: avg('stress'),
  });
}
