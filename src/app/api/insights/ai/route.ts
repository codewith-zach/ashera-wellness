import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { unauthorized } from '@/lib/api';
import { prisma } from '@/lib/db';
import { todayISO } from '@/lib/utils/date';
import { unpackArr } from '@/lib/utils/json-array';
import { computeStreak } from '@/lib/utils/streak';
import { zaiChat } from '@/lib/ai/zai';
import {
  moodPrompt,
  sleepPrompt,
  symptomPrompt,
  selfCarePrompt,
  overallPrompt,
  SYSTEM,
} from '@/lib/ai/prompts';
import {
  moodCallout,
  sleepCallout,
  symptomCallout,
  selfCareCallout,
} from '@/lib/insights/local-callouts';
import { periodFromQuery, periodStart } from '@/lib/utils/period';

export const dynamic = 'force-dynamic';

const SECTIONS = ['mood', 'sleep', 'symptoms', 'selfCare', 'overall'] as const;
type Section = (typeof SECTIONS)[number];

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const { searchParams } = new URL(req.url);
  const period = periodFromQuery(searchParams.get('period'));
  const start = periodStart(period);
  const today = todayISO();

  // Serve from cache if still fresh for today.
  const cached = await prisma.aiInsightCache.findMany({
    where: { userId: user.id, date: today },
  });
  if (cached.length === SECTIONS.length) {
    return NextResponse.json(
      Object.fromEntries(cached.map((c) => [c.section, c.text])),
    );
  }

  // Gather data for prompts.
  const allEntries = await prisma.dailyEntry.findMany({
    where: { userId: user.id },
    select: { date: true, mood: true, energyLevel: true, stressLevel: true,
              sleepHours: true, sleepQuality: true, symptoms: true, selfCare: true, waterCups: true },
  });
  const periodEntries = start
    ? allEntries.filter((e) => e.date >= start)
    : allEntries;

  const avg = (xs: number[]) =>
    xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;

  const periodMoods = periodEntries.map((e) => e.mood).filter((v): v is number => v != null);
  const periodEnergy = periodEntries.map((e) => e.energyLevel).filter((v): v is number => v != null);
  const periodStress = periodEntries.map((e) => e.stressLevel).filter((v): v is number => v != null);
  const periodSleep  = periodEntries.map((e) => e.sleepHours).filter((v): v is number => v != null);

  const sleepQualityCounts: Record<string, number> = {};
  for (const e of periodEntries) {
    if (e.sleepQuality) sleepQualityCounts[e.sleepQuality] = (sleepQualityCounts[e.sleepQuality] ?? 0) + 1;
  }
  const topQuality = Object.entries(sleepQualityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const symptomCounts = new Map<string, number>();
  for (const e of periodEntries)
    for (const s of unpackArr(e.symptoms))
      symptomCounts.set(s, (symptomCounts.get(s) ?? 0) + 1);
  const topSymptoms = [...symptomCounts.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => k);

  const selfCareCounts = new Map<string, number>();
  for (const e of allEntries)
    for (const s of unpackArr(e.selfCare))
      selfCareCounts.set(s, (selfCareCounts.get(s) ?? 0) + 1);
  const topSelfCareEntry = [...selfCareCounts.entries()].sort((a, b) => b[1] - a[1])[0];

  const allDates = allEntries.map((e) => e.date);
  const { current: currentStreak } = computeStreak(allDates);

  const allMoods  = allEntries.map((e) => e.mood).filter((v): v is number => v != null);
  const allSleeps = allEntries.map((e) => e.sleepHours).filter((v): v is number => v != null);

  // Generate per-section callouts — parallel calls to ZAI.
  const avgMoodPeriod   = avg(periodMoods);
  const avgEnergyPeriod = avg(periodEnergy);
  const avgStressPeriod = avg(periodStress);
  const avgSleepPeriod  = avg(periodSleep);

  const generate = async (section: Section): Promise<string> => {
    let prompt = '';
    switch (section) {
      case 'mood':
        prompt = moodPrompt({ avgMood: avgMoodPeriod, avgEnergy: avgEnergyPeriod,
          avgStress: avgStressPeriod, entryCount: periodEntries.length, period });
        break;
      case 'sleep':
        prompt = sleepPrompt({ avgHours: avgSleepPeriod, topQuality, entryCount: periodEntries.length });
        break;
      case 'symptoms':
        if (periodEntries.length === 0) return '';
        prompt = symptomPrompt({ topSymptoms, entryCount: periodEntries.length });
        break;
      case 'selfCare':
        if (!topSelfCareEntry) return '';
        prompt = selfCarePrompt({ topActivity: topSelfCareEntry[0],
          activityCount: topSelfCareEntry[1], totalEntries: allEntries.length });
        break;
      case 'overall':
        prompt = overallPrompt({
          currentStreak, totalEntries: allEntries.length,
          avgMood: avg(allMoods), avgSleep: avg(allSleeps),
          topSelfCare: topSelfCareEntry?.[0] ?? null,
          topSymptom: topSymptoms[0] ?? null,
        });
        break;
    }
    if (!prompt) return '';

    const aiText = await zaiChat([{ role: 'system', content: SYSTEM }, { role: 'user', content: prompt }]);
    if (aiText) return aiText;

    // Fallback to local heuristic if ZAI unavailable.
    switch (section) {
      case 'mood':
        return moodCallout({ avgMood: avgMoodPeriod, avgEnergy: avgEnergyPeriod,
          avgStress: avgStressPeriod, count: periodEntries.length }) ?? '';
      case 'sleep':
        return sleepCallout({ avgHours: avgSleepPeriod,
          qualityDistribution: sleepQualityCounts, count: periodEntries.length }) ?? '';
      case 'symptoms':
        return symptomCallout({ ranked: topSymptoms.map((s, i) => ({ symptom: s, count: symptomCounts.get(s) ?? 0 })),
          totalDays: periodEntries.length }) ?? '';
      case 'selfCare':
        return selfCareCallout({ topSelfCare: topSelfCareEntry?.[0] ?? null,
          count: allEntries.length }) ?? '';
      default:
        return '';
    }
  };

  const results = await Promise.all(SECTIONS.map((s) => generate(s).then((text) => ({ section: s, text }))));

  // Persist cache — upsert each section.
  await Promise.all(
    results
      .filter((r) => r.text)
      .map((r) =>
        prisma.aiInsightCache.upsert({
          where: { userId_date_section: { userId: user.id, date: today, section: r.section } },
          create: { userId: user.id, date: today, section: r.section, text: r.text },
          update: { text: r.text },
        }),
      ),
  );

  return NextResponse.json(Object.fromEntries(results.map((r) => [r.section, r.text])));
}
