import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { unpackArr } from '@/lib/utils/json-array';
import dayjs from 'dayjs';

export async function GET(_req: NextRequest) {
  const user = await requireUser();

  const thisMonthStart = dayjs().startOf('month').format('YYYY-MM-DD');
  const lastMonthStart = dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
  const lastMonthEnd   = dayjs().startOf('month').format('YYYY-MM-DD');

  const [allEntries, thisMonthEntries, lastMonthEntries] = await Promise.all([
    prisma.dailyEntry.findMany({
      where: { userId: user.id },
      select: {
        date: true,
        mood: true,
        sleepHours: true,
        cyclePhase: true,
        painAreas: true,
        stressLevel: true,
        energyLevel: true,
      },
      orderBy: { date: 'asc' },
    }),
    prisma.dailyEntry.findMany({
      where: { userId: user.id, date: { gte: thisMonthStart } },
      select: { mood: true, sleepHours: true, waterCups: true, energyLevel: true, stressLevel: true },
    }),
    prisma.dailyEntry.findMany({
      where: { userId: user.id, date: { gte: lastMonthStart, lt: lastMonthEnd } },
      select: { mood: true, sleepHours: true, waterCups: true, energyLevel: true, stressLevel: true },
    }),
  ]);

  const avg = (xs: number[]) =>
    xs.length ? Number((xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(2)) : null;

  const scatterData = allEntries
    .filter((e) => e.sleepHours != null && e.mood != null)
    .map((e) => ({ date: e.date, sleepHours: e.sleepHours!, mood: e.mood! }));

  const hormonalData = allEntries.map((e) => ({
    date: e.date,
    cyclePhase: e.cyclePhase,
  }));

  const painCounts: Record<string, number> = {};
  for (const e of allEntries) {
    for (const area of unpackArr(e.painAreas)) {
      if (area !== 'None') painCounts[area] = (painCounts[area] ?? 0) + 1;
    }
  }

  const buildAvgs = (entries: typeof thisMonthEntries) => ({
    mood: avg(entries.map((e) => e.mood).filter((v): v is number => v != null)),
    sleep: avg(entries.map((e) => e.sleepHours).filter((v): v is number => v != null)),
    water: avg(entries.map((e) => e.waterCups).filter((v): v is number => v != null)),
    energy: avg(entries.map((e) => e.energyLevel).filter((v): v is number => v != null)),
    stress: avg(entries.map((e) => e.stressLevel).filter((v): v is number => v != null)),
  });

  const monthlyComparison = [
    { label: 'Mood', thisMonth: buildAvgs(thisMonthEntries).mood, lastMonth: buildAvgs(lastMonthEntries).mood },
    { label: 'Sleep (h)', thisMonth: buildAvgs(thisMonthEntries).sleep, lastMonth: buildAvgs(lastMonthEntries).sleep },
    { label: 'Water', thisMonth: buildAvgs(thisMonthEntries).water, lastMonth: buildAvgs(lastMonthEntries).water },
    { label: 'Energy', thisMonth: buildAvgs(thisMonthEntries).energy, lastMonth: buildAvgs(lastMonthEntries).energy },
    { label: 'Stress', thisMonth: buildAvgs(thisMonthEntries).stress, lastMonth: buildAvgs(lastMonthEntries).stress },
  ];

  return NextResponse.json({
    scatterData,
    hormonalData,
    painCounts,
    monthlyComparison,
    counts: {
      thisMonth: thisMonthEntries.length,
      lastMonth: lastMonthEntries.length,
    },
  });
}
