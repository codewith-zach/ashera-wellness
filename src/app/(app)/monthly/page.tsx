import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { toMonthlyView } from '@/lib/monthly-mapper';
import { journalNow } from '@/lib/utils/journal-time';
import { MonthlyWizard } from '@/components/monthly/MonthlyWizard';

export const dynamic = 'force-dynamic';

export default async function MonthlyPage() {
  const user = await requireUser();
  const { monthNumber, monthYear, monthCalendar } = journalNow(user.journalStartDate);
  const setup = await prisma.monthlySetup.findUnique({
    where: { userId_monthNumber: { userId: user.id, monthNumber } },
  });
  return (
    <MonthlyWizard
      monthNumber={monthNumber}
      year={monthYear}
      month={monthCalendar}
      setup={setup ? toMonthlyView(setup) : null}
    />
  );
}
