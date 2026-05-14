'use client';

import { Group, Paper, Text } from '@mantine/core';
import { Sparkles } from 'lucide-react';

interface Props {
  text: string | null;
}

export function InsightCallout({ text }: Props) {
  if (!text) return null;
  return (
    <Paper
      p="md"
      radius="lg"
      style={{
        background: 'linear-gradient(135deg, rgba(122,158,126,0.10), rgba(184,174,212,0.12))',
        border: '1px solid rgba(122,158,126,0.16)',
      }}
    >
      <Group gap={10} wrap="nowrap" align="flex-start">
        <Sparkles size={18} color="#7A9E7E" style={{ marginTop: 3, flexShrink: 0 }} />
        <Text c="sage.8" fs="italic" ff="Playfair Display, serif">
          {text}
        </Text>
      </Group>
    </Paper>
  );
}
