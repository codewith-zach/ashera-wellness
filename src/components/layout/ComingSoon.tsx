import { Card, Container, Stack, Text, Title } from '@mantine/core';

interface Props {
  title: string;
  body: string;
  emoji?: string;
}

export function ComingSoon({ title, body, emoji = '🌿' }: Props) {
  return (
    <Container size="md" py="xl">
      <Card
        radius="lg"
        shadow="sm"
        p="xl"
        style={{ background: 'rgba(255,255,255,0.85)' }}
      >
        <Stack gap="md" align="center" ta="center">
          <span style={{ fontSize: 48 }}>{emoji}</span>
          <Title order={2} ff="Playfair Display, serif" c="sage.7" fw={500}>
            {title}
          </Title>
          <Text c="sage.7" maw={520}>
            {body}
          </Text>
        </Stack>
      </Card>
    </Container>
  );
}
