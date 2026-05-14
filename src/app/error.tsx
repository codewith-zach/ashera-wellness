'use client';

import { Box, Button, Center, Container, Stack, Text, Title } from '@mantine/core';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Box
      mih="100vh"
      style={{
        background:
          'radial-gradient(circle at 30% 30%, rgba(212,130,122,0.10), transparent 40%), #F5F0EA',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container size="sm">
        <Center>
          <Stack align="center" gap="lg" ta="center">
            <span style={{ fontSize: 56 }}>🌿</span>
            <Title
              order={1}
              ff="Playfair Display, serif"
              c="sage.7"
              fw={500}
              fz={36}
            >
              Something didn't land quite right
            </Title>
            <Text c="sage.7" fs="italic" ff="Playfair Display, serif">
              Rest is healing too — and so is trying again.
            </Text>
            <Text c="sage.6" fz="sm" maw={400}>
              An unexpected error occurred. Your data is safe — this is a
              temporary wobble.
            </Text>
            <Button
              onClick={reset}
              radius="xl"
              size="lg"
              variant="gradient"
              gradient={{ from: 'sage.5', to: 'sage.7', deg: 135 }}
            >
              Try again
            </Button>
          </Stack>
        </Center>
      </Container>
    </Box>
  );
}
