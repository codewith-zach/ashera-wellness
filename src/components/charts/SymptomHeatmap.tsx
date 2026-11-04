'use client';

import { Group, Stack, Text, Tooltip } from '@mantine/core';
import dayjs from 'dayjs';
import { lastNDates } from '@/lib/utils/date';

interface Item {
  date: string;
  count: number;
}

interface Props {
  data: Item[];
  days?: number;
}

function colorForCount(count: number): string {
  if (count === 0) return 'var(--ashera-empty)';
  if (count === 1) return 'rgba(232,196,184,0.45)';
  if (count === 2) return 'rgba(212,130,122,0.55)';
  if (count === 3) return 'rgba(212,130,122,0.75)';
  return 'rgba(165,84,80,0.85)';
}

export function SymptomHeatmap({ data, days = 30 }: Props) {
  const dates = lastNDates(days);
  const counts = new Map(data.map((d) => [d.date, d.count]));
  return (
    <Stack gap={8}>
      <Group gap={4} wrap="wrap">
        {dates.map((d) => {
          const count = counts.get(d) ?? 0;
          return (
            <Tooltip
              key={d}
              label={`${dayjs(d).format('ddd, D MMM')} · ${count} symptom${count === 1 ? '' : 's'}`}
              position="top"
              withArrow
              color="rose.7"
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  background: colorForCount(count),
                }}
              />
            </Tooltip>
          );
        })}
      </Group>
      <Group gap="xs">
        <Text fz="xs" c="sage.6">
          fewer
        </Text>
        {[0, 1, 2, 3, 4].map((c) => (
          <div
            key={c}
            style={{
              width: 14,
              height: 14,
              borderRadius: 3,
              background: colorForCount(c),
            }}
          />
        ))}
        <Text fz="xs" c="sage.6">
          more
        </Text>
      </Group>
    </Stack>
  );
}
