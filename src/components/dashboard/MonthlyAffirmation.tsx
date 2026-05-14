'use client';

import { Card, Group, Stack, Text } from '@mantine/core';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

interface Props {
  monthNumber: number;
  theme: string;
  affirmation: string;
  isCustomized: boolean;
}

export function MonthlyAffirmation({
  monthNumber,
  theme,
  affirmation,
  isCustomized,
}: Props) {
  const reduced = useReducedMotion();
  const Wrapper = reduced ? 'div' : motion.div;
  return (
    <Wrapper
      {...(reduced
        ? {}
        : {
            initial: { opacity: 0, y: 14 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6, ease: 'easeOut', delay: 0.1 },
          })}
    >
      <Card
        radius="lg"
        p={{ base: 'md', sm: 'lg' }}
        style={{
          background:
            'linear-gradient(135deg, rgba(184,174,212,0.18), rgba(122,158,126,0.16))',
          border: '1px solid rgba(122,158,126,0.16)',
        }}
      >
        <Stack gap={8}>
          <Group justify="space-between" align="flex-start" wrap="wrap" gap="xs">
            <Text fz="xs" c="sage.6" tt="uppercase" lts={2} lineClamp={2}>
              Month {monthNumber} · {theme}
            </Text>
            {!isCustomized && (
              <Text
                component={Link}
                href="/monthly"
                fz="xs"
                c="sage.6"
                style={{ textDecoration: 'underline', whiteSpace: 'nowrap' }}
              >
                Set your month →
              </Text>
            )}
          </Group>
          <Text
            c="sage.8"
            ff="Playfair Display, serif"
            fs="italic"
            fz={{ base: 'md', sm: 'lg' }}
            lh={1.5}
          >
            &ldquo;{affirmation}&rdquo;
          </Text>
        </Stack>
      </Card>
    </Wrapper>
  );
}
