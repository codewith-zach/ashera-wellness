import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { readJsonObject, badRequest, validationError } from '@/lib/api';
import { dailyEntrySchema } from '@/lib/validations/entry';
import { toView, toDbWrite } from '@/lib/entry-mapper';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ date: string }> },
) {
  const { date } = await params;
  const user = await requireUser();
  const entry = await prisma.dailyEntry.findUnique({
    where: { userId_date: { userId: user.id, date } },
  });
  return NextResponse.json({ entry: entry ? toView(entry) : null });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ date: string }> },
) {
  const { date } = await params;
  const user = await requireUser();
  const json = await readJsonObject(req);
  if (!json.ok) return badRequest('Invalid JSON body');
  const parsed = dailyEntrySchema.partial().safeParse({
    ...json.body,
    date,
  });
  if (!parsed.success) {
    return validationError('Invalid entry', parsed.error);
  }
  const { date: _ignored, ...rest } = parsed.data;
  const data = toDbWrite(rest);
  const entry = await prisma.dailyEntry.update({
    where: { userId_date: { userId: user.id, date } },
    data,
  });
  return NextResponse.json({ entry: toView(entry) });
}
