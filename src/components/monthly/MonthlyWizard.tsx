'use client';

import {
  Box,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Group,
  NumberInput,
  Paper,
  Progress,
  Slider,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChipMulti } from '@/components/journal/ChipMulti';
import { ChipSingle } from '@/components/journal/ChipSingle';
import {
  APPOINTMENTS,
  BODY_NEEDS_MORE,
  BODY_RELATIONSHIPS,
  HERBAL_OPTIONS,
  MONTHLY_SYMPTOMS,
  NERVOUS_SAFETY,
  NERVOUS_SUPPORT,
  SELF_CARE_FOCUS,
  WHAT_CHANGED,
} from '@/lib/data/monthly-options';
import { themeFor } from '@/lib/data/months';
import type { MonthlySetupView } from '@/lib/monthly-mapper';

type Form = {
  affirmation: string;
  affirmationMode: 'adopt' | 'own';
  healthGoal: string;
  symptomsFrequent: string[];
  nervousSystemSafe: string | null;
  bodyRelationship: string | null;
  limitingBelief: string;
  stressLevels: number[];
  stressReactions: string;
  stressSources: string;
  bodyNeedsMore: string[];
  foodsToReduce: string;
  foodsMustHave: string;
  nervousSupport: string[];
  herbalSupports: string[];
  calmingRitual: string;
  selfCareFocus: string[];
  priorityThisMonth: string;
  labResults: string;
  supplements: string;
  whatChanged: string[];
  bodyResponse: string;
  nextVisitFocus: string;
  appointments: string[];
  selfCareActivity: string;
};

function initial(setup: MonthlySetupView | null, suggested: string): Form {
  if (!setup) {
    return {
      affirmation: suggested,
      affirmationMode: 'adopt',
      healthGoal: '',
      symptomsFrequent: [],
      nervousSystemSafe: null,
      bodyRelationship: null,
      limitingBelief: '',
      stressLevels: [3, 3, 3],
      stressReactions: '',
      stressSources: '',
      bodyNeedsMore: [],
      foodsToReduce: '',
      foodsMustHave: '',
      nervousSupport: [],
      herbalSupports: [],
      calmingRitual: '',
      selfCareFocus: [],
      priorityThisMonth: '',
      labResults: '',
      supplements: '',
      whatChanged: [],
      bodyResponse: '',
      nextVisitFocus: '',
      appointments: [],
      selfCareActivity: '',
    };
  }
  return {
    affirmation: setup.affirmation ?? suggested,
    affirmationMode: setup.affirmation && setup.affirmation !== suggested ? 'own' : 'adopt',
    healthGoal: setup.healthGoal ?? '',
    symptomsFrequent: setup.symptomsFrequent,
    nervousSystemSafe: setup.nervousSystemSafe,
    bodyRelationship: setup.bodyRelationship,
    limitingBelief: setup.limitingBelief ?? '',
    stressLevels: setup.stressLevels.length === 3 ? setup.stressLevels : [3, 3, 3],
    stressReactions: setup.stressReactions ?? '',
    stressSources: setup.stressSources ?? '',
    bodyNeedsMore: setup.bodyNeedsMore,
    foodsToReduce: setup.foodsToReduce ?? '',
    foodsMustHave: setup.foodsMustHave ?? '',
    nervousSupport: setup.nervousSupport,
    herbalSupports: setup.herbalSupports,
    calmingRitual: setup.calmingRitual ?? '',
    selfCareFocus: setup.selfCareFocus,
    priorityThisMonth: setup.priorityThisMonth ?? '',
    labResults: setup.labResults ?? '',
    supplements: setup.supplements ?? '',
    whatChanged: setup.whatChanged,
    bodyResponse: setup.bodyResponse ?? '',
    nextVisitFocus: setup.nextVisitFocus ?? '',
    appointments: setup.appointments,
    selfCareActivity: setup.selfCareActivity ?? '',
  };
}

const stepVariants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

interface Props {
  monthNumber: number;
  year: number;
  month: number;
  setup: MonthlySetupView | null;
}

export function MonthlyWizard({ monthNumber, year, month, setup }: Props) {
  const router = useRouter();
  const theme = themeFor(monthNumber);
  const [form, setForm] = useState<Form>(() => initial(setup, theme.affirmation));
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const update = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const totalSteps = 7;
  const progress = ((step + 1) / totalSteps) * 100;

  async function save() {
    setSaving(true);
    const payload = {
      monthNumber,
      year,
      month,
      theme: theme.title,
      affirmation: form.affirmation || theme.affirmation,
      healthGoal: form.healthGoal || null,
      symptomsFrequent: form.symptomsFrequent,
      nervousSystemSafe: form.nervousSystemSafe,
      bodyRelationship: form.bodyRelationship,
      limitingBelief: form.limitingBelief || null,
      stressLevels: form.stressLevels,
      stressReactions: form.stressReactions || null,
      stressSources: form.stressSources || null,
      bodyNeedsMore: form.bodyNeedsMore,
      foodsToReduce: form.foodsToReduce || null,
      foodsMustHave: form.foodsMustHave || null,
      nervousSupport: form.nervousSupport,
      herbalSupports: form.herbalSupports,
      calmingRitual: form.calmingRitual || null,
      selfCareFocus: form.selfCareFocus,
      priorityThisMonth: form.priorityThisMonth || null,
      labResults: form.labResults || null,
      supplements: form.supplements || null,
      whatChanged: form.whatChanged,
      bodyResponse: form.bodyResponse || null,
      nextVisitFocus: form.nextVisitFocus || null,
      appointments: form.appointments,
      selfCareActivity: form.selfCareActivity || null,
    };
    const res = await fetch('/api/monthly', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      notifications.show({ color: 'rose', title: 'Could not save', message: 'Please try again.' });
      return;
    }
    notifications.show({
      color: 'sage',
      title: 'Month set 🌿',
      message: `${theme.title} — your intention is held.`,
    });
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <Container size="md" px={{ base: 'sm', sm: 'md' }} py={{ base: 'md', sm: 'lg' }}>
      <Stack gap="lg">
        <Box>
          <Text fz="xs" c="sage.6" tt="uppercase" lts={2}>
            Month {monthNumber} setup
          </Text>
          <Title order={1} ff="Playfair Display, serif" c="sage.7" fw={500} fz={{ base: 22, sm: 30 }} lh={1.2}>
            {theme.title}
          </Title>
          <Text c="sage.7" fs="italic" ff="Playfair Display, serif" mt="xs" fz={{ base: 'sm', sm: 'md' }}>
            &ldquo;{theme.affirmation}&rdquo;
          </Text>
        </Box>

        <Progress value={progress} color="sage.5" radius="xl" size="sm" striped animated />

        <Paper p={{ base: 'md', sm: 'xl' }} radius="lg" shadow="sm" className="petal-card">
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
                  <Title order={3} ff="Playfair Display, serif" c="sage.7" fw={500}>
                    1 · Theme & Affirmation
                  </Title>
                  <Text c="sage.7">
                    Adopt this month's affirmation, or write your own.
                  </Text>
                  <Group gap="xs">
                    <Button
                      size="sm"
                      radius="xl"
                      variant={form.affirmationMode === 'adopt' ? 'filled' : 'light'}
                      color="sage"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          affirmationMode: 'adopt',
                          affirmation: theme.affirmation,
                        }))
                      }
                    >
                      Adopt suggested
                    </Button>
                    <Button
                      size="sm"
                      radius="xl"
                      variant={form.affirmationMode === 'own' ? 'filled' : 'light'}
                      color="sage"
                      onClick={() => update('affirmationMode', 'own')}
                    >
                      Write my own
                    </Button>
                  </Group>
                  <Textarea
                    autosize
                    minRows={2}
                    value={form.affirmation}
                    disabled={form.affirmationMode === 'adopt'}
                    onChange={(e) => update('affirmation', e.currentTarget.value)}
                  />
                  <TextInput
                    label="One major health goal for this month"
                    placeholder="e.g. Settle my morning nervous system"
                    value={form.healthGoal}
                    onChange={(e) => update('healthGoal', e.currentTarget.value)}
                  />
                </Stack>
              )}

              {step === 1 && (
                <Stack gap="md">
                  <Title order={3} ff="Playfair Display, serif" c="sage.7" fw={500}>
                    2 · Health Snapshot
                  </Title>
                  <Box>
                    <Text fz="sm" c="sage.8" fw={500} mb={6}>
                      Symptoms showing up frequently
                    </Text>
                    <ChipMulti
                      options={MONTHLY_SYMPTOMS}
                      value={form.symptomsFrequent}
                      onChange={(v) => update('symptomsFrequent', v)}
                      color="rose.5"
                    />
                  </Box>
                  <Box>
                    <Text fz="sm" c="sage.8" fw={500} mb={6}>
                      Nervous system safety
                    </Text>
                    <ChipSingle
                      options={NERVOUS_SAFETY}
                      value={form.nervousSystemSafe}
                      onChange={(v) => update('nervousSystemSafe', v)}
                    />
                  </Box>
                  <Box>
                    <Text fz="sm" c="sage.8" fw={500} mb={6}>
                      My current relationship with my body is…
                    </Text>
                    <ChipSingle
                      options={BODY_RELATIONSHIPS}
                      value={form.bodyRelationship}
                      onChange={(v) => update('bodyRelationship', v)}
                      color="blush.5"
                    />
                  </Box>
                  <Textarea
                    label="One limiting belief I'd like to soften this month"
                    autosize
                    minRows={2}
                    value={form.limitingBelief}
                    onChange={(e) => update('limitingBelief', e.currentTarget.value)}
                  />
                </Stack>
              )}

              {step === 2 && (
                <Stack gap="md">
                  <Title order={3} ff="Playfair Display, serif" c="sage.7" fw={500}>
                    3 · Stress & Nervous System
                  </Title>
                  <Text c="sage.7" fz="sm">
                    Three current stress levels (0 = calm, 10 = overwhelmed).
                  </Text>
                  {form.stressLevels.map((level, i) => (
                    <Box key={i}>
                      <Group justify="space-between" mb={4}>
                        <Text fz="sm" c="sage.8">
                          Stress level {i + 1}
                        </Text>
                        <Text fz="sm" c="sage.7" ff="Playfair Display, serif">
                          {level}/10
                        </Text>
                      </Group>
                      <Slider
                        min={0}
                        max={10}
                        value={level}
                        color={level <= 3 ? 'sage' : level <= 6 ? 'gold' : 'rose'}
                        onChange={(v) => {
                          const next = [...form.stressLevels];
                          next[i] = v;
                          update('stressLevels', next);
                        }}
                      />
                    </Box>
                  ))}
                  <Textarea
                    label="How stress shows up in my body"
                    autosize
                    minRows={2}
                    value={form.stressReactions}
                    onChange={(e) => update('stressReactions', e.currentTarget.value)}
                  />
                  <Textarea
                    label="My biggest stress sources"
                    autosize
                    minRows={2}
                    value={form.stressSources}
                    onChange={(e) => update('stressSources', e.currentTarget.value)}
                  />
                </Stack>
              )}

              {step === 3 && (
                <Stack gap="md">
                  <Title order={3} ff="Playfair Display, serif" c="sage.7" fw={500}>
                    4 · Food & Nervous System Support
                  </Title>
                  <Box>
                    <Text fz="sm" c="sage.8" fw={500} mb={6}>
                      My body needs more of
                    </Text>
                    <ChipMulti
                      options={BODY_NEEDS_MORE}
                      value={form.bodyNeedsMore}
                      onChange={(v) => update('bodyNeedsMore', v)}
                    />
                  </Box>
                  <Group grow align="flex-start">
                    <Textarea
                      label="Foods to reduce or stop (up to 5)"
                      autosize
                      minRows={2}
                      value={form.foodsToReduce}
                      onChange={(e) => update('foodsToReduce', e.currentTarget.value)}
                    />
                    <Textarea
                      label="Foods I must have"
                      autosize
                      minRows={2}
                      value={form.foodsMustHave}
                      onChange={(e) => update('foodsMustHave', e.currentTarget.value)}
                    />
                  </Group>
                  <Box>
                    <Text fz="sm" c="sage.8" fw={500} mb={6}>
                      Nervous system supports
                    </Text>
                    <ChipMulti
                      options={NERVOUS_SUPPORT}
                      value={form.nervousSupport}
                      onChange={(v) => update('nervousSupport', v)}
                      color="lavender.5"
                    />
                  </Box>
                  <Box>
                    <Text fz="sm" c="sage.8" fw={500} mb={6}>
                      Herbal teas / tinctures this month
                    </Text>
                    <ChipMulti
                      options={HERBAL_OPTIONS}
                      value={form.herbalSupports}
                      onChange={(v) => update('herbalSupports', v)}
                    />
                  </Box>
                  <TextInput
                    label="One calming ritual I'll commit to"
                    placeholder="e.g. 5 minutes of stillness before bed"
                    value={form.calmingRitual}
                    onChange={(e) => update('calmingRitual', e.currentTarget.value)}
                  />
                </Stack>
              )}

              {step === 4 && (
                <Stack gap="md">
                  <Title order={3} ff="Playfair Display, serif" c="sage.7" fw={500}>
                    5 · Self-Care & Body Maintenance
                  </Title>
                  <Box>
                    <Text fz="sm" c="sage.8" fw={500} mb={6}>
                      What I'd like to focus on
                    </Text>
                    <ChipMulti
                      options={SELF_CARE_FOCUS}
                      value={form.selfCareFocus}
                      onChange={(v) => update('selfCareFocus', v)}
                      color="blush.5"
                    />
                  </Box>
                  <Textarea
                    label="My priority this month"
                    autosize
                    minRows={3}
                    placeholder="What does this month need to be about?"
                    value={form.priorityThisMonth}
                    onChange={(e) => update('priorityThisMonth', e.currentTarget.value)}
                  />
                </Stack>
              )}

              {step === 5 && (
                <Stack gap="md">
                  <Title order={3} ff="Playfair Display, serif" c="sage.7" fw={500}>
                    6 · Appointments & Treatments
                  </Title>
                  <Box>
                    <Text fz="sm" c="sage.8" fw={500} mb={6}>
                      Appointments planned
                    </Text>
                    <ChipMulti
                      options={APPOINTMENTS}
                      value={form.appointments}
                      onChange={(v) => update('appointments', v)}
                    />
                  </Box>
                  <Textarea
                    label="A self-care activity I'll book in"
                    autosize
                    minRows={2}
                    value={form.selfCareActivity}
                    onChange={(e) => update('selfCareActivity', e.currentTarget.value)}
                  />
                </Stack>
              )}

              {step === 6 && (
                <Stack gap="md">
                  <Title order={3} ff="Playfair Display, serif" c="sage.7" fw={500}>
                    7 · Medical Snapshot
                  </Title>
                  <Textarea
                    label="Recent lab results / notes"
                    autosize
                    minRows={2}
                    value={form.labResults}
                    onChange={(e) => update('labResults', e.currentTarget.value)}
                  />
                  <Textarea
                    label="Supplements / medications"
                    autosize
                    minRows={2}
                    value={form.supplements}
                    onChange={(e) => update('supplements', e.currentTarget.value)}
                  />
                  <Box>
                    <Text fz="sm" c="sage.8" fw={500} mb={6}>
                      What changed this month
                    </Text>
                    <ChipMulti
                      options={WHAT_CHANGED}
                      value={form.whatChanged}
                      onChange={(v) => update('whatChanged', v)}
                    />
                  </Box>
                  <Textarea
                    label="How my body has been responding"
                    autosize
                    minRows={2}
                    value={form.bodyResponse}
                    onChange={(e) => update('bodyResponse', e.currentTarget.value)}
                  />
                  <Textarea
                    label="Questions / focus for my next visit"
                    autosize
                    minRows={2}
                    value={form.nextVisitFocus}
                    onChange={(e) => update('nextVisitFocus', e.currentTarget.value)}
                  />
                </Stack>
              )}
            </motion.div>
          </AnimatePresence>

          <Divider color="sage.2" my="lg" />

          <Group justify="space-between">
            <Button
              variant="subtle"
              color="sage"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              Back
            </Button>
            {step < totalSteps - 1 ? (
              <Button radius="xl" color="sage.5" onClick={() => setStep((s) => s + 1)}>
                Continue
              </Button>
            ) : (
              <Button
                radius="xl"
                color="sage.5"
                onClick={save}
                loading={saving}
                variant="gradient"
                gradient={{ from: 'sage.5', to: 'sage.7', deg: 135 }}
              >
                Set this month 🌿
              </Button>
            )}
          </Group>
        </Paper>

        <Center>
          <Text fz="xs" c="sage.6">
            Step {step + 1} of {totalSteps}
          </Text>
        </Center>
      </Stack>
    </Container>
  );
}
