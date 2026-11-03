import { Box, Card, Container, Group, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';
import dayjs from 'dayjs';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { toView } from '@/lib/entry-mapper';
import { MOOD_OPTIONS } from '@/lib/data/options';
import { longDate } from '@/lib/utils/date';
import { HistoryFilters } from '@/components/history/HistoryFilters';
import { HistoryPagination } from '@/components/history/HistoryPagination';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: { month?: string; mood?: string; page?: string };
}) {
  const user = await requireUser();
  const month = searchParams.month && /^\d{4}-\d{2}$/.test(searchParams.month) ? searchParams.month : 'all';
  const mood = searchParams.mood && /^[1-5]$/.test(searchParams.mood) ? searchParams.mood : 'all';
  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1);

  const where: {
    userId: string;
    date?: { gte: string; lt: string };
    mood?: number;
  } = { userId: user.id };
  if (month !== 'all') {
    const start = dayjs(`${month}-01`).format('YYYY-MM-DD');
    const end = dayjs(start).add(1, 'month').format('YYYY-MM-DD');
    where.date = { gte: start, lt: end };
  }
  if (mood !== 'all') {
    where.mood = parseInt(mood, 10);
  }

  const [entries, total, allDates] = await Promise.all([
    prisma.dailyEntry.findMany({
      where,
      orderBy: { date: 'desc' },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.dailyEntry.count({ where }),
    prisma.dailyEntry.findMany({
      where: { userId: user.id },
      select: { date: true },
      orderBy: { date: 'desc' },
    }),
  ]);
  const view = entries.map(toView);

  // Build month options from all entries
  const monthSet = new Set(allDates.map((e) => e.date.slice(0, 7)));
  const months = [...monthSet].sort().reverse().map((m) => ({
    value: m,
    label: dayjs(`${m}-01`).format('MMMM YYYY'),
  }));

  // Group by month for separator headers
  const byMonth = new Map<string, typeof view>();
  for (const e of view) {
    const k = e.date.slice(0, 7);
    const arr = byMonth.get(k) ?? [];
    arr.push(e);
    byMonth.set(k, arr);
  }

  return (
    <Container size="md" px={{ base: 'sm', sm: 'md' }} py={{ base: 'md', sm: 'lg' }}>
      <Stack gap="lg">
        <Box>
          <Text fz="xs" c="sage.6" tt="uppercase" lts={2}>
            Archive
          </Text>
          <Title order={1} ff="Playfair Display, serif" c="sage.7" fw={500} fz={{ base: 22, sm: 32 }} lh={1.2}>
            Every entry, gently kept
          </Title>
          <Text c="sage.7" mt="xs" fz="sm">
            {total} {total === 1 ? 'entry' : 'entries'}
            {month !== 'all' && ` in ${dayjs(`${month}-01`).format('MMMM YYYY')}`}
          </Text>
        </Box>

        <HistoryFilters months={months} month={month} mood={mood} />

        {view.length === 0 ? (
          <Card radius="lg" p="xl" style={{ background: 'rgba(255,255,255,0.85)' }}>
            <Text c="sage.7" ta="center">
              No entries match those filters yet.
            </Text>
          </Card>
        ) : (
          <Stack gap="lg">
            {[...byMonth.entries()].map(([monthKey, items]) => (
              <Stack key={monthKey} gap="sm">
                <Text
                  fz="sm"
                  c="sage.6"
                  tt="uppercase"
                  lts={3}
                  ff="Playfair Display, serif"
                >
                  {dayjs(`${monthKey}-01`).format('MMMM YYYY')}
                </Text>
                {items.map((e) => {
                  const moodMeta = MOOD_OPTIONS.find((m) => m.value === e.mood);
                  const symptoms = e.symptoms.slice(0, 3).join(' · ');
                  const selfCare = e.selfCare.slice(0, 2).join(' · ');
                  return (
                    <Card
                      key={e.id}
                      component={Link}
                      href={`/journal/${e.date}`}
                      radius="lg"
                      p={{ base: 'md', sm: 'lg' }}
                      style={{
                        background: 'rgba(255,255,255,0.88)',
                        border: '1px solid rgba(122,158,126,0.10)',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      }}
                    >
                      <Group justify="space-between" wrap="nowrap" align="flex-start" gap="sm">
                        <Stack gap={4} style={{ minWidth: 0, flex: 1 }}>
                          <Text fz="xs" c="sage.6" tt="uppercase" lts={1} lineClamp={1}>
                            {longDate(e.date)}
                          </Text>
                          <Group gap={8} align="baseline" wrap="nowrap">
                            {moodMeta && <span style={{ fontSize: 20 }}>{moodMeta.emoji}</span>}
                            <Text c="sage.7" ff="Playfair Display, serif" fz={{ base: 'md', sm: 'lg' }}>
                              {moodMeta?.label ?? '—'}
                            </Text>
                          </Group>
                          {symptoms && (
                            <Text fz="xs" c="rose.7" lineClamp={1}>
                              🩹 {symptoms}
                            </Text>
                          )}
                          {selfCare && (
                            <Text fz="xs" c="sage.7" lineClamp={1}>
                              ✿ {selfCare}
                            </Text>
                          )}
                          {e.gratitude && (
                            <Text c="sage.8" fs="italic" lineClamp={2} fz="sm">
                              &ldquo;{e.gratitude}&rdquo;
                            </Text>
                          )}
                        </Stack>
                        <Stack gap={4} align="flex-end">
                          {e.sleepHours != null && (
                            <Text fz="sm" c="lavender.7">
                              🌙 {e.sleepHours}h
                            </Text>
                          )}
                          {e.waterCups != null && (
                            <Text fz="sm" c="sage.7">
                              💧 {e.waterCups}/8
                            </Text>
                          )}
                        </Stack>
                      </Group>
                    </Card>
                  );
                })}
              </Stack>
            ))}
          </Stack>
        )}

        <HistoryPagination total={total} page={page} pageSize={PAGE_SIZE} />
      </Stack>
    </Container>
  );
}
