'use client';

import { Button, Stack, Text } from '@mantine/core';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Milestone } from '@/lib/milestones';

interface Props {
  milestone: Milestone | null;
  onDismiss: () => void;
}

export function MilestoneCelebration({ milestone, onDismiss }: Props) {
  const reduced = useReducedMotion();

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
            Array.from({ length: 18 }).map((_, i) => {
              const left = Math.random() * 100;
              const dy = Math.random() * 200 + 100;
              return (
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
                    y: dy,
                    x: (Math.random() - 0.5) * 200,
                    rotate: Math.random() * 720,
                    scale: [0.6, 1, 0.9],
                  }}
                  transition={{
                    duration: 4 + Math.random(),
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: 'easeOut',
                  }}
                  style={{
                    position: 'absolute',
                    top: '15%',
                    left: `${left}%`,
                    fontSize: 22 + Math.random() * 14,
                    pointerEvents: 'none',
                  }}
                >
                  {['🌸', '🌿', '✿', '🌼'][i % 4]}
                </motion.div>
              );
            })}

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
