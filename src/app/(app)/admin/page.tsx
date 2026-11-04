import { Box, Card, Container, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { computeStreak } from '@/lib/utils/streak';
import { MotionFade } from '@/components/animations/MotionFade';
import dayjs from 'dayjs';

export const metadata = { title: 'Admin' };
export const dynamic = 'force-dynamic';

const ROLE_COLORS: Record<string, string> = {
  admin: '#6741d9',
  coach: '#3b5bdb',
  client: '#7A9E7E',
};

const th: React.CSSProperties = {
  textAlign: 'left',
  fontSize: 11,
  letterSpacing: 1.5,
  textTransform: 'uppercase',
  color: '#7A9E7E',
  padding: '10px 12px',
  borderBottom: '1px solid rgba(122,158,126,0.2)',
  whiteSpace: 'nowrap',
};

const td: React.CSSProperties = {
  padding: '10px 12px',
  fontSize: 14,
  color: '#3a5a3f',
  borderBottom: '1px solid rgba(122,158,126,0.08)',
  whiteSpace: 'nowrap',
};

export default async function AdminPage() {
  const user = await requireUser();
  if (user.role !== 'admin') redirect('/dashboard');

  const weekAgo = dayjs().subtract(7, 'day').format('YYYY-MM-DD');
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      displayName: true,
      role: true,
      onboardedAt: true,
      reminderEnabled: true,
      createdAt: true,
      coach: { select: { displayName: true, email: true } },
      entries: { select: { date: true }, orderBy: { date: 'desc' } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const rows = users.map((u) => {
    const dates = u.entries.map((e) => e.date);
    const { current } = computeStreak(dates);
    return {
      ...u,
      totalEntries: u.entries.length,
      lastEntry: dates[0] ?? null,
      streak: current,
      activeThisWeek: dates.some((d) => d >= weekAgo),
    };
  });

  const stats = {
    users: users.length,
    onboarded: users.filter((u) => u.onboardedAt).length,
    coaches: users.filter((u) => u.role === 'coach').length,
    entries: rows.reduce((a, u) => a + u.totalEntries, 0),
    activeThisWeek: rows.filter((u) => u.activeThisWeek).length,
    reminders: users.filter((u) => u.reminderEnabled).length,
  };

  return (
    <Container size="xl" py="lg">
      <Stack gap="xl">
        <MotionFade>
          <Box>
            <Text fz="xs" c="sage.6" tt="uppercase" lts={2}>
              Administration
            </Text>
            <Title order={1} ff="Playfair Display, serif" c="sage.7" fw={500} fz={32}>
              Everyone&apos;s journey
            </Title>
            <Text c="sage.6" fz="sm">
              {stats.users} accounts · {stats.entries} journal entries
            </Text>
          </Box>
        </MotionFade>

        <MotionFade delay={0.05}>
          <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }} spacing="md">
            {[
              { label: 'Users', value: stats.users },
              { label: 'Onboarded', value: stats.onboarded },
              { label: 'Active 7d', value: stats.activeThisWeek },
              { label: 'Coaches', value: stats.coaches },
              { label: 'Entries', value: stats.entries },
              { label: 'Reminders', value: stats.reminders },
            ].map((s) => (
              <Card
                key={s.label}
                radius="lg"
                shadow="sm"
                p="md"
                className="petal-card"
              >
                <Text fz="xs" c="sage.6" tt="uppercase" lts={2}>
                  {s.label}
                </Text>
                <Text fz={26} fw={500} ff="Playfair Display, serif" c="sage.7">
                  {s.value}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        </MotionFade>

        <MotionFade delay={0.08}>
          <Card radius="lg" p="lg" className="petal-card">
            <Box style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  minWidth: 780,
                }}
              >
                <thead>
                  <tr>
                    <th style={th}>User</th>
                    <th style={th}>Role</th>
                    <th style={th}>Coach</th>
                    <th style={th}>Entries</th>
                    <th style={th}>Streak</th>
                    <th style={th}>Last entry</th>
                    <th style={th}>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((u) => (
                    <tr key={u.id}>
                      <td style={td}>
                        <div>{u.displayName ?? '—'}</div>
                        <div style={{ fontSize: 12, color: '#7A9E7E' }}>{u.email}</div>
                      </td>
                      <td style={td}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 500,
                            padding: '3px 10px',
                            borderRadius: 999,
                            background: `${ROLE_COLORS[u.role] ?? 'gray'}1f`,
                            color: ROLE_COLORS[u.role] ?? 'gray',
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td style={{ ...td, fontSize: 12 }}>
                        {u.coach ? u.coach.displayName ?? u.coach.email : '—'}
                      </td>
                      <td style={td}>{u.totalEntries}</td>
                      <td style={td}>{u.streak > 0 ? `${u.streak}d 🔥` : '—'}</td>
                      <td style={{ ...td, fontSize: 12 }}>{u.lastEntry ?? 'never'}</td>
                      <td style={{ ...td, fontSize: 12 }}>
                        {dayjs(u.createdAt).format('D MMM YYYY')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Card>
        </MotionFade>
      </Stack>
    </Container>
  );
}
