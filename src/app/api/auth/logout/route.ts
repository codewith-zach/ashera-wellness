import { NextResponse } from 'next/server';
import { deleteSession, SESSION_COOKIE } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  await deleteSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
