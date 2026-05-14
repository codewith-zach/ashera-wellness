'use client';

import { Chip, Group } from '@mantine/core';

interface Props {
  options: readonly string[] | string[];
  value: string[];
  onChange: (next: string[]) => void;
  color?: string;
}

export function ChipMulti({
  options,
  value,
  onChange,
  color = 'sage.5',
}: Props) {
  return (
    <Chip.Group multiple value={value} onChange={(v) => onChange(v as string[])}>
      <Group gap={8}>
        {options.map((o) => (
          <Chip key={o} value={o} radius="xl" color={color} size="md">
            {o}
          </Chip>
        ))}
      </Group>
    </Chip.Group>
  );
}
