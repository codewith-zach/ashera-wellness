'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Stack, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

interface Props {
  cups: number;
  goal?: number;
  size?: number;
}

export function HydrationRing({ cups, goal = 8, size }: Props) {
  const reduced = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 36em)');
  const dim = size ?? (isMobile ? 110 : 140);
  const stroke = isMobile ? 10 : 12;
  const radius = dim / 2 - stroke;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.min(1, cups / goal);
  const offset = circumference * (1 - ratio);
  return (
    <Stack align="center" gap={6}>
      <div style={{ position: 'relative', width: dim, height: dim }}>
        <svg
          width={dim}
          height={dim}
          role="img"
          aria-label={`Hydration: ${cups} of ${goal} cups — ${Math.round(ratio * 100)}%`}
        >
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            stroke="#dde9de"
            strokeWidth={stroke}
            fill="none"
          />
          <motion.circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            stroke="#7A9E7E"
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            transform={`rotate(-90 ${dim / 2} ${dim / 2})`}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 1, ease: 'easeOut' }
            }
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text fz={isMobile ? 22 : 28} ff="Playfair Display, serif" c="sage.7" fw={500}>
            {cups}
          </Text>
          <Text fz="xs" c="sage.6">
            of {goal} cups
          </Text>
        </div>
      </div>
      <Text fz="sm" c="sage.7">
        {(cups * 250).toLocaleString()}ml today
      </Text>
    </Stack>
  );
}
