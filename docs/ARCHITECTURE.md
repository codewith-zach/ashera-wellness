# Architecture

One page explaining how Ashe Ra is built and why.

## Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) | Server components by default |
| UI | React 19 · Mantine 7 · Framer Motion 11 | Playfair Display + DM Sans brand fonts |
| Charts | Recharts 2 | Lazy-loaded per chart (see below) |
| Data | Prisma 5 + PostgreSQL | One schema, JSON-encoded arrays |
| Validation | Zod 4 | Every write endpoint, shared bounds |
| Auth | Self-hosted sessions | scrypt + DB sessions, no external service |
| Tests | Vitest 5 | Pure-logic unit tests in `src/lib` |
| Lint | ESLint 9 flat config | `eslint-config-next` |

## The one rule that shapes everything

**Reads happen in server components; writes happen through API routes.**

- Pages (`/dashboard`, `/insights`, `/history`, …) are async server
  components that query Prisma directly. No GraphQL, no client data layer
  for reads — the data is already there when the HTML renders.
- The few things a browser must do mid-session (save a journal entry, log
  in, change reminder settings, poll the streak badge, fetch AI callouts,
  export data) go through the small JSON API in `src/app/api/`.

This is why the API surface stays tiny (~13 endpoints) and why there are no
duplicate data paths.

## Directory map

```
src/
  app/
    (app)/            Authenticated shell: dashboard, journal, insights,
                      history, weekly, monthly, profile, coach, admin
    login/ signup/    Auth pages (outside the shell)
    onboarding/       4-step wizard (outside the shell)
    api/              Write surface — see docs/API.md
  components/
    auth/             Shared login/signup card
    journal/          JournalForm + section primitives (MoodSelector,
                      ChipMulti, WaterCups, SleepSlider, …)
    charts/           Recharts wrappers + lazy.tsx (dynamic chunks)
    dashboard/ history/ insights/ monthly/ weekly/ profile/ coach/
    layout/           AppShellClient (nav, streak badge, sign-out)
    milestones/       Celebration overlay
    pwa/              Service-worker registration
    ui/               Link wrappers (Mantine-as-Link, client boundary)
  lib/
    auth.ts           Sessions, password hashing, requireUser()
    db.ts             Prisma singleton (rejects SQLite in production)
    api.ts            readJsonObject / badRequest / unauthorized / …
    rate-limit.ts     In-memory sliding window
    entry-mapper.ts   DailyEntry ↔ view (JSON arrays ↔ real arrays)
    monthly-mapper.ts monthly/weekly mappers
    milestones.ts     Streak milestone definitions + detection
    ai/               ZhipuAI client + prompts
    email/            Resend sender (dry-runs without key) + templates
    insights/         Rule-based fallback callouts
    validations/      Zod schemas, one file per domain + shared bounds
    utils/            date, period, streak, json-array, time (timezone)
    data/             Chip options, month themes, affirmations
  theme/              Mantine theme tokens (sage palette)
prisma/schema.prisma  Data model
scripts/              seed / seed-coach / gen-icons + shared lib
public/sw.js          Hand-rolled service worker (tracked source, not built)
```

## Data model

Six domain tables plus `Session`:

| Model | Key facts |
| --- | --- |
| `User` | email (unique), passwordHash, role (`client`/`coach`/`admin`), coachId self-relation, timezone, reminder settings, milestones (JSON) |
| `Session` | id = SHA-256 of the cookie token, userId, expiresAt (30 days) |
| `DailyEntry` | one per user per date (`@@unique([userId, date])`); 11 journal sections |
| `WeeklyReview` | one per user per week number (1–44) |
| `MonthlySetup` | one per user per month number (1–11) |
| `Onboarding` | one per user |
| `AiInsightCache` | one per user/date/section — AI callouts regenerate once a day |

**JSON-array convention:** multi-select fields (symptoms, selfCare,
painAreas, …) are stored as JSON-encoded text columns. `packArr` /
`unpackArr` (`lib/utils/json-array.ts`) and the mappers are the only code
that touches this, so switching to native `String[]` later is a
single-layer change.

## Auth & sessions

```
signup/login  →  scrypt verify  →  create opaque token (32 random bytes)
              →  store SHA-256(token) in Session, expiry +30d
              →  Set-Cookie: ashera_session (httpOnly, sameSite=lax,
                 secure in production)
```

- `getCurrentUser()` — reads the cookie, resolves the session, returns
  `User | null`. Used by API routes (which answer **401** on null) and by
  pages that need a soft check.
- `requireUser()` — same, but redirects to `/login`. For server components.
- Sessions die by row deletion (logout) or expiry. Only the hash is
  stored, so a database leak does not yield usable cookies.
- Login/signup are rate-limited per IP (in-memory; see
  [Operations](./OPERATIONS.md) for the scale-out caveat).

## Roles & access

| Role | Sees |
| --- | --- |
| `client` | Own journal and everything personal |
| `coach` | Own journal **plus** `/coach` — clients who linked to them (read-only streaks, mood, sleep; tenant-scoped queries, no IDOR) |
| `admin` | Own journal **plus** `/admin` — fleet stats and a per-user table |

Clients attach themselves to a coach from the profile page (by coach
email). Coaches never see clients who didn't link to them.

## AI insight callouts

`GET /api/insights/ai?period=…` (client-side, on the Insights page):

1. If all five sections are cached for **today** → serve the cache.
2. Otherwise build prompts from the user's entries, call ZhipuAI
   (`ZAI_API_KEY`, model from `ZAI_MODEL`, default `glm-4.5-flash`).
3. Any failure — no key, timeout, bad response — falls back to the
   rule-based callouts in `lib/insights/local-callouts.ts`.
4. Results persist to `AiInsightCache` (one refresh per user per day).

The app is fully functional without any AI key.

## Background job: reminder cron

`vercel.json` schedules `POST /api/cron/reminders` hourly (Vercel sends
`Authorization: Bearer $CRON_SECRET` automatically). The handler:

- Constant-time bearer check; without a secret it only runs in local dev.
- For each opted-in user, computes "now" in **their own IANA timezone**
  (`lib/utils/time.ts`), fires at their chosen hour, checks "have they
  logged today *in their timezone*", and handles the Monday weekly prompt
  per local weekday.
- Sends via Resend when `RESEND_API_KEY` is set, otherwise dry-runs and
  logs. Responses contain counts only — never recipient addresses.

## PWA

`public/sw.js` is a hand-rolled ~70-line service worker (no build step, no
workbox): network-first for navigations with an `/offline.html` fallback,
cache-first for static assets, never caches API responses. It's registered
in production only by `components/pwa/RegisterSW.tsx`. Old workbox caches
are cleaned up on activation.

## Performance choices

- Charts are `next/dynamic` chunks with skeleton fallbacks
  (`components/charts/lazy.tsx`) — Recharts stays out of the first load.
- `optimizePackageImports` for Mantine/lucide/recharts.
- All personal pages are `force-dynamic` server rendered (personal data
  must not be cached at the edge); static shell + fonts are cached by the
  service worker instead.

## Testing

Unit tests live next to their subjects (`*.test.ts`, 49 tests) and cover
the pure logic: streak math, milestone detection, entry-mapper round-trips,
validation bounds, timezone conversion, date/period helpers, JSON-array
helpers. UI and routes are verified with the checks in
[Development](./DEVELOPMENT.md) (`typecheck`, `lint`, `build`) — no
component/E2E suite yet; adding Playwright would be the natural next step.
