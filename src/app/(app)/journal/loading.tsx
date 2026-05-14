import { Container, Skeleton, Stack } from '@mantine/core';

export default function JournalLoading() {
  return (
    <Container size="md" px="xs" py="lg">
      <Stack gap="lg">
        <Stack gap={4}>
          <Skeleton height={14} width={60} radius="sm" />
          <Skeleton height={44} width={320} radius="md" />
          <Skeleton height={20} width={260} radius="sm" />
        </Stack>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} height={160} radius="lg" />
        ))}
      </Stack>
    </Container>
  );
}
