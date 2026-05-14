'use client';

import { Box, Group, Stack, Text, Tooltip } from '@mantine/core';
import { motion, useReducedMotion } from 'framer-motion';
import dayjs from 'dayjs';

interface Entry {
  date: string;
  cyclePhase: string | null;
}

interface Props {
  entries: Entry[];
  days?: number;
}

const PHASE_COLORS: Record<string, string> = {
  Period: '#D4827A',
  Follicular: '#7A9E7E',
  Ovulation: '#C9A96E',
  Luteal: '#B8AED4',
};

const PHASE_EMOJI: Record<string, string> = {
  Period: '🌹',
  Follicular: '🌱',
  Ovulation: '🌟',
  Luteal: '🌙',
};

export function HormonePhaseRing({ entries, days = 30 }: Props) {
  const reduced = useReducedMotion();
  const today = dayjs();
  const dateMap = new Map(entries.map((e) => [e.date, e.cyclePhase]));

  const cells = Array.from({ length: days }, (_, i) => {
    const date = today.subtract(days - 1 - i, 'day').format('YYYY-MM-DD');
    const phase = dateMap.get(date) ?? null;
    return { date, phase };
  });

  // Phase frequency summary
  const counts: Record<string, number> = {};
  for (const c of cells) {
    if (c.phase) counts[c.phase] = (counts[c.phase] ?? 0) + 1;
  }
  const tracked = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <Stack gap="md">
      {/* Calendar grid */}
      <Group gap={4} wrap="wrap">
        {cells.map(({ date, phase }) => {
          const color = phase ? PHASE_COLORS[phase] ?? '#dde9de' : 'rgba(221,233,222,0.55)';
          const isToday = date === today.format('YYYY-MM-DD');
          return (
            <Tooltip
              key={date}
              label={`${dayjs(date).format('D MMM')}${phase ? ` · ${phase}` : ''}`}
              position="top"
              withArrow
              color="sage.7"
            >
              <motion.div
                initial={reduced ? undefined : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.01 * cells.indexOf({ date, phase } as (typeof cells)[0]), duration: 0.25 }}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  background: color,
                  border: isToday ? '2px solid #4A7050' : 'none',
                  opacity: phase ? 1 : 0.55,
                }}
              />
            </Tooltip>
          );
        })}
      </Group>

      {/* Phase legend */}
      <Group gap="lg" wrap="wrap">
        {(['Period', 'Follicular', 'Ovulation', 'Luteal'] as const).map((phase) => (
          <Group key={phase} gap={6}>
            <Box
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: PHASE_COLORS[phase],
              }}
            />
            <Text fz="xs" c="sage.6">
              {PHASE_EMOJI[phase]} {phase}
              {counts[phase] ? ` · ${counts[phase]}d` : ''}
            </Text>
          </Group>
        ))}
      </Group>

      {tracked === 0 && (
        <Text fz="sm" c="sage.6" fs="italic">
          Enable cycle tracking in the journal to see your phase pattern here.
        </Text>
      )}
    </Stack>
  );
}
