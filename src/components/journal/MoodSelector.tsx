'use client';

import { Group, Stack, Text, UnstyledButton } from '@mantine/core';
import { motion, useReducedMotion } from 'framer-motion';
import { MOOD_OPTIONS } from '@/lib/data/options';

interface Props {
  value: number | null | undefined;
  onChange: (mood: number, emoji: string) => void;
}

export function MoodSelector({ value, onChange }: Props) {
  const reduced = useReducedMotion();
  const selected = MOOD_OPTIONS.find((m) => m.value === value);
  return (
    <Stack gap="md">
      <Group gap="md" justify="space-between" wrap="nowrap">
        {MOOD_OPTIONS.map((m) => {
          const active = m.value === value;
          return (
            <UnstyledButton
              key={m.value}
              onClick={() => onChange(m.value, m.emoji)}
              style={{ flex: 1 }}
              aria-label={m.label}
            >
              <motion.div
                whileTap={reduced ? undefined : { scale: 0.92 }}
                animate={
                  reduced
                    ? undefined
                    : active
                      ? { scale: 1.12 }
                      : { scale: 1 }
                }
                transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 72,
                  borderRadius: 20,
                  fontSize: 36,
                  background: active
                    ? 'radial-gradient(circle, rgba(181,206,184,0.7), rgba(122,158,126,0.25))'
                    : 'rgba(221,233,222,0.4)',
                  border: active
                    ? '2px solid #7A9E7E'
                    : '2px solid transparent',
                  cursor: 'pointer',
                }}
              >
                {m.emoji}
              </motion.div>
            </UnstyledButton>
          );
        })}
      </Group>
      <Text
        c="sage.7"
        fz="sm"
        ta="center"
        fs="italic"
        ff="Playfair Display, serif"
        mih={20}
      >
        {selected ? `Today feels ${selected.label.toLowerCase()}.` : 'Tap how today feels.'}
      </Text>
    </Stack>
  );
}
