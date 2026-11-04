# Development guide

## Prerequisites

- Node 20.19+ (the team runs 24)
- PostgreSQL 14+ running locally (`brew services start postgresql` on macOS)
- No other services required — auth is self-hosted, AI/email degrade
  gracefully without keys

## First setup

```bash
npm install                # also runs prisma generate
createdb ashera            # once
npx prisma db push
node scripts/seed.mjs --make-admin
npm run dev
```

## Everyday commands

| Command | Use |
| --- | --- |
| `npm run dev` | Develop at `http://localhost:3000` |
| `npm run typecheck` | Fast feedback while refactoring |
| `npm run lint` | ESLint (flat config, includes React Compiler-era rules) |
| `npm test` | Unit tests — run these before every commit |
| `npm run build` | Prove the production build before deploying |
| `npm run db:studio` | Browse/edit data visually |

**Before every push:** `typecheck` + `lint` + `test` + `build` all green.

## Demo data

| Script | What it creates |
| --- | --- |
| `node scripts/seed.mjs` | Dev user + 14 days of varied entries |
| `node scripts/seed.mjs --make-admin` | …and promotes the dev user to admin |
| `node scripts/seed-coach.mjs` | Demo coach + Amara (active) + Priya (at-risk) linked to the coach |
| `node scripts/seed-coach.mjs --make-dev-coach` | …and makes the dev user a coach instead |

All demo accounts share the password `DEV_PASSWORD` (default
`ashera-dev-1`). Seeds are idempotent (upserts) — safe to re-run.

## Conventions

**Server-first.** A page that just shows data = async server component +
Prisma query. Reach for `useState`/client components only for real
interactivity (forms, charts, animations). The `(app)` layout already
handles auth + onboarding redirects for every page inside it.

**Auth in code.** Pages call `requireUser()` (redirects to `/login`).
API routes call `getCurrentUser()` and `if (!user) return unauthorized();`.

**Passing Link into Mantine.** Inside **client** components,
`component={Link}` is fine. In **server** components use the wrappers in
`components/ui/links.tsx` (`LinkButton`, `LinkCard`, `LinkAnchor`,
`LinkText`) — React 19 forbids passing component functions across the
server/client boundary.

**Validation.** Every API body is parsed with a zod schema from
`lib/validations/` (one file per domain, bounds in `common.ts`), read via
`readJsonObject(req)`, answered with `validationError(...)`.

**Mantine in server components.** Core display components (Card, Text,
Stack, Title, Badge…) are server-safe. Avoid `Table`/hook-dependent
components there — use plain HTML or a client wrapper (see `/admin` for
the pattern).

**React Compiler lint rules.** No impure calls (`Math.random`, `Date.now`)
during render — use lazy `useState` initializers or dayjs; no synchronous
`setState` in effects. One documented exception exists in `JournalForm`
(localStorage hydration).

**Randomness & dates.** Use `dayjs` for date math. User-timezone logic
goes through `lib/utils/time.ts` (`zonedParts`).

**Tests.** Colocated `*.test.ts` next to the module. Pure logic only —
streaks, mappers, validations, timezone math.

## Recipes

**Add a field to the daily journal**
1. `prisma/schema.prisma` → add the column (arrays stay `String @default("[]")`), then `npm run db:push`.
2. `lib/validations/entry.ts` → add to `dailyEntrySchema` (use bounds from `common.ts`).
3. `lib/entry-mapper.ts` → for array fields, add to `ARRAY_FIELDS`.
4. UI: add the input to `components/journal/JournalForm.tsx` (primitives in `components/journal/`), options in `lib/data/options.ts`.

**Add a page** — create `src/app/(app)/your-page/page.tsx` as an async
server component calling `requireUser()`; the shell, nav, and auth come
free. Add nav entry in `components/layout/AppShellClient.tsx` (note the
`coachOnly`/`adminOnly` flags).

**Add an API route** — only if a browser must write/poll. Follow an
existing route: `getCurrentUser` → 401 → `readJsonObject` → zod → Prisma →
JSON. Update `docs/API.md`.

**Add a chart** — Recharts wrapper in `components/charts/`, export a
`Lazy*` wrapper from `charts/lazy.tsx`, use inside `ChartCard`.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `P1001: Can't reach database` | Is Postgres running? `pg_isready`. Does the `ashera` DB exist? `createdb ashera` |
| `Cannot find native binding` (rolldown/vitest) | Known npm optional-deps bug: `rm -rf node_modules package-lock.json && npm install`. A platform binding is pinned as a devDependency to prevent this |
| Type errors in `.next/types` after deleting routes | `rm -rf .next && npm run build` (stale generated types) |
| Stale service worker while testing | Dev registers nothing; production SW can be unregistered from DevTools → Application → Service Workers |
| Login button does nothing in an embedded webview | Synthetic clicks sometimes miss React handlers — test in a normal browser |
