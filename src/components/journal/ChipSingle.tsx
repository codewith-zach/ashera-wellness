'use client';

import { Chip, Group } from '@mantine/core';

interface Props {
  options: readonly string[] | string[];
  value: string | null | undefined;
  onChange: (next: string | null) => void;
  color?: string;
  allowDeselect?: boolean;
}

export function ChipSingle({
  options,
  value,
  onChange,
  color = 'sage.5',
  allowDeselect = true,
}: Props) {
  return (
    <Chip.Group
      multiple={false}
      value={value ?? ''}
      onChange={(v) => onChange((v as string) || (allowDeselect ? null : value ?? null))}
    >
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
