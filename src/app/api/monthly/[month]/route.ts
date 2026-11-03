import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { monthlySetupSchema } from '@/lib/validations/monthly';
import { toMonthlyDb, toMonthlyView } from '@/lib/monthly-mapper';

export const dynamic = 'force-dynamic';

function parseMonth(value: string) {
  const n = parseInt(value, 10);
  if (!Number.isFinite(n) || n < 1 || n > 11) return null;
  return n;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { month: string } },
) {
  const user = await requireUser();
  const monthNumber = parseMonth(params.month);
  if (!monthNumber) return NextResponse.json({ setup: null }, { status: 400 });
  const setup = await prisma.monthlySetup.findUnique({
    where: { userId_monthNumber: { userId: user.id, monthNumber } },
  });
  return NextResponse.json({ setup: setup ? toMonthlyView(setup) : null });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { month: string } },
) {
  const user = await requireUser();
  const monthNumber = parseMonth(params.month);
  if (!monthNumber)
    return NextResponse.json({ error: 'Bad month' }, { status: 400 });
  const body = await req.json();
  const parsed = monthlySetupSchema.partial().safeParse({ ...body, monthNumber });
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { monthNumber: _ignored, ...rest } = parsed.data;
  const data = toMonthlyDb(rest);
  const setup = await prisma.monthlySetup.update({
    where: { userId_monthNumber: { userId: user.id, monthNumber } },
    data,
  });
  return NextResponse.json({ setup: toMonthlyView(setup) });
}
