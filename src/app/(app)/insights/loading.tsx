import { Box, Container, SimpleGrid, Skeleton, Stack } from '@mantine/core';

export default function InsightsLoading() {
  return (
    <Container size="lg" py="lg">
      <Stack gap="xl">
        <Box>
          <Skeleton height={14} width={80} mb={8} radius="sm" />
          <Skeleton height={44} width={440} radius="md" />
        </Box>
        <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }} spacing="md">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={90} radius="lg" />
          ))}
        </SimpleGrid>
        <Skeleton height={80} radius="lg" />
        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={280} radius="lg" />
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
