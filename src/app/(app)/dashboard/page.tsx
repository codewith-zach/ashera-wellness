import { Box, Container, Stack, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { toView } from '@/lib/entry-mapper';
import { dailyAffirmation } from '@/lib/data/options';
import {
  longDate,
  timeBasedGreeting,
  todayISO,
} from '@/lib/utils/date';
import { computeStreak, entriesThisWeek } from '@/lib/utils/streak';
import { CheckInHeatmap } from '@/components/dashboard/CheckInHeatmap';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { GentleReturn } from '@/components/dashboard/GentleReturn';
import { MonthlyAffirmation } from '@/components/dashboard/MonthlyAffirmation';
import { StatsBar } from '@/components/dashboard/StatsBar';
import { TodayStatusCard } from '@/components/dashboard/TodayStatusCard';
import { MotionFade } from '@/components/animations/MotionFade';
import { lastNDates } from '@/lib/utils/date';
import { detectGentleReturn } from '@/lib/utils/streak-detect';
import { journalNow } from '@/lib/utils/journal-time';
import { themeFor } from '@/lib/data/months';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await requireUser();
  const today = todayISO();

  const sevenDayStart = dayjs().subtract(6, 'day').format('YYYY-MM-DD');
  const { monthNumber } = journalNow(user.journalStartDate);
  const monthTheme = themeFor(monthNumber);
  const monthlySetup = await prisma.monthlySetup.findUnique({
    where: { userId_monthNumber: { userId: user.id, monthNumber } },
  });
  const [todayEntry, allDates, last30, last7] = await Promise.all([
    prisma.dailyEntry.findUnique({
      where: { userId_date: { userId: user.id, date: today } },
    }),
    prisma.dailyEntry.findMany({
      where: { userId: user.id },
      select: { date: true, mood: true },
      orderBy: { date: 'desc' },
    }),
    prisma.dailyEntry.findMany({
      where: {
        userId: user.id,
        date: { gte: dayjs().subtract(30, 'day').format('YYYY-MM-DD') },
      },
      select: { date: true, mood: true },
    }),
    prisma.dailyEntry.findMany({
      where: { userId: user.id, date: { gte: sevenDayStart } },
      select: {
        date: true,
        mood: true,
        energyLevel: true,
        stressLevel: true,
        sleepHours: true,
        sleepQuality: true,
      },
      orderBy: { date: 'asc' },
    }),
  ]);

  const sevenDayMap = new Map(last7.map((e) => [e.date, e]));
  const series = lastNDates(7).map((d) => {
    const e = sevenDayMap.get(d);
    return {
      date: d,
      mood: e?.mood ?? null,
      energy: e?.energyLevel ?? null,
      stress: e?.stressLevel ?? null,
      sleepHours: e?.sleepHours ?? null,
      sleepQuality: e?.sleepQuality ?? null,
    };
  });

  const dates = allDates.map((e) => e.date);
  const { current, longest } = computeStreak(dates);
  const gentleReturn = detectGentleReturn(dates);
  const moodVals = allDates.map((e) => e.mood).filter((m): m is number => !!m);
  const avgMood =
    moodVals.length > 0
      ? moodVals.reduce((a, b) => a + b, 0) / moodVals.length
      : 0;
  const moodEmojiAvg =
    avgMood >= 4.5 ? '🌟' : avgMood >= 3.5 ? '😊' : avgMood >= 2.5 ? '😐' : avgMood >= 1.5 ? '😔' : avgMood > 0 ? '😞' : '·';

  return (
    <Container size="lg" px={{ base: 'sm', sm: 'md' }} py={{ base: 'md', sm: 'lg' }}>
      <Stack gap="xl">
        <MotionFade>
          <Box>
            <Text
              fz={{ base: 'xs', sm: 'sm' }}
              c="sage.6"
              tt="uppercase"
              lts={{ base: 2, sm: 3 }}
              lh={1.4}
            >
              {longDate(today)}
            </Text>
            <Title
              order={1}
              ff="Playfair Display, serif"
              c="sage.7"
              fw={500}
              fz={{ base: 26, xs: 30, sm: 34, md: 40 }}
              lh={1.15}
              mt={4}
            >
              {timeBasedGreeting(user.displayName)} 🌿
            </Title>
            <Text
              c="sage.7"
              fs="italic"
              ff="Playfair Display, serif"
              mt="xs"
              fz={{ base: 'md', sm: 'lg' }}
              lh={1.45}
            >
              {dailyAffirmation(today)}
            </Text>
          </Box>
        </MotionFade>

        <StatsBar
          stats={[
            { label: 'Current streak', shortLabel: 'Streak', value: current, emoji: '🔥' },
            { label: 'Longest', shortLabel: 'Longest', value: longest, hint: 'days in a row' },
            {
              label: 'This week',
              shortLabel: 'This week',
              value: `${entriesThisWeek(dates)}/7`,
              hint: 'days logged',
            },
            {
              label: 'Avg mood',
              shortLabel: 'Mood',
              value: avgMood ? avgMood.toFixed(1) : '—',
              emoji: moodEmojiAvg,
            },
            { label: 'Total entries', shortLabel: 'Entries', value: allDates.length },
          ]}
        />

        {gentleReturn.isReturning && (
          <MotionFade delay={0.05}>
            <GentleReturn priorBest={gentleReturn.priorBest} />
          </MotionFade>
        )}

        <MotionFade delay={0.08}>
          <MonthlyAffirmation
            monthNumber={monthNumber}
            theme={monthlySetup?.theme ?? monthTheme.title}
            affirmation={monthlySetup?.affirmation ?? monthTheme.affirmation}
            isCustomized={Boolean(monthlySetup?.affirmation)}
          />
        </MotionFade>

        <MotionFade delay={0.1}>
          <TodayStatusCard entry={todayEntry ? toView(todayEntry) : null} />
        </MotionFade>

        <DashboardCharts series={series} />

        <MotionFade delay={0.15}>
          <Box
            p={{ base: 'md', sm: 'lg' }}
            style={{
              background: 'rgba(255,255,255,0.85)',
              borderRadius: 20,
              border: '1px solid rgba(122,158,126,0.10)',
            }}
          >
            <Stack gap="md">
              <Box>
                <Text fz="xs" c="sage.6" tt="uppercase" lts={2}>
                  Check-in heatmap
                </Text>
                <Title
                  order={3}
                  ff="Playfair Display, serif"
                  c="sage.7"
                  fw={500}
                  fz={{ base: 20, sm: 24 }}
                >
                  Your healing rhythm
                </Title>
              </Box>
              <CheckInHeatmap loggedDates={new Set(last30.map((e) => e.date))} />
            </Stack>
          </Box>
        </MotionFade>
      </Stack>
    </Container>
  );
}
