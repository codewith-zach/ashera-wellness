'use client';

import { Group, Stack, Text, Tooltip } from '@mantine/core';
import { lastNDates, todayISO } from '@/lib/utils/date';
import dayjs from 'dayjs';

interface Props {
  loggedDates: Set<string>;
  days?: number;
}

export function CheckInHeatmap({ loggedDates, days = 30 }: Props) {
  const dates = lastNDates(days);
  const today = todayISO();
  return (
    <Stack gap={8}>
      <Group justify="space-between" wrap="wrap" gap="xs">
        <Text fz="sm" c="sage.7" fw={500}>
          Last {days} days
        </Text>
        <Group gap="md" wrap="wrap">
          <LegendDot color="rgba(221,233,222,0.7)" label="Missed" />
          <LegendDot color="#7A9E7E" label="Logged" />
          <LegendDot color="#C9A96E" label="Today" border />
        </Group>
      </Group>
      <Group gap={4} wrap="wrap">
        {dates.map((d) => {
          const logged = loggedDates.has(d);
          const isToday = d === today;
          return (
            <Tooltip
              key={d}
              label={`${dayjs(d).format('ddd, D MMM')}${logged ? ' • logged' : ''}`}
              position="top"
              withArrow
              color="sage.7"
            >
              <div
                style={{
                  width: 'clamp(14px, 3.2vw, 18px)',
                  height: 'clamp(14px, 3.2vw, 18px)',
                  borderRadius: 4,
                  background: logged ? '#7A9E7E' : 'rgba(221,233,222,0.55)',
                  border: isToday ? '2px solid #C9A96E' : 'none',
                  boxShadow: logged ? '0 1px 4px rgba(122,158,126,0.25)' : 'none',
                  transition: 'transform 0.15s ease',
                  flex: '0 0 auto',
                }}
              />
            </Tooltip>
          );
        })}
      </Group>
    </Stack>
  );
}

function LegendDot({
  color,
  label,
  border = false,
}: {
  color: string;
  label: string;
  border?: boolean;
}) {
  return (
    <Group gap={4}>
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: 3,
          background: border ? 'transparent' : color,
          border: border ? `2px solid ${color}` : 'none',
        }}
      />
      <Text fz="xs" c="sage.6">
        {label}
      </Text>
    </Group>
  );
}
