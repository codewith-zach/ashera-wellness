'use client';

import { Card, Group, Stack, Text, Title } from '@mantine/core';
import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  index: number | string;
  title: string;
  hint?: string;
  icon?: string;
  children: ReactNode;
}

export function SectionCard({ index, title, hint, icon, children }: Props) {
  const reduced = useReducedMotion();
  const Wrapper = reduced ? 'div' : motion.div;
  return (
    <Wrapper
      {...(reduced
        ? {}
        : {
            initial: { opacity: 0, y: 24 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: '-50px' },
            transition: { duration: 0.5, ease: 'easeOut' },
          })}
    >
      <Card
        radius="lg"
        shadow="sm"
        p={{ base: 'md', sm: 'lg' }}
        style={{
          background: 'rgba(255,255,255,0.85)',
          border: '1px solid rgba(122,158,126,0.10)',
        }}
      >
        <Stack gap="md">
          <Group gap={10} align="flex-end" wrap="nowrap">
            <Text
              fz="xs"
              c="sage.6"
              tt="uppercase"
              lts={2}
              style={{ minWidth: 28, flexShrink: 0 }}
            >
              {String(index).padStart(2, '0')}
            </Text>
            {icon && <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>}
            <Title
              order={3}
              ff="Playfair Display, serif"
              c="sage.7"
              fw={500}
              fz={{ base: 19, sm: 22 }}
              lh={1.2}
              style={{ minWidth: 0 }}
            >
              {title}
            </Title>
          </Group>
          {hint && (
            <Text c="sage.7" fz="sm" fs="italic" mt={-8}>
              {hint}
            </Text>
          )}
          {children}
        </Stack>
      </Card>
    </Wrapper>
  );
}
