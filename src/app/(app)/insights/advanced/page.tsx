import { Box, Container, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { unpackArr } from '@/lib/utils/json-array';
import { ChartCard } from '@/components/charts/ChartCard';
import {
  LazyMoodSleepScatter,
  LazyMonthlyComparison,
  LazyHormonePhaseRing,
} from '@/components/charts/lazy';
import { PainBodyMap } from '@/components/charts/PainBodyMap';
import { MotionFade } from '@/components/animations/MotionFade';
import dayjs from 'dayjs';

export const metadata = { title: 'Advanced Insights' };
export const dynamic = 'force-dynamic';

export default async function AdvancedInsightsPage() {
  const user = await requireUser();

  const thisMonthStart = dayjs().startOf('month').format('YYYY-MM-DD');
  const lastMonthStart = dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
  const lastMonthEnd   = dayjs().startOf('month').format('YYYY-MM-DD');

  const [allEntries, thisMonthEntries, lastMonthEntries] = await Promise.all([
    prisma.dailyEntry.findMany({
      where: { userId: user.id },
      select: { date: true, mood: true, sleepHours: true, cyclePhase: true, painAreas: true },
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

  const scatterData = allEntries.map((e) => ({
    date: e.date,
    sleepHours: e.sleepHours,
    mood: e.mood,
  }));

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
    { label: 'Sleep', thisMonth: buildAvgs(thisMonthEntries).sleep, lastMonth: buildAvgs(lastMonthEntries).sleep },
    { label: 'Water', thisMonth: buildAvgs(thisMonthEntries).water, lastMonth: buildAvgs(lastMonthEntries).water },
    { label: 'Energy', thisMonth: buildAvgs(thisMonthEntries).energy, lastMonth: buildAvgs(lastMonthEntries).energy },
    { label: 'Stress', thisMonth: buildAvgs(thisMonthEntries).stress, lastMonth: buildAvgs(lastMonthEntries).stress },
  ];

  const maxPain = Math.max(...Object.values(painCounts), 1);

  return (
    <Container size="lg" py="lg">
      <Stack gap="xl">
        <MotionFade>
          <Box>
            <Text fz="xs" c="sage.6" tt="uppercase" lts={3}>
              Advanced insights
            </Text>
            <Title order={1} ff="Playfair Display, serif" c="sage.7" fw={500} fz={36}>
              Deeper patterns
            </Title>
            <Text c="sage.7" mt="xs">
              Correlation, cycles, and month-on-month progress — patterns that reveal themselves over time.
            </Text>
          </Box>
        </MotionFade>

        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
          <ChartCard
            title="Mood vs Sleep"
            emoji="✨"
            hint="Each dot is one entry. The gold line is your personal trend."
          >
            <LazyMoodSleepScatter data={scatterData} height={260} />
          </ChartCard>

          <ChartCard
            title="This month vs last month"
            emoji="📊"
            hint="Green = this month · Sage = last month"
          >
            <LazyMonthlyComparison data={monthlyComparison} />
          </ChartCard>

          <ChartCard
            title="Hormone & cycle phases"
            emoji="🌙"
            hint="Last 30 days · colour-coded by phase"
          >
            <LazyHormonePhaseRing entries={hormonalData} days={30} />
          </ChartCard>

          <ChartCard
            title="Pain frequency map"
            emoji="🩹"
            hint="Deeper rose = reported more often"
          >
            <PainBodyMap painCounts={painCounts} maxCount={maxPain} />
          </ChartCard>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
