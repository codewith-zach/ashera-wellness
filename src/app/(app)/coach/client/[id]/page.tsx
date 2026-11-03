import { Box, Card, Container, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { redirect } from 'next/navigation';
import { LinkText } from '@/components/ui/links';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { toView } from '@/lib/entry-mapper';
import { computeStreak, entriesThisWeek } from '@/lib/utils/streak';
import { longDate, lastNDates } from '@/lib/utils/date';
import { MOOD_OPTIONS } from '@/lib/data/options';
import { MoodSparkline } from '@/components/charts/MoodSparkline';
import { SleepBarChart } from '@/components/charts/SleepBarChart';
import { ChartCard } from '@/components/charts/ChartCard';
import { CheckInHeatmap } from '@/components/dashboard/CheckInHeatmap';
import { MotionFade } from '@/components/animations/MotionFade';
import dayjs from 'dayjs';

export const dynamic = 'force-dynamic';

export default async function CoachClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const coach = await requireUser();
  if (coach.role !== 'coach') redirect('/dashboard');

  const client = await prisma.user.findFirst({
    where: { id, coachId: coach.id },
  });
  if (!client) redirect('/coach');

  const entries = await prisma.dailyEntry.findMany({
    where: { userId: id },
    orderBy: { date: 'asc' },
  });

  const views = entries.map(toView);
  const dates = entries.map((e) => e.date);
  const { current, longest } = computeStreak(dates);

  const last7Start = dayjs().subtract(6, 'day').format('YYYY-MM-DD');
  const last7 = entries.filter((e) => e.date >= last7Start);
  const last30 = entries.filter(
    (e) => e.date >= dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
  );

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

  const allMoods = entries.map((e) => e.mood).filter((v): v is number => v != null);
  const allSleeps = entries.map((e) => e.sleepHours).filter((v): v is number => v != null);
  const avg = (xs: number[]) =>
    xs.length ? Number((xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(1)) : null;

  return (
    <Container size="lg" py="lg">
      <Stack gap="xl">
        <MotionFade>
          <Box>
            <LinkText
              href="/coach"
              fz="xs"
              c="sage.6"
              style={{ textDecoration: 'none' }}
            >
              ← All clients
            </LinkText>
            <Title
              order={1}
              ff="Playfair Display, serif"
              c="sage.7"
              fw={500}
              fz={36}
              mt={4}
            >
              {client.displayName ?? client.email}
            </Title>
            <Text c="sage.6" fz="sm">
              {client.email} · Read-only view
            </Text>
          </Box>
        </MotionFade>

        {/* Summary stats */}
        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
          {[
            { label: 'Current streak', value: `${current}d 🔥` },
            { label: 'Longest streak', value: `${longest}d` },
            { label: 'This week', value: `${entriesThisWeek(dates)}/7` },
            { label: 'Total entries', value: entries.length },
          ].map((s) => (
            <Card
              key={s.label}
              radius="lg"
              shadow="sm"
              p="md"
              style={{ background: 'rgba(255,255,255,0.88)', border: '1px solid rgba(122,158,126,0.10)' }}
            >
              <Text fz="xs" c="sage.6" tt="uppercase" lts={2}>{s.label}</Text>
              <Text fz={24} fw={500} ff="Playfair Display, serif" c="sage.7">
                {s.value}
              </Text>
            </Card>
          ))}
        </SimpleGrid>

        {/* Charts */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          <ChartCard title="Mood — last 7 days" emoji="🌸">
            <MoodSparkline
              data={series.map((s) => ({ date: s.date, mood: s.mood }))}
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

        {/* Heatmap */}
        <Box
          p="lg"
          style={{
            background: 'rgba(255,255,255,0.85)',
            borderRadius: 20,
            border: '1px solid rgba(122,158,126,0.10)',
          }}
        >
          <Stack gap="md">
            <Title order={4} ff="Playfair Display, serif" c="sage.7" fw={500}>
              30-day rhythm
            </Title>
            <CheckInHeatmap loggedDates={new Set(last30.map((e) => e.date))} />
          </Stack>
        </Box>

        {/* Recent entries */}
        <Stack gap="md">
          <Title order={3} ff="Playfair Display, serif" c="sage.7" fw={500}>
            Recent entries
          </Title>
          {views
            .slice()
            .reverse()
            .slice(0, 10)
            .map((e) => {
              const mood = MOOD_OPTIONS.find((m) => m.value === e.mood);
              return (
                <Card
                  key={e.id}
                  radius="lg"
                  p="md"
                  style={{ background: 'rgba(255,255,255,0.88)', border: '1px solid rgba(122,158,126,0.10)' }}
                >
                  <Group justify="space-between" wrap="nowrap">
                    <Stack gap={2}>
                      <Text fz="xs" c="sage.6" tt="uppercase" lts={2}>
                        {longDate(e.date)}
                      </Text>
                      <Group gap={6}>
                        {mood && <span style={{ fontSize: 20 }}>{mood.emoji}</span>}
                        <Text c="sage.7">{mood?.label ?? '—'}</Text>
                        {e.symptoms.length > 0 && (
                          <Text fz="xs" c="rose.6">
                            🩹 {e.symptoms.slice(0, 2).join(', ')}
                          </Text>
                        )}
                      </Group>
                      {e.gratitude && (
                        <Text fz="sm" c="sage.8" fs="italic" lineClamp={1}>
                          "{e.gratitude}"
                        </Text>
                      )}
                    </Stack>
                    <Group gap="md">
                      {e.sleepHours != null && (
                        <Text fz="sm" c="lavender.7">🌙 {e.sleepHours}h</Text>
                      )}
                      {e.waterCups != null && (
                        <Text fz="sm" c="sage.7">💧 {e.waterCups}/8</Text>
                      )}
                    </Group>
                  </Group>
                </Card>
              );
            })}
        </Stack>
      </Stack>
    </Container>
  );
}
