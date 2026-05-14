'use client';

import { Card, Group, Stack, Text, Title } from '@mantine/core';
import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  title: string;
  hint?: string;
  emoji?: string;
  right?: ReactNode;
  children: ReactNode;
}

export function ChartCard({ title, hint, emoji, right, children }: Props) {
  const reduced = useReducedMotion();
  const Wrapper = reduced ? 'div' : motion.div;
  return (
    <Wrapper
      {...(reduced
        ? {}
        : {
            initial: { opacity: 0, y: 18 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: '-40px' },
            transition: { duration: 0.5, ease: 'easeOut' },
          })}
    >
      <Card
        radius="lg"
        shadow="sm"
        p="lg"
        style={{
          background: 'rgba(255,255,255,0.88)',
          border: '1px solid rgba(122,158,126,0.10)',
        }}
      >
        <Stack gap="md">
          <Group justify="space-between" align="flex-end">
            <Stack gap={0}>
              <Group gap={6} align="baseline">
                {emoji && <span style={{ fontSize: 18 }}>{emoji}</span>}
                <Title
                  order={4}
                  ff="Playfair Display, serif"
                  c="sage.7"
                  fw={500}
                >
                  {title}
                </Title>
              </Group>
              {hint && (
                <Text fz="xs" c="sage.6">
                  {hint}
                </Text>
              )}
            </Stack>
            {right}
          </Group>
          {children}
        </Stack>
      </Card>
    </Wrapper>
  );
}
