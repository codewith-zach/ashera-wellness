'use client';

import {
  Box,
  Button,
  Collapse,
  Container,
  Divider,
  Group,
  NumberInput,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  AFTER_MEALS,
  BODY_FEELINGS,
  BOWEL_EASE,
  BOWEL_TEXTURE,
  CYCLE_MOOD,
  CYCLE_MUCUS,
  CYCLE_PHASES,
  HERBAL_TEAS,
  LIBIDO_OPTIONS,
  MIND_FEEL,
  MOVE_AFTER,
  MOVE_DURING,
  MOVE_INTENSITY,
  PAIN_AREAS,
  PRACTICES,
  SELF_CARE_OPTIONS,
  SKIN_OPTIONS,
  SLEEP_QUALITY,
  SYMPTOM_OPTIONS,
} from '@/lib/data/options';
import { longDate, todayISO } from '@/lib/utils/date';
import type { DailyEntryView } from '@/lib/entry-mapper';
import { ChipMulti } from './ChipMulti';
import { ChipSingle } from './ChipSingle';
import { Confetti } from './Confetti';
import { MoodSelector } from './MoodSelector';
import { SectionCard } from './SectionCard';
import { SleepSlider } from './SleepSlider';
import { StressSlider } from './StressSlider';
import { WaterCups } from './WaterCups';
import { useQueryClient } from '@tanstack/react-query';
import { MilestoneCelebration } from '@/components/milestones/MilestoneCelebration';
import type { Milestone } from '@/lib/milestones';

type FormState = {
  mood: number | null;
  moodEmoji: string | null;
  energyLevel: number | null;
  stressLevel: number | null;
  bodyFeelings: string[];
  sleepHours: number | null;
  sleepQuality: string | null;
  waterCups: number | null;
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
  calProtein: string;
  herbalTeas: string[];
  bodyResponse: string;
  bowelTexture: string | null;
  bowelEase: string | null;
  afterMeals: string[];
  symptoms: string[];
  symptomsExtra: string;
  symptomBetter: string;
  symptomWorse: string;
  cyclePhase: string | null;
  cycleMucus: string | null;
  cycleMood: string | null;
  libido: string | null;
  skinCondition: string | null;
  painAreas: string[];
  moveActivity: string;
  moveDuration: number | null;
  moveIntensity: string | null;
  moveDuring: string | null;
  moveAfter: string | null;
  mindFeel: string | null;
  todayPracticed: string[];
  stressedBy: string;
  supportedBy: string;
  selfCare: string[];
  gratitude: string;
  proudOf: string;
  notes: string;
};

function initial(entry: DailyEntryView | null): FormState {
  return {
    mood: entry?.mood ?? null,
    moodEmoji: entry?.moodEmoji ?? null,
    energyLevel: entry?.energyLevel ?? null,
    stressLevel: entry?.stressLevel ?? null,
    bodyFeelings: entry?.bodyFeelings ?? [],
    sleepHours: entry?.sleepHours ?? null,
    sleepQuality: entry?.sleepQuality ?? null,
    waterCups: entry?.waterCups ?? 0,
    breakfast: entry?.breakfast ?? '',
    lunch: entry?.lunch ?? '',
    dinner: entry?.dinner ?? '',
    snacks: entry?.snacks ?? '',
    calProtein: entry?.calProtein ?? '',
    herbalTeas: entry?.herbalTeas ?? [],
    bodyResponse: entry?.bodyResponse ?? '',
    bowelTexture: entry?.bowelTexture ?? null,
    bowelEase: entry?.bowelEase ?? null,
    afterMeals: entry?.afterMeals ?? [],
    symptoms: entry?.symptoms ?? [],
    symptomsExtra: entry?.symptomsExtra ?? '',
    symptomBetter: entry?.symptomBetter ?? '',
    symptomWorse: entry?.symptomWorse ?? '',
    cyclePhase: entry?.cyclePhase ?? null,
    cycleMucus: entry?.cycleMucus ?? null,
    cycleMood: entry?.cycleMood ?? null,
    libido: entry?.libido ?? null,
    skinCondition: entry?.skinCondition ?? null,
    painAreas: entry?.painAreas ?? [],
    moveActivity: entry?.moveActivity ?? '',
    moveDuration: entry?.moveDuration ?? null,
    moveIntensity: entry?.moveIntensity ?? null,
    moveDuring: entry?.moveDuring ?? null,
    moveAfter: entry?.moveAfter ?? null,
    mindFeel: entry?.mindFeel ?? null,
    todayPracticed: entry?.todayPracticed ?? [],
    stressedBy: entry?.stressedBy ?? '',
    supportedBy: entry?.supportedBy ?? '',
    selfCare: entry?.selfCare ?? [],
    gratitude: entry?.gratitude ?? '',
    proudOf: entry?.proudOf ?? '',
    notes: entry?.notes ?? '',
  };
}

function isFilled(s: FormState): string[] {
  const completed: string[] = [];
  if (s.mood) completed.push('mood');
  if (s.energyLevel || s.stressLevel || s.bodyFeelings.length || s.painAreas.length || s.skinCondition || s.libido) completed.push('body');
  if (s.sleepHours || s.sleepQuality) completed.push('sleep');
  if (s.breakfast || s.lunch || s.dinner || s.snacks || s.waterCups || s.herbalTeas.length) completed.push('nutrition');
  if (s.bowelTexture || s.bowelEase || s.afterMeals.length) completed.push('gut');
  if (s.symptoms.length || s.symptomsExtra) completed.push('symptoms');
  if (s.cyclePhase || s.cycleMucus || s.cycleMood) completed.push('cycle');
  if (s.moveActivity || s.moveDuration) completed.push('movement');
  if (s.mindFeel || s.todayPracticed.length || s.stressedBy || s.supportedBy) completed.push('mind');
  if (s.selfCare.length) completed.push('selfCare');
  if (s.gratitude || s.proudOf || s.notes) completed.push('reflection');
  return completed;
}

interface Props {
  date?: string;
  initialEntry: DailyEntryView | null;
}

const DRAFT_KEY = (date: string) => `ashera_draft_${date}`;

export function JournalForm({ date = todayISO(), initialEntry }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(() => initial(initialEntry));
  const [saving, setSaving] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [cycleOpen, setCycleOpen] = useState(
    Boolean(initialEntry?.cyclePhase || initialEntry?.cycleMucus),
  );
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [milestone, setMilestone] = useState<Milestone | null>(null);

  // Hydrate draft from localStorage on mount, but only if no entry exists.
  useEffect(() => {
    if (initialEntry || draftLoaded) return;
    try {
      const raw = localStorage.getItem(DRAFT_KEY(date));
      if (raw) {
        const draft = JSON.parse(raw) as FormState;
        setForm(draft);
      }
    } catch {
      // ignore
    }
    setDraftLoaded(true);
  }, [date, initialEntry, draftLoaded]);

  // Auto-save draft every 30s
  useEffect(() => {
    const id = setInterval(() => {
      try {
        localStorage.setItem(DRAFT_KEY(date), JSON.stringify(form));
      } catch {
        // ignore
      }
    }, 30000);
    return () => clearInterval(id);
  }, [form, date]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function save() {
    setSaving(true);
    const payload = {
      ...form,
      date,
      completedSections: isFilled(form),
    };
    const res = await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      notifications.show({
        color: 'rose',
        title: 'Could not save',
        message: 'Please try again in a moment.',
      });
      return;
    }
    const data = (await res.json()) as { milestones?: Milestone[] };
    try {
      localStorage.removeItem(DRAFT_KEY(date));
    } catch {
      // ignore
    }
    setConfetti(true);
    notifications.show({
      color: 'sage',
      title: 'You showed up for yourself today ✨',
      message: 'Your entry is saved.',
      autoClose: 3000,
    });
    queryClient.invalidateQueries({ queryKey: ['streak'] });
    queryClient.invalidateQueries({ queryKey: ['entries'] });

    const earned = data.milestones?.[0] ?? null;
    if (earned) {
      // Show milestone overlay; user dismisses to navigate.
      setTimeout(() => setMilestone(earned), 700);
      return;
    }
    setTimeout(() => {
      setConfetti(false);
      router.push('/dashboard');
      router.refresh();
    }, 1400);
  }

  function dismissMilestone() {
    setMilestone(null);
    setConfetti(false);
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <Container size="md" px={{ base: 'sm', sm: 'xs' }} py={{ base: 'md', sm: 'lg' }}>
      <Confetti show={confetti} />
      <MilestoneCelebration milestone={milestone} onDismiss={dismissMilestone} />
      <Stack gap="lg">
        <Box>
          <Text c="sage.6" fz="xs" tt="uppercase" lts={2}>
            Today
          </Text>
          <Title
            order={1}
            ff="Playfair Display, serif"
            c="sage.7"
            fz={{ base: 22, xs: 26, sm: 32 }}
            fw={500}
            lh={1.2}
            mt={2}
          >
            {longDate(date)}
          </Title>
          <Text c="sage.7" fs="italic" ff="Playfair Display, serif" fz={{ base: 'sm', sm: 'md' }}>
            Your body is waiting to be heard 🌿
          </Text>
        </Box>

        <SectionCard index={1} title="Mood Check" icon="🌸">
          <MoodSelector
            value={form.mood}
            onChange={(mood, moodEmoji) => {
              update('mood', mood);
              update('moodEmoji', moodEmoji);
            }}
          />
        </SectionCard>

        <SectionCard index={2} title="Body Check-In" icon="🤍">
          <Stack gap="lg">
            <Box>
              <Text c="sage.8" fz="sm" fw={500} mb={6}>
                My body feels…
              </Text>
              <ChipMulti
                options={BODY_FEELINGS}
                value={form.bodyFeelings}
                onChange={(v) => update('bodyFeelings', v)}
              />
            </Box>
            <StressSlider
              label="Energy"
              trackKind="energy"
              value={form.energyLevel}
              onChange={(v) => update('energyLevel', v)}
            />
            <StressSlider
              label="Stress"
              trackKind="stress"
              value={form.stressLevel}
              onChange={(v) => update('stressLevel', v)}
            />
            <Box>
              <Text c="sage.8" fz="sm" fw={500} mb={6}>
                Pain or discomfort
              </Text>
              <ChipMulti
                options={PAIN_AREAS}
                value={form.painAreas}
                onChange={(v) => update('painAreas', v)}
              />
            </Box>
            <Box>
              <Text c="sage.8" fz="sm" fw={500} mb={6}>
                Skin
              </Text>
              <ChipSingle
                options={SKIN_OPTIONS}
                value={form.skinCondition}
                onChange={(v) => update('skinCondition', v)}
              />
            </Box>
            <Box>
              <Text c="sage.6" fz="xs" tt="uppercase" lts={2} mb={6}>
                Libido
              </Text>
              <ChipSingle
                options={LIBIDO_OPTIONS}
                value={form.libido}
                onChange={(v) => update('libido', v)}
              />
            </Box>
          </Stack>
        </SectionCard>

        <SectionCard index={3} title="Sleep" icon="🌙">
          <Stack gap="lg">
            <SleepSlider
              value={form.sleepHours}
              onChange={(v) => update('sleepHours', v)}
            />
            <Box>
              <Text c="sage.8" fz="sm" fw={500} mb={6}>
                Quality
              </Text>
              <ChipSingle
                options={SLEEP_QUALITY}
                value={form.sleepQuality}
                onChange={(v) => update('sleepQuality', v)}
                color="lavender.5"
              />
            </Box>
          </Stack>
        </SectionCard>

        <SectionCard index={4} title="What I Ate" icon="🍵">
          <Stack gap="md">
            <Group grow align="flex-start" wrap="wrap">
              <Textarea
                label="Breakfast"
                autosize
                minRows={1}
                value={form.breakfast}
                onChange={(e) => update('breakfast', e.currentTarget.value)}
              />
              <Textarea
                label="Lunch"
                autosize
                minRows={1}
                value={form.lunch}
                onChange={(e) => update('lunch', e.currentTarget.value)}
              />
            </Group>
            <Group grow align="flex-start" wrap="wrap">
              <Textarea
                label="Dinner"
                autosize
                minRows={1}
                value={form.dinner}
                onChange={(e) => update('dinner', e.currentTarget.value)}
              />
              <Textarea
                label="Snacks"
                autosize
                minRows={1}
                value={form.snacks}
                onChange={(e) => update('snacks', e.currentTarget.value)}
              />
            </Group>
            <Box>
              <Text c="sage.8" fz="sm" fw={500} mb={6}>
                Water
              </Text>
              <WaterCups
                value={form.waterCups ?? 0}
                onChange={(v) => update('waterCups', v)}
              />
            </Box>
            <TextInput
              label="Calorie / protein notes"
              value={form.calProtein}
              onChange={(e) => update('calProtein', e.currentTarget.value)}
            />
            <Box>
              <Text c="sage.8" fz="sm" fw={500} mb={6}>
                Herbal teas / supplements
              </Text>
              <ChipMulti
                options={HERBAL_TEAS}
                value={form.herbalTeas}
                onChange={(v) => update('herbalTeas', v)}
              />
            </Box>
            <Textarea
              label="How my body responded to food"
              autosize
              minRows={2}
              value={form.bodyResponse}
              onChange={(e) => update('bodyResponse', e.currentTarget.value)}
            />
          </Stack>
        </SectionCard>

        <SectionCard index={5} title="Gut Health" icon="🌾">
          <Stack gap="md">
            <Box>
              <Text c="sage.8" fz="sm" fw={500} mb={6}>
                Bowel texture
              </Text>
              <ChipSingle
                options={BOWEL_TEXTURE}
                value={form.bowelTexture}
                onChange={(v) => update('bowelTexture', v)}
              />
            </Box>
            <Box>
              <Text c="sage.8" fz="sm" fw={500} mb={6}>
                Ease
              </Text>
              <ChipSingle
                options={BOWEL_EASE}
                value={form.bowelEase}
                onChange={(v) => update('bowelEase', v)}
              />
            </Box>
            <Box>
              <Text c="sage.8" fz="sm" fw={500} mb={6}>
                After meals I noticed
              </Text>
              <ChipMulti
                options={AFTER_MEALS}
                value={form.afterMeals}
                onChange={(v) => update('afterMeals', v)}
              />
            </Box>
          </Stack>
        </SectionCard>

        <SectionCard index={6} title="Symptom Tracker" icon="🩹">
          <Stack gap="md">
            <ChipMulti
              options={SYMPTOM_OPTIONS}
              value={form.symptoms}
              onChange={(v) => update('symptoms', v)}
              color="rose.5"
            />
            <TextInput
              label="Other symptoms"
              value={form.symptomsExtra}
              onChange={(e) => update('symptomsExtra', e.currentTarget.value)}
            />
            <Textarea
              label="What made it better?"
              autosize
              minRows={2}
              value={form.symptomBetter}
              onChange={(e) => update('symptomBetter', e.currentTarget.value)}
            />
            <Textarea
              label="What made it worse?"
              autosize
              minRows={2}
              value={form.symptomWorse}
              onChange={(e) => update('symptomWorse', e.currentTarget.value)}
            />
          </Stack>
        </SectionCard>

        <SectionCard
          index={7}
          title="Hormone & Cycle"
          icon="🌙"
          hint="Optional but powerful 🌙"
        >
          <Switch
            label="Track today"
            checked={cycleOpen}
            color="lavender.5"
            onChange={(e) => setCycleOpen(e.currentTarget.checked)}
          />
          <Collapse in={cycleOpen}>
            <Stack gap="md" mt="md">
              <Box>
                <Text c="sage.8" fz="sm" fw={500} mb={6}>
                  Cycle phase
                </Text>
                <ChipSingle
                  options={CYCLE_PHASES}
                  value={form.cyclePhase}
                  onChange={(v) => update('cyclePhase', v)}
                  color="lavender.5"
                />
              </Box>
              <Box>
                <Text c="sage.8" fz="sm" fw={500} mb={6}>
                  Cervical mucus
                </Text>
                <ChipSingle
                  options={CYCLE_MUCUS}
                  value={form.cycleMucus}
                  onChange={(v) => update('cycleMucus', v)}
                  color="lavender.5"
                />
              </Box>
              <Box>
                <Text c="sage.8" fz="sm" fw={500} mb={6}>
                  Cycle mood
                </Text>
                <ChipSingle
                  options={CYCLE_MOOD}
                  value={form.cycleMood}
                  onChange={(v) => update('cycleMood', v)}
                  color="lavender.5"
                />
              </Box>
            </Stack>
          </Collapse>
        </SectionCard>

        <SectionCard index={8} title="Movement & Exercise" icon="🚶‍♀️">
          <Stack gap="md">
            <Group grow align="flex-end" wrap="wrap">
              <TextInput
                label="Activity"
                value={form.moveActivity}
                onChange={(e) => update('moveActivity', e.currentTarget.value)}
              />
              <NumberInput
                label="Duration (minutes)"
                value={form.moveDuration ?? ''}
                min={0}
                max={600}
                onChange={(v) =>
                  update('moveDuration', typeof v === 'number' ? v : null)
                }
              />
            </Group>
            <Box>
              <Text c="sage.8" fz="sm" fw={500} mb={6}>
                Intensity
              </Text>
              <ChipSingle
                options={MOVE_INTENSITY}
                value={form.moveIntensity}
                onChange={(v) => update('moveIntensity', v)}
              />
            </Box>
            <Group grow>
              <Box>
                <Text c="sage.8" fz="sm" fw={500} mb={6}>
                  During
                </Text>
                <ChipSingle
                  options={MOVE_DURING}
                  value={form.moveDuring}
                  onChange={(v) => update('moveDuring', v)}
                />
              </Box>
              <Box>
                <Text c="sage.8" fz="sm" fw={500} mb={6}>
                  After
                </Text>
                <ChipSingle
                  options={MOVE_AFTER}
                  value={form.moveAfter}
                  onChange={(v) => update('moveAfter', v)}
                />
              </Box>
            </Group>
          </Stack>
        </SectionCard>

        <SectionCard index={9} title="Mind & Emotional Health" icon="🧘‍♀️">
          <Stack gap="md">
            <Box>
              <Text c="sage.8" fz="sm" fw={500} mb={6}>
                Today I practiced
              </Text>
              <ChipMulti
                options={PRACTICES}
                value={form.todayPracticed}
                onChange={(v) => update('todayPracticed', v)}
              />
            </Box>
            <Box>
              <Text c="sage.8" fz="sm" fw={500} mb={6}>
                My mind feels
              </Text>
              <ChipSingle
                options={MIND_FEEL}
                value={form.mindFeel}
                onChange={(v) => update('mindFeel', v)}
              />
            </Box>
            <Textarea
              label="What stressed me"
              autosize
              minRows={2}
              value={form.stressedBy}
              onChange={(e) => update('stressedBy', e.currentTarget.value)}
            />
            <Textarea
              label="What supported me"
              autosize
              minRows={2}
              value={form.supportedBy}
              onChange={(e) => update('supportedBy', e.currentTarget.value)}
            />
          </Stack>
        </SectionCard>

        <SectionCard index={10} title="Self-Care" icon="🛁">
          <ChipMulti
            options={SELF_CARE_OPTIONS}
            value={form.selfCare}
            onChange={(v) => update('selfCare', v)}
            color="blush.5"
          />
        </SectionCard>

        <SectionCard index={11} title="Reflection" icon="✿">
          <Stack gap="md">
            <Textarea
              label="One thing I am grateful for today"
              autosize
              minRows={2}
              placeholder="The light through the window, the second cup of tea…"
              value={form.gratitude}
              onChange={(e) => update('gratitude', e.currentTarget.value)}
            />
            <Textarea
              label="One thing I am proud of today"
              autosize
              minRows={2}
              value={form.proudOf}
              onChange={(e) => update('proudOf', e.currentTarget.value)}
            />
            <Textarea
              label="Other notes / how my body responded"
              autosize
              minRows={3}
              value={form.notes}
              onChange={(e) => update('notes', e.currentTarget.value)}
            />
          </Stack>
        </SectionCard>

        <Divider color="sage.2" my="md" />

        {/* Inline save for desktop */}
        <Box hiddenFrom="sm">
          <Text c="sage.6" fz="xs" ta="center" mb="xs">
            Drafts auto-save every 30 s
          </Text>
        </Box>
        <Button
          size="lg"
          radius="xl"
          loading={saving}
          onClick={save}
          fullWidth
          variant="gradient"
          gradient={{ from: 'sage.5', to: 'sage.7', deg: 135 }}
          styles={{
            root: { height: 56, fontSize: 16 },
            label: { letterSpacing: 0.5 },
          }}
        >
          Save today&apos;s entry
        </Button>
        <Text c="sage.6" fz="xs" ta="center" hiddenFrom="sm" style={{ paddingBottom: 72 }}>
          {/* Extra bottom padding so sticky footer doesn't overlap last card */}
        </Text>
        <Text c="sage.6" fz="xs" ta="center" visibleFrom="sm">
          Drafts auto-save every 30 seconds. Saved entries land on your dashboard.
        </Text>
      </Stack>

      {/* Sticky save button on mobile */}
      <Box
        hiddenFrom="sm"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          padding: '12px 16px 20px',
          background: 'rgba(245,240,234,0.95)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(122,158,126,0.15)',
        }}
      >
        <Button
          size="lg"
          radius="xl"
          loading={saving}
          onClick={save}
          fullWidth
          variant="gradient"
          gradient={{ from: 'sage.5', to: 'sage.7', deg: 135 }}
          styles={{
            root: { height: 52, fontSize: 15 },
          }}
        >
          Save entry
        </Button>
      </Box>
    </Container>
  );
}
