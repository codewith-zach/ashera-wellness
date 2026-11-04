# Operations

Running Ashe Ra in production — environment, deployment, cron, security.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | **yes** | PostgreSQL connection string (Supabase / Neon / RDS / self-hosted) |
| `ZAI_API_KEY` | no | Enables AI insight callouts (ZhipuAI). Without it: rule-based fallback |
| `ZAI_MODEL` | no | Model override (default `glm-4.5-flash`) |
| `RESEND_API_KEY` | no | Enables real reminder emails. Without it the cron dry-runs and logs |
| `RESEND_FROM` | no | Verified Resend sender, e.g. `Ashe Ra <hello@yourdomain.com>` |
| `CRON_SECRET` | no* | Bearer token protecting `/api/cron/reminders`. *Required in production if the endpoint should do anything; without it the endpoint refuses to run outside local dev |
| `NEXT_PUBLIC_APP_URL` | no | Absolute URL used in email links |
| `DEV_PASSWORD` | seeds only | Password for demo accounts (default `ashera-dev-1`) |

`.env.example` mirrors this list.

## Deploying (Vercel + managed Postgres)

1. **Database** — create a PostgreSQL instance (Supabase/Neon/RDS), copy
   the connection string, and initialise the schema once:
   `DATABASE_URL="postgres://…" npx prisma db push`
2. **Vercel** — import the repo; set `DATABASE_URL` plus whichever
   optional keys you want. Build defaults need no configuration.
3. **Cron** — already wired: `vercel.json` runs
   `POST /api/cron/reminders` hourly. Set `CRON_SECRET` (any long random
   string) and Vercel attaches `Authorization: Bearer $CRON_SECRET`
   automatically.
4. **Email** — verify a sender domain in Resend, set `RESEND_API_KEY` +
   `RESEND_FROM` + `NEXT_PUBLIC_APP_URL`.
5. **First admin** — sign up normally, then promote from a SQL console:
   ```sql
   UPDATE "User" SET role = 'admin' WHERE email = 'you@example.com';
   ```

Other platforms work too — it's a standard Next.js app; just schedule the
hourly cron POST yourself.

## Day-to-day

- **Inspect data**: `npm run db:studio` (point `DATABASE_URL` at prod for
  a read-only look — carefully).
- **Backups**: standard `pg_dump` / provider snapshots. All state lives in
  the one database — there are no files to back up.
- **Schema changes**: additive columns → `prisma db push` is fine. For a
  live database with users, prefer `prisma migrate dev` + `migrate deploy`
  so changes are reviewable and reversible.
- **Signing everyone out** (incident response):
  `TRUNCATE "Session";` — cookies become invalid instantly.
- **Disable a user**: there is no ban flag yet; set
  `passwordHash = NULL` and truncate their sessions to block logins while
  keeping their data.

## Security notes

- **Sessions**: 30-day httpOnly cookies; only SHA-256 hashes stored;
  deletion = revocation. No email verification or password reset exists
  yet — the recovery story today is an operator resetting a password via
  a script (ask, or use `scripts/lib.mjs`'s `hashPassword`).
- **Rate limiting** on login/signup is **in-memory, per instance**. Fine
  for a single server; before scaling horizontally swap
  `lib/rate-limit.ts` for a shared store (Upstash/Redis) — it's one small
  module behind a single call site per route.
- **Headers**: `nosniff`, `DENY` framing, strict referrer policy and a
  restrictive permissions policy are set in `next.config.mjs`. No CSP yet
  (Next needs per-deployment nonce decisions).
- **Cron**: constant-time bearer check, fails closed outside development,
  counts-only responses.
- **Exports**: CSV is formula-injection safe; data is always scoped to the
  requesting user. Coach queries are tenant-scoped (`coachId`), so client
  IDs can't be guessed.

## Health checks

- `GET /` → 307 to `/login` when the app and database are healthy
  (the redirect itself proves SSR + DB auth queries work).
- `POST /api/cron/reminders` with the correct bearer → `200 {fired,…}` —
  a full cron + DB + email-config smoke test in one request.
