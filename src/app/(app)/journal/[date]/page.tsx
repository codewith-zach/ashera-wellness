import { JournalForm } from '@/components/journal/JournalForm';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { toView } from '@/lib/entry-mapper';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function JournalForDate({
  params,
}: {
  params: { date: string };
}) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(params.date)) notFound();
  const user = await requireUser();
  const entry = await prisma.dailyEntry.findUnique({
    where: { userId_date: { userId: user.id, date: params.date } },
  });
  return <JournalForm date={params.date} initialEntry={entry ? toView(entry) : null} />;
}
