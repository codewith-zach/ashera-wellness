import { Box, Container, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { requireUser } from '@/lib/auth';
import { LinkAnchor } from '@/components/ui/links';
import { prisma } from '@/lib/db';
import { unpackArr } from '@/lib/utils/json-array';
import { computeStreak } from '@/lib/utils/streak';
import { periodFromQuery, periodLabel, periodStart } from '@/lib/utils/period';
import { ChartCard } from '@/components/charts/ChartCard';
import { MoodSparkline } from '@/components/charts/MoodSparkline';
import { EnergyStressChart } from '@/components/charts/EnergyStressChart';
import { SleepBarChart } from '@/components/charts/SleepBarChart';
import { SleepDoughnut } from '@/components/charts/SleepDoughnut';
import { SymptomBars } from '@/components/charts/SymptomBars';
import { SymptomHeatmap } from '@/components/charts/SymptomHeatmap';
import { SelfCareDonut } from '@/components/charts/SelfCareDonut';
import { InsightsHero } from '@/components/insights/InsightsHero';
import { PeriodTabs } from '@/components/insights/PeriodTabs';
import {
  AiInsightCallout,
  AiOverallCallout,
} from '@/components/insights/AiInsightSection';

export const dynamic = 'force-dynamic';

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const sp = await searchParams;
  const user = await requireUser();
  const period = periodFromQuery(sp.period ?? null);
  const start = periodStart(period);

  const [allEntries, periodEntries] = await Promise.all([
    prisma.dailyEntry.findMany({
      where: { userId: user.id },
      select: {
        date: true,
        mood: true,
        sleepHours: true,
        waterCups: true,
        symptoms: true,
        selfCare: true,
      },
    }),
    prisma.dailyEntry.findMany({
      where: {
        userId: user.id,
        ...(start ? { date: { gte: start } } : {}),
      },
      select: {
        date: true,
        mood: true,
        energyLevel: true,
        stressLevel: true,
        sleepHours: true,
        sleepQuality: true,
        symptoms: true,
        selfCare: true,
      },
      orderBy: { date: 'asc' },
    }),
  ]);

  const dates = allEntries.map((e) => e.date);
  const { current, longest } = computeStreak(dates);

  const avg = (xs: number[]) =>
    xs.length ? Number((xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(2)) : null;
  const moods = allEntries.map((e) => e.mood).filter((v): v is number => v != null);
  const sleeps = allEntries.map((e) => e.sleepHours).filter((v): v is number => v != null);
  const waters = allEntries.map((e) => e.waterCups).filter((v): v is number => v != null);

  const symptomCounts = new Map<string, number>();
  for (const e of allEntries) {
    for (const s of unpackArr(e.symptoms))
      symptomCounts.set(s, (symptomCounts.get(s) ?? 0) + 1);
  }
  const selfCareCounts = new Map<string, number>();
  for (const e of allEntries) {
    for (const s of unpackArr(e.selfCare))
      selfCareCounts.set(s, (selfCareCounts.get(s) ?? 0) + 1);
  }
  const top = (m: Map<string, number>) =>
    [...m.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const summary = {
    totalEntries: allEntries.length,
    avgMood: avg(moods),
    avgSleep: avg(sleeps),
    avgWater: avg(waters),
    longestStreak: longest,
    currentStreak: current,
    topSymptom: top(symptomCounts),
    topSelfCare: top(selfCareCounts),
  };

  const moodSeries = periodEntries.map((e) => ({
    date: e.date,
    mood: e.mood,
    energy: e.energyLevel,
    stress: e.stressLevel,
  }));

  const periodMoods = periodEntries
    .map((e) => e.mood)
    .filter((v): v is number => v != null);
  const periodEnergy = periodEntries
    .map((e) => e.energyLevel)
    .filter((v): v is number => v != null);
  const periodStress = periodEntries
    .map((e) => e.stressLevel)
    .filter((v): v is number => v != null);

  const sleepSeries = periodEntries.map((e) => ({
    date: e.date,
    hours: e.sleepHours,
    quality: e.sleepQuality,
  }));
  const qualityDist: Record<string, number> = {
    Poor: 0,
    Fair: 0,
    Good: 0,
    Deep: 0,
  };
  for (const s of sleepSeries) {
    if (s.quality && s.quality in qualityDist) qualityDist[s.quality] += 1;
  }
  const periodSleep = sleepSeries
    .map((s) => s.hours)
    .filter((h): h is number => h != null);

  const symptomHeatmapData = periodEntries.map((e) => ({
    date: e.date,
    count: unpackArr(e.symptoms).length,
  }));
  const periodSymptomCounts = new Map<string, number>();
  for (const e of periodEntries) {
    for (const s of unpackArr(e.symptoms))
      periodSymptomCounts.set(s, (periodSymptomCounts.get(s) ?? 0) + 1);
  }
  const rankedSymptoms = [...periodSymptomCounts.entries()]
    .map(([symptom, count]) => ({ symptom, count }))
    .sort((a, b) => b.count - a.count);

  const selfCareData = [...selfCareCounts.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <Container size="lg" px={{ base: 'sm', sm: 'md' }} py={{ base: 'md', sm: 'lg' }}>
      <Stack gap="xl">
        <Box>
          <Group justify="space-between" align="flex-start" wrap="wrap" gap="xs">
            <Box style={{ minWidth: 0 }}>
              <Text fz="xs" c="sage.6" tt="uppercase" lts={2}>
                Insights
              </Text>
              <Title
                order={1}
                ff="Playfair Display, serif"
                c="sage.7"
                fw={500}
                fz={{ base: 22, xs: 26, sm: 32 }}
                lh={1.2}
              >
                Your healing journey
              </Title>
            </Box>
            <LinkAnchor href="/insights/advanced" c="sage.6" fz="sm" style={{ whiteSpace: 'nowrap' }}>
              Advanced →
            </LinkAnchor>
          </Group>
        </Box>

        <InsightsHero summary={summary} />

        <AiOverallCallout period={period} />

        <Group justify="space-between" align="center" wrap="wrap" gap="xs">
          <Text c="sage.7" ff="Playfair Display, serif" fz={{ base: 'sm', sm: 'lg' }}>
            {periodLabel(period)}
          </Text>
          <PeriodTabs value={period} />
        </Group>

        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
          <ChartCard title="Mood journey" emoji="🌸" hint="Smoothed across the period">
            <MoodSparkline data={moodSeries.map((s) => ({ date: s.date, mood: s.mood }))} height={200} />
            <AiInsightCallout section="mood" period={period} />
          </ChartCard>

          <ChartCard
            title="Energy & Stress"
            emoji="⚡"
            hint="Two threads that often pull against each other"
          >
            <EnergyStressChart
              data={moodSeries.map((s) => ({
                date: s.date,
                energy: s.energy,
                stress: s.stress,
              }))}
              height={200}
            />
          </ChartCard>

          <ChartCard title="Sleep" emoji="🌙" hint="Hours per night, coloured by quality">
            <SleepBarChart data={sleepSeries} height={200} />
            <AiInsightCallout section="sleep" period={period} />
          </ChartCard>

          <ChartCard title="Sleep quality distribution" emoji="🌙">
            <SleepDoughnut distribution={qualityDist} height={220} />
          </ChartCard>

          <ChartCard title="Symptom rhythm" emoji="🩹" hint={`Last ${period === 'all' ? '90' : period} days`}>
            <SymptomHeatmap
              data={symptomHeatmapData}
              days={period === '7' ? 7 : period === '14' ? 14 : period === '30' ? 30 : 90}
            />
            <AiInsightCallout section="symptoms" period={period} />
          </ChartCard>

          <ChartCard title="Top symptoms" emoji="🩹">
            <SymptomBars data={rankedSymptoms} />
          </ChartCard>

          <ChartCard
            title="Self-care companions"
            emoji="🛁"
            hint="What's been showing up most for you (all time)"
          >
            <SelfCareDonut data={selfCareData} />
            <AiInsightCallout section="selfCare" period={period} />
          </ChartCard>
        </SimpleGrid>

        <Text c="sage.6" fz="xs" ta="center" mt="md">
          Insights generated by ZhipuAI glm-4-flash · cached daily · based only on your data.
        </Text>
      </Stack>
    </Container>
  );
}
