'use client';

import { Slider, Stack, Text } from '@mantine/core';

interface Props {
  value: number | null | undefined;
  onChange: (n: number) => void;
  label: string;
  trackKind?: 'energy' | 'stress';
  helper?: string;
}

const ENERGY_LABEL = ['', 'Low', 'Soft', 'Medium ⚡', 'High', 'Bright'];
const STRESS_LABEL = ['', 'Calm', 'Settled', 'Tight', 'Burdened', 'Overwhelmed'];

export function StressSlider({
  value,
  onChange,
  label,
  trackKind = 'stress',
  helper,
}: Props) {
  const colorByValue = (v: number): string => {
    if (trackKind === 'stress') {
      if (v <= 2) return 'sage';
      if (v <= 3) return 'gold';
      return 'rose';
    }
    return 'sage';
  };
  const v = value ?? 0;
  const labels = trackKind === 'stress' ? STRESS_LABEL : ENERGY_LABEL;
  return (
    <Stack gap={6}>
      <Text c="sage.8" fz="sm" fw={500}>
        {label}
      </Text>
      <Slider
        min={1}
        max={5}
        step={1}
        value={v}
        onChange={onChange}
        color={colorByValue(v || 1)}
        marks={[
          { value: 1, label: '1' },
          { value: 3, label: '3' },
          { value: 5, label: '5' },
        ]}
        thumbSize={22}
        size="lg"
        styles={{
          markLabel: { color: '#5f8b66', fontSize: 11 },
        }}
      />
      <Text c="sage.7" fz="sm" fs="italic" mih={20}>
        {v ? labels[v] : helper ?? 'Tap to set'}
      </Text>
    </Stack>
  );
}
