import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { readJsonObject, badRequest, unauthorized } from '@/lib/api';

export const dynamic = 'force-dynamic';

/**
 * Link the signed-in client to a coach (by the coach's account email) or
 * unlink with { coachEmail: null }.
 */
export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const json = await readJsonObject(req);
  if (!json.ok) return badRequest('Invalid JSON body');
  const { coachEmail } = json.body as { coachEmail?: string | null };

  if (coachEmail == null) {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { coachId: null },
      select: { id: true, coachId: true },
    });
    return NextResponse.json({ linked: false, coach: null, ...updated });
  }

  const email = String(coachEmail).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return badRequest('Invalid coach email');
  }

  const coach = await prisma.user.findUnique({ where: { email } });
  if (!coach || coach.role !== 'coach') {
    return NextResponse.json(
      { error: 'No coach account found with that email.' },
      { status: 404 },
    );
  }
  if (coach.id === user.id) {
    return badRequest('You cannot link to yourself');
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { coachId: coach.id },
    select: {
      id: true,
      coachId: true,
      coach: { select: { displayName: true, email: true } },
    },
  });
  return NextResponse.json({ linked: true, coach: updated.coach });
}
