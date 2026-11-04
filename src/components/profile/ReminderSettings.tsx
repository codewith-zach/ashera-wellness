'use client';

import { Card, Group, NumberInput, Stack, Switch, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';

interface Props {
  initialEnabled: boolean;
  initialHour: number | null;
  initialTimezone: string | null;
}

export function ReminderSettings({
  initialEnabled,
  initialHour,
  initialTimezone,
}: Props) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [hour, setHour] = useState<number>(initialHour ?? 9);
  const [saving, setSaving] = useState(false);
  const [timezone, setTimezone] = useState(
    initialTimezone ?? 'UTC',
  );

  async function save(next: { enabled: boolean; hour: number }) {
    setSaving(true);
    // Capture the browser timezone on every save so it stays current.
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const res = await fetch('/api/users/reminders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...next, timezone: tz }),
    });
    setSaving(false);
    if (!res.ok) {
      notifications.show({
        color: 'rose',
        title: 'Could not save',
        message: 'Please try again.',
      });
      return;
    }
    setTimezone(tz);
    notifications.show({
      color: 'sage',
      title: 'Updated 🌿',
      message: next.enabled
        ? `We'll send a gentle nudge around ${next.hour}:00 (${tz}).`
        : 'Daily reminders are paused.',
    });
  }

  return (
    <Card radius="lg" p="lg" className="petal-card">
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <Stack gap={2} maw={360}>
            <Text c="sage.7" ff="Playfair Display, serif" fz="lg" fw={500}>
              Daily nudge
            </Text>
            <Text fz="sm" c="sage.7">
              A short, warm reminder if you haven't logged that day. Skipped automatically
              once you log.
            </Text>
          </Stack>
          <Switch
            checked={enabled}
            disabled={saving}
            color="sage.5"
            onChange={(e) => {
              const next = e.currentTarget.checked;
              setEnabled(next);
              void save({ enabled: next, hour });
            }}
          />
        </Group>
        <NumberInput
          label="Send at hour (your time)"
          description={`Reminder timezone: ${timezone}`}
          min={0}
          max={23}
          value={hour}
          disabled={!enabled || saving}
          onChange={(v) => {
            const next = typeof v === 'number' ? v : 9;
            setHour(next);
            void save({ enabled, hour: next });
          }}
          w={220}
        />
      </Stack>
    </Card>
  );
}
