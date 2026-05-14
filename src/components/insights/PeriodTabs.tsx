'use client';

import { SegmentedControl } from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Period } from '@/lib/utils/period';

interface Props {
  value: Period;
}

export function PeriodTabs({ value }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const set = (next: string) => {
    const sp = new URLSearchParams(params);
    sp.set('period', next);
    router.push(`?${sp.toString()}`, { scroll: false });
  };

  return (
    <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
      <SegmentedControl
        size="xs"
        value={value}
        onChange={set}
        color="sage"
        data={[
          { label: '7d', value: '7' },
          { label: '14d', value: '14' },
          { label: '30d', value: '30' },
          { label: '90d', value: '90' },
          { label: 'All', value: 'all' },
        ]}
        radius="xl"
        style={{ flexShrink: 0 }}
      />
    </div>
  );
}
