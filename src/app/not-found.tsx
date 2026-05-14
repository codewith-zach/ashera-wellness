import { Box, Button, Center, Container, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Box
      mih="100vh"
      style={{
        background:
          'radial-gradient(circle at 20% 20%, rgba(232,196,184,0.18), transparent 40%), radial-gradient(circle at 80% 80%, rgba(122,158,126,0.14), transparent 40%), #F5F0EA',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container size="sm">
        <Center>
          <Stack align="center" gap="lg" ta="center">
            <span style={{ fontSize: 64 }}>✿</span>
            <Title
              order={1}
              ff="Playfair Display, serif"
              c="sage.7"
              fw={500}
              fz={40}
            >
              This page wandered off
            </Title>
            <Text c="sage.7" fs="italic" ff="Playfair Display, serif" fz="lg">
              "Not all who wander are lost — but this page might be."
            </Text>
            <Text c="sage.7" maw={380}>
              The link you followed doesn't lead anywhere right now. Your journal
              is still here, waiting patiently.
            </Text>
            <Button
              component={Link}
              href="/dashboard"
              radius="xl"
              size="lg"
              variant="gradient"
              gradient={{ from: 'sage.5', to: 'sage.7', deg: 135 }}
            >
              Back to the dashboard
            </Button>
          </Stack>
        </Center>
      </Container>
    </Box>
  );
}
