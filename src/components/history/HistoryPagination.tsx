'use client';

import { Center, Pagination } from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';

export function HistoryPagination({
  total,
  page,
  pageSize,
}: {
  total: number;
  page: number;
  pageSize: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  return (
    <Center>
      <Pagination
        value={page}
        total={pages}
        color="sage"
        radius="xl"
        onChange={(p) => {
          const sp = new URLSearchParams(params);
          if (p > 1) sp.set('page', String(p));
          else sp.delete('page');
          const q = sp.toString();
          router.push(q ? `?${q}` : '?', { scroll: false });
        }}
      />
    </Center>
  );
}
