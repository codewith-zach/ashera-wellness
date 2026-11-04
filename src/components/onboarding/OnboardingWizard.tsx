'use client';

import {
  Box,
  Button,
  Center,
  Checkbox,
  Container,
  Group,
  Paper,
  Progress,
  Radio,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BODY_RELATIONSHIP, NERVOUS_SAFETY } from '@/lib/data/options';
import { notifications } from '@mantine/notifications';

interface Form {
  healingIntention: string;
  majorHealthGoal: string;
  goalFeeling: string;
  goalWhyItMatters: string;
  commitmentLetter: string;
  signature: string;
  nervousSystemSafe: string;
  bodyRelationship: string[];
}

const blank: Form = {
  healingIntention: '',
  majorHealthGoal: '',
  goalFeeling: '',
  goalWhyItMatters: '',
  commitmentLetter: '',
  signature: '',
  nervousSystemSafe: '',
  bodyRelationship: [],
};

const stepVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

export function OnboardingWizard({ displayName }: { displayName: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(blank);
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function submit() {
    setSubmitting(true);
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const res = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, timezone }),
    });
    setSubmitting(false);
    if (res.ok) {
      notifications.show({
        title: 'Welcome home 🌿',
        message: 'Your journal is ready for you.',
        color: 'sage',
      });
      router.push('/dashboard');
      router.refresh();
    } else {
      notifications.show({
        title: 'Something went sideways',
        message: 'Please try again.',
        color: 'rose',
      });
    }
  }

  const totalSteps = 4;
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <Box
      mih="100vh"
      style={{
        background:
          'linear-gradient(160deg, #f5f0ea 0%, #dde9de 60%, #b5ceb8 100%)',
      }}
    >
      <Container size="sm" py={{ base: 'lg', sm: 48 }} px={{ base: 'sm', sm: 'md' }}>
        <Center mb="md">
          <Stack align="center" gap={4}>
            <span style={{ fontSize: 32, color: '#4A7050' }}>✿</span>
            <Text c="sage.7" fz="xs" tt="uppercase" lts={3}>
              Ashe Ra
            </Text>
          </Stack>
        </Center>

        <Progress
          value={progress}
          color="sage.5"
          radius="xl"
          size="sm"
          mb="lg"
          striped
          animated
        />

        <Paper
          p={{ base: 'md', sm: 'xl' }}
          radius="lg"
          shadow="md"
          className="glass-card"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {step === 0 && (
                <Stack gap="md">
                  <Title
                    order={2}
                    ff="Playfair Display, serif"
                    c="sage.7"
                    fw={500}
                    fz={{ base: 22, sm: 28 }}
                  >
                    Welcome, {displayName} 🌿
                  </Title>
                  <Text c="sage.8">
                    This is your soft place to land each day. Over the next 11
                    months, your journal will become a quiet record of how you
                    showed up for yourself.
                  </Text>
                  <Text c="sage.7" fs="italic" ff="Playfair Display, serif">
                    “The body keeps the score — and now, so do you.”
                  </Text>
                </Stack>
              )}

              {step === 1 && (
                <Stack gap="md">
                  <Title order={3} ff="Playfair Display, serif" c="sage.7">
                    11-Month Healing Intention
                  </Title>
                  <Textarea
                    label="If these next 11 months changed my life, it would be because…"
                    minRows={3}
                    autosize
                    value={form.healingIntention}
                    onChange={(e) =>
                      update('healingIntention', e.currentTarget.value)
                    }
                  />
                  <TextInput
                    label="My one major health goal"
                    placeholder="e.g. Heal my gut and feel at home in my body"
                    value={form.majorHealthGoal}
                    onChange={(e) =>
                      update('majorHealthGoal', e.currentTarget.value)
                    }
                  />
                  <TextInput
                    label="How achieving this would feel"
                    placeholder="Light, free, soft, alive…"
                    value={form.goalFeeling}
                    onChange={(e) =>
                      update('goalFeeling', e.currentTarget.value)
                    }
                  />
                  <Textarea
                    label="Why this matters to me"
                    autosize
                    minRows={2}
                    value={form.goalWhyItMatters}
                    onChange={(e) =>
                      update('goalWhyItMatters', e.currentTarget.value)
                    }
                  />
                </Stack>
              )}

              {step === 2 && (
                <Stack gap="md">
                  <Title order={3} ff="Playfair Display, serif" c="sage.7">
                    Commitment Letter
                  </Title>
                  <Text c="sage.8" fz="sm">
                    Write a few honest lines to yourself. Begin with “I am no
                    longer the person who…” and end with “I am becoming someone
                    who…”
                  </Text>
                  <Textarea
                    autosize
                    minRows={6}
                    value={form.commitmentLetter}
                    onChange={(e) =>
                      update('commitmentLetter', e.currentTarget.value)
                    }
                    placeholder="I am no longer the person who…"
                  />
                  <TextInput
                    label="Signed (your name)"
                    value={form.signature}
                    onChange={(e) =>
                      update('signature', e.currentTarget.value)
                    }
                  />
                  <Text c="sage.6" fz="xs">
                    Today’s date will be saved alongside this letter.
                  </Text>
                </Stack>
              )}

              {step === 3 && (
                <Stack gap="md">
                  <Title order={3} ff="Playfair Display, serif" c="sage.7">
                    Nervous System Baseline
                  </Title>
                  <Radio.Group
                    label="How safe do I currently feel in my body?"
                    value={form.nervousSystemSafe}
                    onChange={(v) => update('nervousSystemSafe', v)}
                  >
                    <Stack gap={6} mt={6}>
                      {NERVOUS_SAFETY.map((opt) => (
                        <Radio
                          key={opt}
                          value={opt}
                          label={opt}
                          color="sage.5"
                        />
                      ))}
                    </Stack>
                  </Radio.Group>

                  <Checkbox.Group
                    label="My current relationship with my body is…"
                    value={form.bodyRelationship}
                    onChange={(v) => update('bodyRelationship', v)}
                  >
                    <Group mt={6} gap="xs">
                      {BODY_RELATIONSHIP.map((b) => (
                        <Checkbox
                          key={b}
                          value={b}
                          label={b}
                          color="sage.5"
                        />
                      ))}
                    </Group>
                  </Checkbox.Group>
                </Stack>
              )}
            </motion.div>
          </AnimatePresence>

          <Group justify="space-between" mt="xl">
            <Button
              variant="subtle"
              color="sage"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              Back
            </Button>
            {step < totalSteps - 1 ? (
              <Button
                color="sage.5"
                onClick={() => setStep((s) => s + 1)}
                radius="xl"
              >
                Continue
              </Button>
            ) : (
              <Button
                color="sage.5"
                onClick={submit}
                loading={submitting}
                radius="xl"
              >
                Begin journaling 🌿
              </Button>
            )}
          </Group>
        </Paper>

        <Center mt="md">
          <Text c="sage.7" fz="xs">
            Step {step + 1} of {totalSteps}
          </Text>
        </Center>
      </Container>
    </Box>
  );
}
