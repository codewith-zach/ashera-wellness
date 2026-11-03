'use client';

/**
 * Lazy-loaded chart wrappers. Each dynamic import splits the Recharts bundle
 * into its own chunk so it doesn't block the initial page load.
 */

import dynamic from 'next/dynamic';
import { Skeleton, Stack } from '@mantine/core';

const ChartSkeleton = ({ height = 180 }: { height?: number }) => (
  <Stack gap={8}>
    <Skeleton height={height} radius="md" />
  </Stack>
);

export const LazyMoodSparkline = dynamic(
  () => import('./MoodSparkline').then((m) => m.MoodSparkline),
  { loading: () => <ChartSkeleton />, ssr: false },
);

export const LazyEnergyStressChart = dynamic(
  () => import('./EnergyStressChart').then((m) => m.EnergyStressChart),
  { loading: () => <ChartSkeleton />, ssr: false },
);

export const LazySleepBarChart = dynamic(
  () => import('./SleepBarChart').then((m) => m.SleepBarChart),
  { loading: () => <ChartSkeleton />, ssr: false },
);

export const LazySleepDoughnut = dynamic(
  () => import('./SleepDoughnut').then((m) => m.SleepDoughnut),
  { loading: () => <ChartSkeleton height={200} />, ssr: false },
);

export const LazySymptomBars = dynamic(
  () => import('./SymptomBars').then((m) => m.SymptomBars),
  { loading: () => <ChartSkeleton height={220} />, ssr: false },
);

export const LazySymptomHeatmap = dynamic(
  () => import('./SymptomHeatmap').then((m) => m.SymptomHeatmap),
  { loading: () => <ChartSkeleton height={80} />, ssr: false },
);

export const LazySelfCareDonut = dynamic(
  () => import('./SelfCareDonut').then((m) => m.SelfCareDonut),
  { loading: () => <ChartSkeleton height={220} />, ssr: false },
);

export const LazyMoodSleepScatter = dynamic(
  () => import('./MoodSleepScatter').then((m) => m.MoodSleepScatter),
  { loading: () => <ChartSkeleton height={240} />, ssr: false },
);

export const LazyMonthlyComparison = dynamic(
  () => import('./MonthlyComparison').then((m) => m.MonthlyComparison),
  { loading: () => <ChartSkeleton height={200} />, ssr: false },
);

export const LazyHormonePhaseRing = dynamic(
  () => import('./HormonePhaseRing').then((m) => m.HormonePhaseRing),
  { loading: () => <ChartSkeleton height={240} />, ssr: false },
);

export const LazyWellbeingRadar = dynamic(
  () => import('./WellbeingRadar').then((m) => m.WellbeingRadar),
  { loading: () => <ChartSkeleton height={260} />, ssr: false },
);
