import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { onboardingSchema } from '@/lib/validations/entry';
import { packArr } from '@/lib/utils/json-array';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const user = await requireUser();
  const body = await req.json();
  const parsed = onboardingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { bodyRelationship, ...rest } = parsed.data;
  const data = {
    ...rest,
    bodyRelationship: packArr(bodyRelationship),
    commitmentDate: rest.commitmentLetter ? new Date() : null,
    completedAt: new Date(),
  };
  await prisma.onboarding.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...data },
    update: data,
  });
  await prisma.user.update({
    where: { id: user.id },
    data: { onboardedAt: new Date() },
  });
  return NextResponse.json({ ok: true });
}
