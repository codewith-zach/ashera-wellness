import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { journalNow } from '@/lib/utils/journal-time';
import { WeeklyForm } from '@/components/weekly/WeeklyForm';

export default async function WeeklyPage() {
  const user = await requireUser();
  const { weekNumber } = journalNow(user.journalStartDate);
  const review = await prisma.weeklyReview.findUnique({
    where: { userId_weekNumber: { userId: user.id, weekNumber } },
  });
  return <WeeklyForm weekNumber={weekNumber} initial={review} />;
}
