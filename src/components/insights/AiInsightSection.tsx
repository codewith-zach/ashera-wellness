'use client';

import { Group, Loader, Paper, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { Sparkles } from 'lucide-react';

type Section = 'mood' | 'sleep' | 'symptoms' | 'selfCare' | 'overall';

interface AiCallouts {
  mood: string;
  sleep: string;
  symptoms: string;
  selfCare: string;
  overall: string;
}

function useAiCallouts(period: string) {
  return useQuery<AiCallouts>({
    queryKey: ['ai-insights', period],
    queryFn: () =>
      fetch(`/api/insights/ai?period=${period}`).then((r) => r.json()),
    staleTime: 60 * 60 * 1000, // 1 hour — refreshes daily on server via cache
    retry: 1,
  });
}

interface Props {
  section: Section;
  period: string;
}

export function AiInsightCallout({ section, period }: Props) {
  const { data, isLoading, isError } = useAiCallouts(period);

  if (isLoading) {
    return (
      <Paper
        p="md"
        radius="lg"
        style={{
          background:
            'linear-gradient(135deg, rgba(122,158,126,0.08), rgba(184,174,212,0.10))',
          border: '1px solid rgba(122,158,126,0.14)',
        }}
      >
        <Group gap={8} align="center">
          <Loader size="xs" color="sage" />
          <Text fz="xs" c="sage.6">
            Gathering your insights…
          </Text>
        </Group>
      </Paper>
    );
  }

  const text = data?.[section];
  if (isError || !text) return null;

  return (
    <Paper
      p="md"
      radius="lg"
      style={{
        background:
          'linear-gradient(135deg, rgba(122,158,126,0.10), rgba(184,174,212,0.12))',
        border: '1px solid rgba(122,158,126,0.16)',
      }}
    >
      <Group gap={10} wrap="nowrap" align="flex-start">
        <Sparkles
          size={18}
          color="#7A9E7E"
          style={{ marginTop: 3, flexShrink: 0 }}
        />
        <Text c="sage.8" fs="italic" ff="Playfair Display, serif">
          {text}
        </Text>
      </Group>
    </Paper>
  );
}

/** Overall summary banner shown at the top of the insights page */
export function AiOverallCallout({ period }: { period: string }) {
  const { data, isLoading, isError } = useAiCallouts(period);

  if (isLoading) {
    return (
      <Paper
        p="lg"
        radius="lg"
        style={{
          background:
            'linear-gradient(135deg, rgba(184,174,212,0.16), rgba(122,158,126,0.14))',
          border: '1px solid rgba(122,158,126,0.18)',
        }}
      >
        <Group gap={8} align="center">
          <Loader size="xs" color="lavender" />
          <Text fz="sm" c="sage.6" fs="italic">
            Your journal is being read with care…
          </Text>
        </Group>
      </Paper>
    );
  }

  const text = data?.overall;
  if (isError || !text) return null;

  return (
    <Paper
      p="lg"
      radius="lg"
      style={{
        background:
          'linear-gradient(135deg, rgba(184,174,212,0.18), rgba(122,158,126,0.14))',
        border: '1px solid rgba(122,158,126,0.18)',
      }}
    >
      <Group gap={10} wrap="nowrap" align="flex-start">
        <Sparkles
          size={20}
          color="#B8AED4"
          style={{ marginTop: 4, flexShrink: 0 }}
        />
        <Text
          c="sage.8"
          fs="italic"
          ff="Playfair Display, serif"
          fz="lg"
          lh={1.5}
        >
          {text}
        </Text>
      </Group>
    </Paper>
  );
}
