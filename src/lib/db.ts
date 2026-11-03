import { PrismaClient } from '@prisma/client';

if (
  process.env.NODE_ENV === 'production' &&
  process.env.NEXT_PHASE !== 'phase-production-build' &&
  process.env.DATABASE_URL?.startsWith('file:')
) {
  throw new Error('SQLite DATABASE_URL is not allowed in production. Configure Postgres before deploying.');
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
