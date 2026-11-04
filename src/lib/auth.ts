import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from './db';

export const SESSION_COOKIE = 'ashera_session';
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

// --- Passwords (scrypt via node:crypto — no external dependencies) ---

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  return (
    candidate.length === expected.length && timingSafeEqual(candidate, expected)
  );
}

// --- Sessions (opaque token in an httpOnly cookie; only its hash is stored) ---

function tokenId(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function createSession(userId: string): Promise<{
  token: string;
  expiresAt: Date;
}> {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await prisma.session.create({
    data: { id: tokenId(token), userId, expiresAt },
  });
  return { token, expiresAt };
}

export async function deleteSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return;
  await prisma.session
    .delete({ where: { id: tokenId(token) } })
    .catch(() => undefined);
}

/**
 * The signed-in user, or null when there is no valid session. Returns the
 * same shape the old dev stub did (onboarding relation included).
 */
export async function getCurrentUser() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { id: tokenId(token) },
    include: { user: { include: { onboarding: true } } },
  });
  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await prisma.session
      .delete({ where: { id: session.id } })
      .catch(() => undefined);
    return null;
  }
  return session.user;
}

/**
 * Server-component guard: redirects to /login without a session.
 * API routes should use getCurrentUser() and answer 401 instead.
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}
