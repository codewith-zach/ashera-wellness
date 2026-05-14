'use client';

import { Stack } from '@mantine/core';
import { motion } from 'framer-motion';
import { staggerContainer } from '@/components/animations/variants';
import { ClientCard } from './ClientCard';

interface Client {
  id: string;
  displayName: string | null;
  email: string;
  streak: number;
  lastEntry: string | null;
  daysSinceLastEntry: number;
  atRisk: boolean;
  totalEntries: number;
  avgMoodWeek: number | null;
  avgSleepWeek: number | null;
  entriesThisWeek: number;
}

export function CoachClientList({ clients }: { clients: Client[] }) {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <Stack gap="md">
        {clients.map((c) => (
          <ClientCard key={c.id} client={c} />
        ))}
      </Stack>
    </motion.div>
  );
}
