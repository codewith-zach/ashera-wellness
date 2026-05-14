'use client';

import { Group, Slider, Stack, Text } from '@mantine/core';

interface Props {
  value: number | null | undefined;
  onChange: (hours: number) => void;
}

export function SleepSlider({ value, onChange }: Props) {
  const v = value ?? 0;
  const moonOpacity = Math.min(1, v / 9);
  return (
    <Stack gap="xs">
      <Group justify="space-between" align="flex-end">
        <Text c="sage.8" fz="sm" fw={500}>
          Hours slept
        </Text>
        <Text c="sage.7" fz="lg" fw={600} ff="Playfair Display, serif">
          {v.toFixed(1)}h
        </Text>
      </Group>
      <Group align="center" gap="md" wrap="nowrap">
        <span
          style={{
            fontSize: 32,
            opacity: 0.25 + moonOpacity * 0.75,
            transition: 'opacity 0.3s ease',
          }}
        >
          🌙
        </span>
        <Slider
          flex={1}
          min={0}
          max={12}
          step={0.5}
          value={v}
          onChange={onChange}
          color="lavender.5"
          thumbSize={22}
          size="lg"
          marks={[
            { value: 0, label: '0' },
            { value: 6, label: '6' },
            { value: 8, label: '8' },
            { value: 12, label: '12' },
          ]}
          styles={{ markLabel: { color: '#615895', fontSize: 11 } }}
        />
      </Group>
    </Stack>
  );
}
