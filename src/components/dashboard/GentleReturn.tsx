'use client';

import { Card, Group, Text } from '@mantine/core';

/**
 * Shown when the user's previous streak broke (i.e., they had a current streak,
 * skipped one or more days, then came back). PRD §6.8 — "Rest is healing too."
 */
export function GentleReturn({ priorBest }: { priorBest: number }) {
  return (
    <Card
      radius="lg"
      p="md"
      style={{
        background: 'linear-gradient(120deg, rgba(232,196,184,0.20), rgba(184,174,212,0.18))',
        border: '1px solid rgba(232,196,184,0.30)',
      }}
    >
      <Group gap={10} align="center">
        <span style={{ fontSize: 22 }}>🌿</span>
        <div>
          <Text fz="sm" c="sage.7" ff="Playfair Display, serif" fw={500}>
            Welcome back, love.
          </Text>
          <Text fz="xs" c="sage.7">
            Rest is healing too. Your last run reached {priorBest} day{priorBest === 1 ? '' : 's'} —
            today, we begin again with grace.
          </Text>
        </div>
      </Group>
    </Card>
  );
}
