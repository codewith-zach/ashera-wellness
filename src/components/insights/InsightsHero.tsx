'use client';

import { Card, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { motion } from 'framer-motion';
import { CountUp } from '@/components/charts/CountUp';
import { staggerContainer, staggerItem } from '@/components/animations/variants';

interface Summary {
  totalEntries: number;
  avgMood: number | null;
  avgSleep: number | null;
  avgWater: number | null;
  longestStreak: number;
  currentStreak: number;
  topSymptom: string | null;
  topSelfCare: string | null;
}

interface Stat {
  label: string;
  shortLabel: string;
  value: number;
  decimals?: number;
  suffix?: string;
  emoji?: string;
}

export function InsightsHero({ summary }: { summary: Summary }) {
  const stats: Stat[] = [
    { label: 'Current streak', shortLabel: 'Streak', value: summary.currentStreak, suffix: 'd', emoji: '🔥' },
    { label: 'Longest streak', shortLabel: 'Longest', value: summary.longestStreak, suffix: 'd' },
    { label: 'Total entries', shortLabel: 'Entries', value: summary.totalEntries },
    { label: 'Avg mood', shortLabel: 'Mood', value: summary.avgMood ?? 0, decimals: 1, suffix: '/5' },
    { label: 'Avg sleep', shortLabel: 'Sleep', value: summary.avgSleep ?? 0, decimals: 1, suffix: 'h', emoji: '🌙' },
    { label: 'Avg water', shortLabel: 'Water', value: summary.avgWater ?? 0, decimals: 1, suffix: 'c', emoji: '💧' },
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <SimpleGrid cols={{ base: 3, xs: 3, sm: 6 }} spacing={{ base: 'xs', sm: 'md' }}>
        {stats.map((s) => (
          <motion.div key={s.label} variants={staggerItem}>
            <Card
              radius="lg"
              shadow="sm"
              p={{ base: 'xs', sm: 'md' }}
              className="petal-card"
            >
              <Stack gap={2}>
                {/* Short label on mobile */}
                <Text fz={10} c="sage.6" tt="uppercase" lts={1} lh={1.3} lineClamp={1} hiddenFrom="sm">
                  {s.shortLabel}
                </Text>
                {/* Full label on desktop */}
                <Text fz={11} c="sage.6" tt="uppercase" lts={2} lh={1.3} lineClamp={1} visibleFrom="sm">
                  {s.label}
                </Text>
                <Group gap={4} align="baseline" wrap="nowrap">
                  <CountUp
                    value={s.value}
                    decimals={s.decimals}
                    suffix={s.suffix}
                    fz={{ base: 20, sm: 24 }}
                    fw={500}
                    ff="Playfair Display, serif"
                    c="sage.7"
                    lh={1.1}
                  />
                  {s.emoji && <span style={{ fontSize: 14 }}>{s.emoji}</span>}
                </Group>
              </Stack>
            </Card>
          </motion.div>
        ))}
      </SimpleGrid>
    </motion.div>
  );
}
