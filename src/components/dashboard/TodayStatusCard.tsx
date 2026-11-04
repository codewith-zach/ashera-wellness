'use client';

import { Button, Card, Flex, Group, Stack, Text, Title } from '@mantine/core';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import type { DailyEntryView } from '@/lib/entry-mapper';
import { MOOD_OPTIONS } from '@/lib/data/options';
import { HydrationRing } from './HydrationRing';

interface Props {
  entry: DailyEntryView | null;
}

export function TodayStatusCard({ entry }: Props) {
  const reduced = useReducedMotion();
  if (!entry) {
    return (
      <Card
        radius="lg"
        shadow="md"
        p={{ base: 'lg', sm: 'xl' }}
        style={{
          background:
            'linear-gradient(140deg, rgba(122,158,126,0.18), rgba(184,174,212,0.18))',
          border: '1px solid rgba(122,158,126,0.20)',
        }}
      >
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          justify="space-between"
          align={{ base: 'stretch', sm: 'center' }}
          gap="md"
          wrap="wrap"
        >
          <Stack gap={6} maw={{ base: '100%', sm: 420 }}>
            <Title
              order={3}
              ff="Playfair Display, serif"
              c="sage.7"
              fw={500}
              fz={{ base: 20, sm: 22 }}
              lh={1.2}
            >
              Haven&rsquo;t logged yet today
            </Title>
            <Text c="sage.8" fz={{ base: 'sm', sm: 'md' }}>
              Your body is waiting to be heard 🌿 — a few quiet minutes is all it
              takes.
            </Text>
          </Stack>
          <motion.div
            animate={
              reduced
                ? undefined
                : {
                    boxShadow: [
                      '0 0 0 0 rgba(122,158,126,0.5)',
                      '0 0 0 14px rgba(122,158,126,0)',
                    ],
                  }
            }
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            style={{ borderRadius: 9999, alignSelf: 'center', display: 'inline-flex' }}
          >
            <Button
              component={Link}
              href="/journal"
              size="lg"
              radius="xl"
              variant="gradient"
              gradient={{ from: 'sage.5', to: 'sage.7', deg: 135 }}
            >
              Begin today&rsquo;s entry
            </Button>
          </motion.div>
        </Flex>
      </Card>
    );
  }

  const moodLabel = MOOD_OPTIONS.find((m) => m.value === entry.mood);

  return (
    <Card
      radius="lg"
      shadow="md"
      p={{ base: 'lg', sm: 'xl' }}
      className="petal-card"
    >
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        justify="space-between"
        align={{ base: 'center', sm: 'flex-start' }}
        gap="lg"
        wrap="wrap"
      >
        <Stack gap="md" maw={{ base: '100%', sm: 420 }} ta={{ base: 'center', sm: 'left' }}>
          <Stack gap={2}>
            <Text fz="xs" c="sage.6" tt="uppercase" lts={2}>
              Today&rsquo;s check-in
            </Text>
            <Title
              order={3}
              ff="Playfair Display, serif"
              c="sage.7"
              fw={500}
              fz={{ base: 20, sm: 22 }}
              lh={1.2}
            >
              You showed up for yourself ✨
            </Title>
          </Stack>
          <Group gap="xl" wrap="wrap" justify="flex-start">
            {moodLabel && (
              <Stack gap={0} align="flex-start">
                <Text fz="xs" c="sage.6" tt="uppercase" lts={2}>
                  Mood
                </Text>
                <Group gap={6} align="baseline" wrap="nowrap">
                  <span style={{ fontSize: 26 }}>{moodLabel.emoji}</span>
                  <Text c="sage.7" fz="lg" ff="Playfair Display, serif">
                    {moodLabel.label}
                  </Text>
                </Group>
              </Stack>
            )}
            {entry.energyLevel != null && (
              <Stack gap={0} align="flex-start">
                <Text fz="xs" c="sage.6" tt="uppercase" lts={2}>
                  Energy
                </Text>
                <Text c="sage.7" fz="lg" ff="Playfair Display, serif">
                  {entry.energyLevel}/5
                </Text>
              </Stack>
            )}
            {entry.sleepHours != null && (
              <Stack gap={0} align="flex-start">
                <Text fz="xs" c="sage.6" tt="uppercase" lts={2}>
                  Sleep
                </Text>
                <Text c="sage.7" fz="lg" ff="Playfair Display, serif">
                  {entry.sleepHours}h
                </Text>
              </Stack>
            )}
          </Group>
          <Button
            component={Link}
            href="/journal"
            variant="subtle"
            color="sage"
            w={{ base: '100%', sm: 'fit-content' }}
          >
            Edit today&rsquo;s entry
          </Button>
        </Stack>
        <HydrationRing cups={entry.waterCups ?? 0} />
      </Flex>
    </Card>
  );
}
