import { JournalForm } from '@/components/journal/JournalForm';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { toView } from '@/lib/entry-mapper';
import { todayISO } from '@/lib/utils/date';

export default async function JournalToday() {
  const user = await requireUser();
  const date = todayISO();
  const entry = await prisma.dailyEntry.findUnique({
    where: { userId_date: { userId: user.id, date } },
  });
  return <JournalForm date={date} initialEntry={entry ? toView(entry) : null} />;
}
