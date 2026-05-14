import { Box, Container, SimpleGrid, Skeleton, Stack } from '@mantine/core';

export default function DashboardLoading() {
  return (
    <Container size="lg" py="lg">
      <Stack gap="xl">
        <Box>
          <Skeleton height={14} width={120} mb={8} radius="sm" />
          <Skeleton height={44} width={340} mb={8} radius="md" />
          <Skeleton height={20} width={280} radius="sm" />
        </Box>
        <SimpleGrid cols={{ base: 2, sm: 3, lg: 5 }} spacing="md">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height={90} radius="lg" />
          ))}
        </SimpleGrid>
        <Skeleton height={100} radius="lg" />
        <Skeleton height={120} radius="lg" />
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          <Skeleton height={240} radius="lg" />
          <Skeleton height={240} radius="lg" />
          <Skeleton height={220} radius="lg" />
        </SimpleGrid>
        <Skeleton height={160} radius="lg" />
      </Stack>
    </Container>
  );
}
