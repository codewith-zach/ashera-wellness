import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { readJsonObject, badRequest, validationError } from '@/lib/api';
import { monthlySetupSchema } from '@/lib/validations/monthly';
import { toMonthlyDb, toMonthlyView } from '@/lib/monthly-mapper';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const user = await requireUser();
  const json = await readJsonObject(req);
  if (!json.ok) return badRequest('Invalid JSON body');
  const parsed = monthlySetupSchema.safeParse(json.body);
  if (!parsed.success) {
    return validationError('Invalid monthly setup', parsed.error);
  }
  const { monthNumber, year, month, ...rest } = parsed.data;
  const data = toMonthlyDb(rest);
  const setup = await prisma.monthlySetup.upsert({
    where: { userId_monthNumber: { userId: user.id, monthNumber } },
    create: { userId: user.id, monthNumber, year, month, ...data },
    update: { year, month, ...data },
  });
  return NextResponse.json({ setup: toMonthlyView(setup) });
}

