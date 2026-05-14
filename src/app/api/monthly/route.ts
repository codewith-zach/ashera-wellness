import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { monthlySetupSchema } from '@/lib/validations/monthly';
import { toMonthlyDb, toMonthlyView } from '@/lib/monthly-mapper';

export async function POST(req: NextRequest) {
  const user = await requireUser();
  const body = await req.json();
  const parsed = monthlySetupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { monthNumber, ...rest } = parsed.data;
  const data = toMonthlyDb(rest);
  const setup = await prisma.monthlySetup.upsert({
    where: { userId_monthNumber: { userId: user.id, monthNumber } },
    create: { userId: user.id, monthNumber, ...data },
    update: data,
  });
  return NextResponse.json({ setup: toMonthlyView(setup) });
}

export async function GET() {
  const user = await requireUser();
  const setups = await prisma.monthlySetup.findMany({
    where: { userId: user.id },
    orderBy: { monthNumber: 'asc' },
  });
  return NextResponse.json({ setups: setups.map(toMonthlyView) });
}
