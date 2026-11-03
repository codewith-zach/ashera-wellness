import { JournalForm } from '@/components/journal/JournalForm';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { toView } from '@/lib/entry-mapper';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function JournalForDate({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();
  const user = await requireUser();
  const entry = await prisma.dailyEntry.findUnique({
    where: { userId_date: { userId: user.id, date } },
  });
  return <JournalForm date={date} initialEntry={entry ? toView(entry) : null} />;
}
