'use client';

import { Group, Select, Stack, Text, SegmentedControl } from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  months: { value: string; label: string }[];
  month: string;
  mood: string;
}

export function HistoryFilters({ months, month, mood }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const update = (key: string, value: string | null) => {
    const sp = new URLSearchParams(params);
    if (value && value !== 'all') sp.set(key, value);
    else sp.delete(key);
    sp.delete('page');
    const q = sp.toString();
    router.push(q ? `?${q}` : '?', { scroll: false });
  };

  return (
    <Stack gap="sm">
      <Select
        size="sm"
        radius="xl"
        label="Month"
        placeholder="All months"
        clearable
        value={month === 'all' ? null : month}
        data={months}
        onChange={(v) => update('month', v)}
        w={{ base: '100%', xs: 200 }}
      />
      <div>
        <Text fz="sm" c="sage.8" fw={500} mb={4}>
          Mood
        </Text>
        <div style={{ overflowX: 'auto' }}>
          <SegmentedControl
            size="xs"
            value={mood}
            onChange={(v) => update('mood', v)}
            color="sage"
            radius="xl"
            data={[
              { label: 'All', value: 'all' },
              { label: '😞', value: '1' },
              { label: '😔', value: '2' },
              { label: '😐', value: '3' },
              { label: '😊', value: '4' },
              { label: '🌟', value: '5' },
            ]}
          />
        </div>
      </div>
    </Stack>
  );
}
