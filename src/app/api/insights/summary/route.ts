import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { unpackArr } from '@/lib/utils/json-array';
import { computeStreak } from '@/lib/utils/streak';

export async function GET() {
  const user = await requireUser();
  const entries = await prisma.dailyEntry.findMany({
    where: { userId: user.id },
    select: {
      date: true,
      mood: true,
      sleepHours: true,
      waterCups: true,
      symptoms: true,
      selfCare: true,
    },
  });

  const dates = entries.map((e) => e.date);
  const { current, longest } = computeStreak(dates);

  const moods = entries.map((e) => e.mood).filter((v): v is number => v != null);
  const sleeps = entries.map((e) => e.sleepHours).filter((v): v is number => v != null);
  const waters = entries.map((e) => e.waterCups).filter((v): v is number => v != null);

  const symptomCounts = new Map<string, number>();
  for (const e of entries) {
    for (const s of unpackArr(e.symptoms)) {
      symptomCounts.set(s, (symptomCounts.get(s) ?? 0) + 1);
    }
  }
  const selfCareCounts = new Map<string, number>();
  for (const e of entries) {
    for (const s of unpackArr(e.selfCare)) {
      selfCareCounts.set(s, (selfCareCounts.get(s) ?? 0) + 1);
    }
  }
  const top = (m: Map<string, number>) =>
    [...m.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const avg = (xs: number[]) =>
    xs.length ? Number((xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(2)) : null;

  return NextResponse.json({
    totalEntries: entries.length,
    avgMood: avg(moods),
    avgSleep: avg(sleeps),
    avgWater: avg(waters),
    longestStreak: longest,
    currentStreak: current,
    topSymptom: top(symptomCounts),
    topSelfCare: top(selfCareCounts),
  });
}
