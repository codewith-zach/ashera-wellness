import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  readJsonObject,
  badRequest,
  validationError,
  tooManyRequests,
} from '@/lib/api';
import { createSession, verifyPassword, SESSION_COOKIE } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { loginSchema } from '@/lib/validations/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  const limiter = rateLimit(`login:${ip}`, 10);
  if (!limiter.allowed) return tooManyRequests(limiter.retryAfterSec);

  const json = await readJsonObject(req);
  if (!json.ok) return badRequest('Invalid JSON body');
  const parsed = loginSchema.safeParse(json.body);
  if (!parsed.success) {
    return validationError('Invalid login details', parsed.error);
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });

  // Same error for unknown email and wrong password — no account enumeration.
  if (!user?.passwordHash || !verifyPassword(password, user.passwordHash)) {
    // Burn a little time so the not-found path matches the scrypt cost.
    verifyPassword(password, '00:00');
    return NextResponse.json(
      { error: 'Incorrect email or password.' },
      { status: 401 },
    );
  }

  const { token, expiresAt } = await createSession(user.id);
  const res = NextResponse.json({
    ok: true,
    onboarded: Boolean(user.onboardedAt),
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
