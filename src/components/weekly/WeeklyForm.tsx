'use client';

import {
  Box,
  Button,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChipSingle } from '@/components/journal/ChipSingle';

const NERVOUS_SAFETY = ['Unsafe', 'Neutral', 'Safe'] as const;

const WASHI_COLORS = [
  'rgba(232,196,184,0.55)',
  'rgba(184,174,212,0.55)',
  'rgba(201,169,110,0.50)',
  'rgba(181,206,184,0.65)',
  'rgba(212,130,122,0.45)',
  'rgba(232,196,184,0.40)',
  'rgba(184,174,212,0.45)',
  'rgba(201,169,110,0.45)',
  'rgba(181,206,184,0.55)',
];

interface Form {
  focusThisWeek: string;
  nonNegotiables: string;
  nervousSystemSafe: (typeof NERVOUS_SAFETY)[number] | null;
  gratefulFor: string;
  weekWins: string;
  weekChallenges: string;
  foodTrigger: string;
  energySleepPattern: string;
  whatILearnt: string;
  improvementNeeded: string;
}

interface Initial {
  focusThisWeek: string | null;
  nonNegotiables: string | null;
  nervousSystemSafe: string | null;
  gratefulFor: string | null;
  weekWins: string | null;
  weekChallenges: string | null;
  foodTrigger: string | null;
  energySleepPattern: string | null;
  whatILearnt: string | null;
  improvementNeeded: string | null;
}

interface Props {
  weekNumber: number;
  initial: Initial | null;
}

export function WeeklyForm({ weekNumber, initial }: Props) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Form>({
    focusThisWeek: initial?.focusThisWeek ?? '',
    nonNegotiables: initial?.nonNegotiables ?? '',
    nervousSystemSafe:
      initial?.nervousSystemSafe &&
      NERVOUS_SAFETY.includes(
        initial.nervousSystemSafe as (typeof NERVOUS_SAFETY)[number],
      )
        ? (initial.nervousSystemSafe as (typeof NERVOUS_SAFETY)[number])
        : null,
    gratefulFor: initial?.gratefulFor ?? '',
    weekWins: initial?.weekWins ?? '',
    weekChallenges: initial?.weekChallenges ?? '',
    foodTrigger: initial?.foodTrigger ?? '',
    energySleepPattern: initial?.energySleepPattern ?? '',
    whatILearnt: initial?.whatILearnt ?? '',
    improvementNeeded: initial?.improvementNeeded ?? '',
  });

  const update = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    setSaving(true);
    const res = await fetch('/api/weekly', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weekNumber, ...form }),
    });
    setSaving(false);
    if (!res.ok) {
      notifications.show({ color: 'rose', title: 'Could not save', message: 'Please try again.' });
      return;
    }
    notifications.show({
      color: 'sage',
      title: 'Week held 🌸',
      message: 'Your weekly review is saved.',
    });
    router.push('/dashboard');
    router.refresh();
  }

  const cards = [
    {
      title: 'Focus this week',
      hint: 'One sentence is enough.',
      key: 'focusThisWeek' as const,
      placeholder: 'e.g. Slow mornings, no late screens.',
    },
    {
      title: 'Non-negotiables',
      hint: 'What I will not skip.',
      key: 'nonNegotiables' as const,
      placeholder: 'Walks · water · 9pm wind-down.',
    },
    {
      title: 'Grateful for',
      key: 'gratefulFor' as const,
      placeholder: 'Small or large — it all counts.',
    },
    {
      title: 'Week wins',
      key: 'weekWins' as const,
      placeholder: 'What did I do well? What surprised me?',
    },
    {
      title: 'Week challenges',
      key: 'weekChallenges' as const,
      placeholder: 'Where did I bump into resistance?',
    },
    {
      title: 'Food trigger noticed',
      key: 'foodTrigger' as const,
      placeholder: 'Any food–body patterns?',
    },
    {
      title: 'Energy & sleep pattern',
      key: 'energySleepPattern' as const,
      placeholder: 'When did I feel most/least restored?',
    },
    {
      title: 'What I learnt',
      key: 'whatILearnt' as const,
      placeholder: 'A line of insight worth keeping.',
    },
    {
      title: 'Where I want to grow',
      key: 'improvementNeeded' as const,
      placeholder: 'A gentle next-step for the coming week.',
    },
  ];

  return (
    <Container size="lg" px={{ base: 'sm', sm: 'md' }} py={{ base: 'md', sm: 'lg' }}>
      <Stack gap="lg">
        <Box>
          <Text fz="xs" c="sage.6" tt="uppercase" lts={2}>
            Week {weekNumber}
          </Text>
          <Title order={1} ff="Playfair Display, serif" c="sage.7" fw={500} fz={{ base: 22, sm: 32 }} lh={1.2}>
            Your weekly review
          </Title>
          <Text c="sage.7" fs="italic" ff="Playfair Display, serif" mt="xs" fz={{ base: 'sm', sm: 'md' }}>
            Sit with it like a Sunday letter to yourself.
          </Text>
        </Box>

        <Box className="washi-card-frame">
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={{ base: 'md', sm: 'lg' }}>
            <StickyNote washi={'rgba(122,158,126,0.55)'} key="safety">
              <Stack gap="xs">
                <Text c="sage.7" ff="Playfair Display, serif" fz="lg" fw={500}>
                  How safe my nervous system felt
                </Text>
                <ChipSingle
                  options={NERVOUS_SAFETY}
                  value={form.nervousSystemSafe}
                  onChange={(v) =>
                    update(
                      'nervousSystemSafe',
                      (v as (typeof NERVOUS_SAFETY)[number] | null) ?? null,
                    )
                  }
                />
              </Stack>
            </StickyNote>
            {cards.map((c, i) => (
              <StickyNote
                key={c.key}
                washi={WASHI_COLORS[i % WASHI_COLORS.length]}
                reduced={reduced}
                index={i}
              >
                <Stack gap={6}>
                  <Text c="sage.7" ff="Playfair Display, serif" fz="lg" fw={500}>
                    {c.title}
                  </Text>
                  {c.hint && (
                    <Text fz="xs" c="sage.6" fs="italic">
                      {c.hint}
                    </Text>
                  )}
                  <Textarea
                    autosize
                    minRows={3}
                    maxRows={8}
                    placeholder={c.placeholder}
                    value={form[c.key]}
                    onChange={(e) => update(c.key, e.currentTarget.value)}
                    variant="filled"
                    styles={{
                      input: {
                        background: 'rgba(255,255,255,0.6)',
                        border: 'none',
                      },
                    }}
                  />
                </Stack>
              </StickyNote>
            ))}
          </SimpleGrid>
        </Box>

        <Group justify="flex-end">
          <Button
            size="lg"
            radius="xl"
            loading={saving}
            onClick={save}
            variant="gradient"
            gradient={{ from: 'sage.5', to: 'sage.7', deg: 135 }}
          >
            Save this week 🌸
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}

function StickyNote({
  children,
  washi,
  reduced,
  index = 0,
}: {
  children: React.ReactNode;
  washi: string;
  reduced?: boolean | null;
  index?: number;
}) {
  const Wrapper = reduced ? 'div' : motion.div;
  const tilt = (index % 3) - 1; // -1, 0, 1
  return (
    <Wrapper
      {...(reduced
        ? {}
        : {
            initial: { opacity: 0, y: 14, rotate: tilt * 0.4 },
            whileInView: { opacity: 1, y: 0, rotate: tilt * 0.4 },
            viewport: { once: true, margin: '-30px' },
            transition: { duration: 0.45, ease: 'easeOut' },
          })}
      style={{
        position: 'relative',
        background: 'rgba(255,255,255,0.92)',
        borderRadius: 16,
        padding: '32px 20px 20px',
        boxShadow: '0 6px 24px rgba(122,158,126,0.12)',
        border: '1px solid rgba(122,158,126,0.10)',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: -10,
          left: '50%',
          transform: 'translateX(-50%) rotate(-2deg)',
          width: 64,
          height: 18,
          background: washi,
          borderRadius: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
      />
      {children}
    </Wrapper>
  );
}
