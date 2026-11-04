'use client';

import { Button, Stack, Text } from '@mantine/core';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import type { Milestone } from '@/lib/milestones';

const PETAL_EMOJIS = ['🌸', '🌿', '✿', '🌼'];

interface FloatingPetal {
  left: number;
  dy: number;
  dx: number;
  rotate: number;
  duration: number;
  delay: number;
  fontSize: number;
  emojiIndex: number;
}

function buildFloatingPetals(count: number): FloatingPetal[] {
  return Array.from({ length: count }, (_, i) => ({
    left: Math.random() * 100,
    dy: Math.random() * 200 + 100,
    dx: (Math.random() - 0.5) * 200,
    rotate: Math.random() * 720,
    duration: 4 + Math.random(),
    delay: Math.random() * 2,
    fontSize: 22 + Math.random() * 14,
    emojiIndex: i % PETAL_EMOJIS.length,
  }));
}

interface Props {
  milestone: Milestone | null;
  onDismiss: () => void;
}

export function MilestoneCelebration({ milestone, onDismiss }: Props) {
  const reduced = useReducedMotion();
  // Random petal geometry is generated once per mount in a lazy initializer —
  // impure calls there don't run during render.
  const [petals] = useState(() => buildFloatingPetals(18));

  return (
    <AnimatePresence>
      {milestone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background:
              'radial-gradient(circle at 50% 30%, rgba(245,240,234,0.96) 0%, rgba(122,158,126,0.85) 80%)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
          onClick={onDismiss}
        >
          {/* Background petals */}
          {!reduced &&
            petals.map((p, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  y: 0,
                  x: 0,
                  rotate: 0,
                  scale: 0.6,
                }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: p.dy,
                  x: p.dx,
                  rotate: p.rotate,
                  scale: [0.6, 1, 0.9],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: 'easeOut',
                }}
                style={{
                  position: 'absolute',
                  top: '15%',
                  left: `${p.left}%`,
                  fontSize: p.fontSize,
                  pointerEvents: 'none',
                }}
              >
                {PETAL_EMOJIS[p.emojiIndex]}
              </motion.div>
            ))}

          <motion.div
            initial={{ scale: 0.7, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Stack
              align="center"
              gap="md"
              p="xl"
              maw={520}
              className="milestone-card"
              style={{
                background: 'rgba(255,255,255,0.96)',
                borderRadius: 28,
                boxShadow: '0 12px 60px rgba(122,158,126,0.30)',
                textAlign: 'center',
              }}
            >
              <motion.div
                initial={{ scale: 0.4, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 14,
                  delay: 0.15,
                }}
                style={{ fontSize: 72, lineHeight: 1 }}
              >
                {milestone.emoji}
              </motion.div>
              <Text
                fz="xs"
                c="sage.6"
                tt="uppercase"
                lts={4}
                ff="DM Sans, sans-serif"
              >
                {milestone.days}-day milestone
              </Text>
              <Text
                fz={36}
                c="sage.7"
                ff="Playfair Display, serif"
                fw={500}
                lh={1.1}
              >
                {milestone.title}
              </Text>
              <Text c="sage.8" maw={420} ff="Playfair Display, serif" fs="italic">
                “{milestone.message}”
              </Text>
              <Button
                mt="md"
                radius="xl"
                size="lg"
                variant="gradient"
                gradient={{ from: 'sage.5', to: 'sage.7', deg: 135 }}
                onClick={onDismiss}
              >
                Carry it forward
              </Button>
            </Stack>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
