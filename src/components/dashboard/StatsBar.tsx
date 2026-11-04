'use client';

import { Card, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/components/animations/variants';

interface Stat {
  label: string;
  shortLabel?: string;
  value: string | number;
  hint?: string;
  emoji?: string;
}

export function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <SimpleGrid
        cols={{ base: 2, xs: 3, sm: stats.length === 5 ? 5 : 4 }}
        spacing={{ base: 'xs', sm: 'md' }}
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={staggerItem}>
            <Card
              radius="lg"
              shadow="sm"
              p={{ base: 'sm', sm: 'md' }}
              className="petal-card"
            >
              <Stack gap={2}>
                <Text
                  fz={{ base: 10, sm: 11 }}
                  c="sage.6"
                  tt="uppercase"
                  lts={{ base: 1, sm: 2 }}
                  lh={1.3}
                  lineClamp={1}
                  visibleFrom="xs"
                >
                  {s.label}
                </Text>
                <Text
                  fz={10}
                  c="sage.6"
                  tt="uppercase"
                  lts={1}
                  lh={1.3}
                  lineClamp={1}
                  hiddenFrom="xs"
                >
                  {s.shortLabel ?? s.label}
                </Text>
                <Group gap={4} align="baseline" wrap="nowrap">
                  <Text
                    fz={{ base: 22, sm: 26 }}
                    fw={500}
                    ff="Playfair Display, serif"
                    c="sage.7"
                    lh={1.1}
                  >
                    {s.value}
                  </Text>
                  {s.emoji && (
                    <span style={{ fontSize: 16, lineHeight: 1 }}>{s.emoji}</span>
                  )}
                </Group>
                {s.hint && (
                  <Text fz={{ base: 10, sm: 11 }} c="sage.6" lineClamp={1}>
                    {s.hint}
                  </Text>
                )}
              </Stack>
            </Card>
          </motion.div>
        ))}
      </SimpleGrid>
    </motion.div>
  );
}
