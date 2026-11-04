'use client';

import { Badge, Card, Group, Stack, Text } from '@mantine/core';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { staggerItem } from '@/components/animations/variants';

interface Client {
  id: string;
  displayName: string | null;
  email: string;
  streak: number;
  lastEntry: string | null;
  daysSinceLastEntry: number;
  atRisk: boolean;
  totalEntries: number;
  avgMoodWeek: number | null;
  avgSleepWeek: number | null;
  entriesThisWeek: number;
}

export function ClientCard({ client }: { client: Client }) {
  const reduced = useReducedMotion();
  const Wrapper = reduced ? 'div' : motion.div;
  return (
    <Wrapper variants={reduced ? undefined : staggerItem}>
      <Card
        component={Link}
        href={`/coach/client/${client.id}`}
        radius="lg"
        p="lg"
        className="petal-card lift-card"
        style={{
          border: client.atRisk
            ? '1.5px solid rgba(212,130,122,0.45)'
            : undefined,
        }}
      >
        <Stack gap={10}>
          <Group justify="space-between" align="flex-start">
            <Stack gap={2}>
              <Text ff="Playfair Display, serif" c="sage.7" fz="lg" fw={500}>
                {client.displayName ?? client.email.split('@')[0]}
              </Text>
              <Text fz="xs" c="sage.6">
                {client.email}
              </Text>
            </Stack>
            <Stack gap={4} align="flex-end">
              {client.atRisk ? (
                <Badge color="rose" radius="xl" variant="light" size="sm">
                  No entry in {client.daysSinceLastEntry}d
                </Badge>
              ) : (
                <Badge color="sage" radius="xl" variant="light" size="sm">
                  Active
                </Badge>
              )}
              <Badge
                radius="xl"
                variant="gradient"
                gradient={{ from: 'gold.5', to: 'gold.7', deg: 135 }}
                leftSection={<span className="flame-icon">🔥</span>}
                size="sm"
              >
                {client.streak}d
              </Badge>
            </Stack>
          </Group>
          <Group gap="xl" wrap="wrap">
            <Stack gap={0}>
              <Text fz={10} c="sage.6" tt="uppercase" lts={1}>
                This week
              </Text>
              <Text c="sage.7" ff="Playfair Display, serif" fz={{ base: 'sm', sm: 'md' }}>
                {client.entriesThisWeek}/7
              </Text>
            </Stack>
            {client.avgMoodWeek && (
              <Stack gap={0}>
                <Text fz={10} c="sage.6" tt="uppercase" lts={1}>
                  Mood
                </Text>
                <Text c="sage.7" ff="Playfair Display, serif" fz={{ base: 'sm', sm: 'md' }}>
                  {client.avgMoodWeek}/5
                </Text>
              </Stack>
            )}
            {client.avgSleepWeek && (
              <Stack gap={0}>
                <Text fz={10} c="sage.6" tt="uppercase" lts={1}>
                  Sleep
                </Text>
                <Text c="sage.7" ff="Playfair Display, serif" fz={{ base: 'sm', sm: 'md' }}>
                  {client.avgSleepWeek}h
                </Text>
              </Stack>
            )}
            <Stack gap={0}>
              <Text fz={10} c="sage.6" tt="uppercase" lts={1}>
                Entries
              </Text>
              <Text c="sage.7" ff="Playfair Display, serif" fz={{ base: 'sm', sm: 'md' }}>
                {client.totalEntries}
              </Text>
            </Stack>
          </Group>
        </Stack>
      </Card>
    </Wrapper>
  );
}
