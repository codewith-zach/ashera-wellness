'use client';

import { Box, Stack, Text, UnstyledButton } from '@mantine/core';
import { motion, useReducedMotion } from 'framer-motion';

interface Props {
  value: number;
  onChange: (cups: number) => void;
  goal?: number;
}

export function WaterCups({ value, onChange, goal = 8 }: Props) {
  const reduced = useReducedMotion();
  return (
    <Stack gap="xs">
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${goal}, 1fr)`,
          gap: 8,
          width: '100%',
        }}
      >
        {Array.from({ length: goal }).map((_, i) => {
          const filled = i < value;
          return (
            <UnstyledButton
              key={i}
              onClick={() => onChange(i + 1 === value ? i : i + 1)}
              aria-label={`Set hydration to ${i + 1} cup${i === 0 ? '' : 's'}`}
              aria-pressed={filled}
              style={{
                width: '100%',
                aspectRatio: '0.7',
                minHeight: 44,
                borderRadius: '8px 8px 14px 14px',
                border: '2px solid #7A9E7E',
                background: 'var(--ashera-empty)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
            >
              <motion.div
                initial={false}
                animate={{ scaleY: filled ? 1 : 0 }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 220, damping: 20 }
                }
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '100%',
                  background:
                    'linear-gradient(180deg, rgba(184,174,212,0.65), rgba(122,158,126,0.85))',
                  transformOrigin: 'bottom',
                }}
              />
            </UnstyledButton>
          );
        })}
      </Box>
      <Text c="sage.7" fz="sm">
        {value * 250}ml of {goal * 250}ml
      </Text>
    </Stack>
  );
}
