import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { toView } from '@/lib/entry-mapper';
import { computeStreak } from '@/lib/utils/streak';
import { unpackArr } from '@/lib/utils/json-array';

const CSV_HEADERS = [
  'date', 'mood', 'moodEmoji', 'energyLevel', 'stressLevel', 'bodyFeelings',
  'sleepHours', 'sleepQuality',
  'waterCups', 'breakfast', 'lunch', 'dinner', 'snacks', 'herbalTeas',
  'bowelTexture', 'bowelEase', 'afterMeals',
  'symptoms', 'symptomBetter', 'symptomWorse',
  'cyclePhase', 'cycleMood',
  'skinCondition', 'painAreas',
  'moveActivity', 'moveDuration', 'moveIntensity', 'moveDuring', 'moveAfter',
  'mindFeel', 'todayPracticed', 'selfCare',
  'gratitude', 'proudOf', 'notes',
  'completedSections',
] as const;

function escCsv(value: unknown): string {
  if (value == null) return '';
  const s = Array.isArray(value) ? value.join('; ') : String(value);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(req: NextRequest) {
  const user = await requireUser();
  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format') ?? 'csv';

  const entries = await prisma.dailyEntry.findMany({
    where: { userId: user.id },
    orderBy: { date: 'asc' },
  });

  const views = entries.map(toView);

  if (format === 'summary') {
    const dates = entries.map((e) => e.date);
    const { current, longest } = computeStreak(dates);
    const allMoods = entries.map((e) => e.mood).filter((v): v is number => v != null);
    const allSleeps = entries.map((e) => e.sleepHours).filter((v): v is number => v != null);
    const allWaters = entries.map((e) => e.waterCups).filter((v): v is number => v != null);

    const symptomCounts: Record<string, number> = {};
    const selfCareCounts: Record<string, number> = {};
    for (const e of entries) {
      for (const s of unpackArr(e.symptoms))
        symptomCounts[s] = (symptomCounts[s] ?? 0) + 1;
      for (const s of unpackArr(e.selfCare))
        selfCareCounts[s] = (selfCareCounts[s] ?? 0) + 1;
    }

    const avg = (xs: number[]) =>
      xs.length ? Number((xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(2)) : null;

    return NextResponse.json({
      exportedAt: new Date().toISOString(),
      user: { email: user.email, displayName: user.displayName },
      totalEntries: entries.length,
      dateRange: { from: dates[0] ?? null, to: dates[dates.length - 1] ?? null },
      streaks: { current, longest },
      averages: { mood: avg(allMoods), sleep: avg(allSleeps), water: avg(allWaters) },
      topSymptoms: Object.entries(symptomCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([symptom, count]) => ({ symptom, count })),
      topSelfCare: Object.entries(selfCareCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([activity, count]) => ({ activity, count })),
    });
  }

  // Default: CSV
  const header = CSV_HEADERS.join(',');
  const rows = views.map((e) =>
    CSV_HEADERS.map((col) => escCsv(e[col as keyof typeof e])).join(','),
  );
  const csv = [header, ...rows].join('\n');

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="ashera-journal-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
