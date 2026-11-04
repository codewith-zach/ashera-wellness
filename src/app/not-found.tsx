import { Box, Center, Container, Stack, Text, Title } from '@mantine/core';
import { LinkButton } from '@/components/ui/links';
import { AmbientPetals } from '@/components/auth/AmbientPetals';

export default function NotFound() {
  return (
    <Box
      mih="100vh"
      className="cream-bg"
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <AmbientPetals count={8} />
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
            <LinkButton
              href="/dashboard"
              radius="xl"
              size="lg"
              variant="gradient"
              gradient={{ from: 'sage.5', to: 'sage.7', deg: 135 }}
            >
              Back to the dashboard
            </LinkButton>
          </Stack>
        </Center>
      </Container>
    </Box>
  );
}
