'use client';

import { SimpleGrid } from '@mantine/core';
import { ChartCard } from '@/components/charts/ChartCard';
import {
  LazyEnergyStressChart as EnergyStressChart,
  LazyMoodSparkline as MoodSparkline,
  LazySleepBarChart as SleepBarChart,
} from '@/components/charts/lazy';

interface Point {
  date: string;
  mood: number | null;
  energy: number | null;
  stress: number | null;
  sleepHours: number | null;
  sleepQuality: string | null;
}

export function DashboardCharts({ series }: { series: Point[] }) {
  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
      <ChartCard
        title="Mood — last 7 days"
        emoji="🌸"
        hint="A gentle line through your week"
      >
        <MoodSparkline data={series.map((s) => ({ date: s.date, mood: s.mood }))} />
      </ChartCard>

      <ChartCard
        title="Energy & Stress"
        emoji="⚡"
        hint="When the lines diverge, your body is asking for something"
      >
        <EnergyStressChart
          data={series.map((s) => ({
            date: s.date,
            energy: s.energy,
            stress: s.stress,
          }))}
        />
      </ChartCard>

      <ChartCard title="Sleep — last 7 nights" emoji="🌙">
        <SleepBarChart
          data={series.map((s) => ({
            date: s.date,
            hours: s.sleepHours,
            quality: s.sleepQuality,
          }))}
        />
      </ChartCard>
    </SimpleGrid>
  );
}
