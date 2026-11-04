import { Box, Card, Container, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { computeStreak } from '@/lib/utils/streak';
import { CoachClientList } from '@/components/coach/CoachClientList';
import { MotionFade } from '@/components/animations/MotionFade';
import dayjs from 'dayjs';

export const dynamic = 'force-dynamic';

export default async function CoachDashboardPage() {
  const user = await requireUser();
  if (user.role !== 'coach') redirect('/dashboard');

  const clients = await prisma.user.findMany({
    where: { coachId: user.id },
    select: {
      id: true,
      displayName: true,
      email: true,
      journalStartDate: true,
      entries: {
        select: { date: true, mood: true, sleepHours: true },
        orderBy: { date: 'desc' },
      },
    },
  });

  const today = dayjs().format('YYYY-MM-DD');
  const weekAgo = dayjs().subtract(7, 'day').format('YYYY-MM-DD');

  const enriched = clients.map((c) => {
    const dates = c.entries.map((e) => e.date);
    const { current: streak } = computeStreak(dates);
    const lastEntry = dates[0] ?? null;
    const daysSinceLastEntry = lastEntry ? dayjs(today).diff(dayjs(lastEntry), 'day') : Infinity;
    const atRisk = daysSinceLastEntry >= 7;
    const thisWeek = c.entries.filter((e) => e.date >= weekAgo);
    const weekMoods = thisWeek.map((e) => e.mood).filter((v): v is number => v != null);
    const weekSleeps = thisWeek.map((e) => e.sleepHours).filter((v): v is number => v != null);
    return {
      id: c.id,
      displayName: c.displayName,
      email: c.email,
      streak,
      lastEntry,
      daysSinceLastEntry: isFinite(daysSinceLastEntry) ? daysSinceLastEntry : 999,
      atRisk,
      totalEntries: c.entries.length,
      avgMoodWeek: weekMoods.length
        ? Number((weekMoods.reduce((a, b) => a + b, 0) / weekMoods.length).toFixed(1))
        : null,
      avgSleepWeek: weekSleeps.length
        ? Number((weekSleeps.reduce((a, b) => a + b, 0) / weekSleeps.length).toFixed(1))
        : null,
      entriesThisWeek: thisWeek.length,
    };
  });

  const atRiskClients = enriched.filter((c) => c.atRisk);
  const allWeekMoods = enriched.flatMap((c) => (c.avgMoodWeek != null ? [c.avgMoodWeek] : []));
  const allWeekSleeps = enriched.flatMap((c) => (c.avgSleepWeek != null ? [c.avgSleepWeek] : []));
  const avgMoodAcrossClients = allWeekMoods.length
    ? Number((allWeekMoods.reduce((a, b) => a + b, 0) / allWeekMoods.length).toFixed(1))
    : null;
  const avgSleepAcrossClients = allWeekSleeps.length
    ? Number((allWeekSleeps.reduce((a, b) => a + b, 0) / allWeekSleeps.length).toFixed(1))
    : null;

  // Sort: at-risk first, then by streak desc
  const sorted = [...enriched].sort((a, b) => {
    if (a.atRisk && !b.atRisk) return -1;
    if (!a.atRisk && b.atRisk) return 1;
    return b.streak - a.streak;
  });

  return (
    <Container size="xl" px={{ base: 'sm', sm: 'md' }} py={{ base: 'md', sm: 'lg' }}>
      <Stack gap="xl">
        <MotionFade>
          <Box>
            <Text fz="xs" c="sage.6" tt="uppercase" lts={2}>
              Coach view
            </Text>
            <Title order={1} ff="Playfair Display, serif" c="sage.7" fw={500} fz={{ base: 22, sm: 32 }}>
              Your clients
            </Title>
          </Box>
        </MotionFade>

        {/* Aggregate summary */}
        <MotionFade delay={0.05}>
          <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
            {[
              { label: 'Total clients', value: enriched.length },
              {
                label: 'At risk',
                value: atRiskClients.length,
                color: atRiskClients.length > 0 ? 'rose.7' : 'sage.7',
              },
              {
                label: 'Avg mood this week',
                value: avgMoodAcrossClients ? `${avgMoodAcrossClients}/5` : '—',
              },
              {
                label: 'Avg sleep this week',
                value: avgSleepAcrossClients ? `${avgSleepAcrossClients}h` : '—',
              },
            ].map((s) => (
              <Card
                key={s.label}
                radius="lg"
                shadow="sm"
                p="md"
                className="petal-card"
              >
                <Text fz="xs" c="sage.6" tt="uppercase" lts={2}>{s.label}</Text>
                <Text
                  fz={28}
                  fw={500}
                  ff="Playfair Display, serif"
                  c={(s as { color?: string }).color ?? 'sage.7'}
                >
                  {s.value}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        </MotionFade>

        {atRiskClients.length > 0 && (
          <MotionFade delay={0.08}>
            <Card
              radius="lg"
              p="md"
              style={{
                background: 'linear-gradient(120deg, rgba(212,130,122,0.10), rgba(232,196,184,0.12))',
                border: '1px solid rgba(212,130,122,0.22)',
              }}
            >
              <Group gap={10}>
                <span style={{ fontSize: 20 }}>🩹</span>
                <Text c="sage.8" fz="sm">
                  <strong>{atRiskClients.length}</strong> client
                  {atRiskClients.length === 1 ? '' : 's'} haven't logged in 7+ days —
                  {' '}
                  {atRiskClients.map((c) => c.displayName ?? c.email.split('@')[0]).join(', ')}.
                </Text>
              </Group>
            </Card>
          </MotionFade>
        )}

        {sorted.length === 0 ? (
          <Card radius="lg" p="xl" className="petal-card">
            <Text c="sage.7" ta="center">
              No clients linked yet. Share your coach ID with clients so they can connect.
            </Text>
            <Text c="sage.6" fz="sm" ta="center" mt="xs">
              Coach ID: <code>{user.id}</code>
            </Text>
          </Card>
        ) : (
          <CoachClientList clients={sorted} />
        )}
      </Stack>
    </Container>
  );
}
