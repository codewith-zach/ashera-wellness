'use client';

import { Badge, Skeleton } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';

interface StreakResp {
  current: number;
  longest: number;
  thisWeek: number;
  weeklyGoal: number;
  totalEntries: number;
}

export function StreakBadge() {
  const compact = useMediaQuery('(max-width: 36em)');
  const { data, isLoading } = useQuery<StreakResp>({
    queryKey: ['streak'],
    queryFn: () => fetch('/api/insights/streak').then((r) => r.json()),
  });

  if (isLoading)
    return <Skeleton height={26} width={compact ? 56 : 84} radius="xl" />;

  const days = data?.current ?? 0;
  const label = compact ? `${days}d` : `${days} day${days === 1 ? '' : 's'}`;

  return (
    <Badge
      size={compact ? 'md' : 'lg'}
      radius="xl"
      variant="gradient"
      gradient={{ from: 'gold.5', to: 'gold.7', deg: 135 }}
      leftSection={<span className="flame-icon">🔥</span>}
      title={`Current streak — ${days} day${days === 1 ? '' : 's'}`}
      aria-label={`Current streak ${days} days`}
      style={{ flexShrink: 0 }}
    >
      {label}
    </Badge>
  );
}
