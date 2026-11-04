import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  readJsonObject,
  badRequest,
  validationError,
  tooManyRequests,
} from '@/lib/api';
import { createSession, hashPassword, SESSION_COOKIE } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { signupSchema } from '@/lib/validations/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  const limiter = rateLimit(`signup:${ip}`, 5);
  if (!limiter.allowed) return tooManyRequests(limiter.retryAfterSec);

  const json = await readJsonObject(req);
  if (!json.ok) return badRequest('Invalid JSON body');
  const parsed = signupSchema.safeParse(json.body);
  if (!parsed.success) {
    return validationError('Invalid signup details', parsed.error);
  }
  const { displayName, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: 'An account with this email already exists.' },
      { status: 409 },
    );
  }

  const user = await prisma.user.create({
    data: {
      email,
      displayName,
      passwordHash: hashPassword(password),
      journalStartDate: new Date(),
    },
  });

  const { token, expiresAt } = await createSession(user.id);
  const res = NextResponse.json({
    ok: true,
    onboarded: false,
  });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
  return res;
}
