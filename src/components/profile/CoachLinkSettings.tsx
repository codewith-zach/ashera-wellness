'use client';

import {
  Button,
  Card,
  Group,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';

interface Props {
  coach: { displayName: string | null; email: string } | null;
}

export function CoachLinkSettings({ coach }: Props) {
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);

  async function save(nextEmail: string | null) {
    setSaving(true);
    const res = await fetch('/api/users/coach', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coachEmail: nextEmail }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setSaving(false);
    if (!res.ok) {
      notifications.show({
        color: 'rose',
        title: 'Could not update coach link',
        message: data.error ?? 'Please try again.',
      });
      return;
    }
    notifications.show({
      color: 'sage',
      title: nextEmail ? 'Linked 🌿' : 'Unlinked',
      message: nextEmail
        ? 'Your coach can now see your journal.'
        : 'Your coach no longer has access.',
    });
    setEmail('');
    window.location.reload();
  }

  return (
    <Card radius="lg" p="lg" className="petal-card">
      <Stack gap="md">
        <Stack gap={2}>
          <Text c="sage.7" ff="Playfair Display, serif" fz="lg" fw={500}>
            Your coach
          </Text>
          <Text fz="sm" c="sage.7">
            {coach
              ? `Linked with ${coach.displayName ?? coach.email} (${coach.email}). They can see your entries.`
              : 'Link with a coach so they can follow your journey — enter their account email.'}
          </Text>
        </Stack>
        {coach ? (
          <Button
            variant="light"
            color="rose"
            radius="xl"
            size="sm"
            w={140}
            loading={saving}
            onClick={() => void save(null)}
          >
            Unlink coach
          </Button>
        ) : (
          <Group gap="sm">
            <TextInput
              placeholder="coach@example.com"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              style={{ flex: 1 }}
            />
            <Button
              variant="gradient"
              gradient={{ from: 'sage.5', to: 'sage.7', deg: 135 }}
              radius="xl"
              loading={saving}
              disabled={!email.includes('@')}
              onClick={() => void save(email)}
            >
              Link
            </Button>
          </Group>
        )}
      </Stack>
    </Card>
  );
}
