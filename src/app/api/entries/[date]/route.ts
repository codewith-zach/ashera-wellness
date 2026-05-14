import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { dailyEntrySchema } from '@/lib/validations/entry';
import { toView, toDbWrite } from '@/lib/entry-mapper';

export async function GET(
  _req: NextRequest,
  { params }: { params: { date: string } },
) {
  const user = await requireUser();
  const entry = await prisma.dailyEntry.findUnique({
    where: { userId_date: { userId: user.id, date: params.date } },
  });
  return NextResponse.json({ entry: entry ? toView(entry) : null });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { date: string } },
) {
  const user = await requireUser();
  const body = await req.json();
  const parsed = dailyEntrySchema.partial().safeParse({
    ...body,
    date: params.date,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid entry', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { date: _ignored, ...rest } = parsed.data;
  const data = toDbWrite(rest);
  const entry = await prisma.dailyEntry.update({
    where: { userId_date: { userId: user.id, date: params.date } },
    data,
  });
  return NextResponse.json({ entry: toView(entry) });
}
