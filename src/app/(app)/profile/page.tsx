import { Anchor, Card, Container, Group, Stack, Text, Title } from '@mantine/core';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ReminderSettings } from '@/components/profile/ReminderSettings';
import { CoachLinkSettings } from '@/components/profile/CoachLinkSettings';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const user = await requireUser();
  const withCoach = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      coach: { select: { displayName: true, email: true } },
    },
  });
  return (
    <Container size="sm" py="lg">
      <Stack gap="lg">
        <Title order={1} ff="Playfair Display, serif" c="sage.7" fw={500}>
          Profile
        </Title>
        <Card radius="lg" p="lg" className="petal-card">
          <Stack gap="sm">
            <Group justify="space-between">
              <Text c="sage.6" fz="sm">
                Email
              </Text>
              <Text c="sage.8">{user.email}</Text>
            </Group>
            <Group justify="space-between">
              <Text c="sage.6" fz="sm">
                Display name
              </Text>
              <Text c="sage.8">{user.displayName ?? '—'}</Text>
            </Group>
            <Group justify="space-between">
              <Text c="sage.6" fz="sm">
                Onboarded
              </Text>
              <Text c="sage.8">
                {user.onboardedAt
                  ? new Date(user.onboardedAt).toLocaleDateString()
                  : 'Not yet'}
              </Text>
            </Group>
          </Stack>
        </Card>

        <ReminderSettings
          initialEnabled={user.reminderEnabled}
          initialHour={user.reminderHour}
          initialTimezone={user.timezone}
        />

        <CoachLinkSettings coach={withCoach?.coach ?? null} />

        <Card radius="lg" p="lg" className="petal-card">
          <Stack gap="sm">
            <Text c="sage.7" ff="Playfair Display, serif" fz="lg" fw={500}>
              Export your data
            </Text>
            <Text fz="sm" c="sage.7">
              Your journal belongs to you. Export everything as a spreadsheet or a JSON summary.
            </Text>
            <Group gap="md">
              <Anchor href="/api/export?format=csv" c="sage.6" fz="sm" download>
                ↓ Download CSV (all entries)
              </Anchor>
              <Anchor href="/api/export?format=summary" c="sage.6" fz="sm" target="_blank">
                ↗ View JSON summary
              </Anchor>
            </Group>
          </Stack>
        </Card>

        <Text c="sage.6" fz="xs">
          Reminder email delivery uses Resend — set <code>RESEND_API_KEY</code> in
          your env to enable actual sending; without it, the cron handler dry-runs
          and logs.
        </Text>
      </Stack>
    </Container>
  );
}
