# Ashe Ra Wellness Journal

Phase-1 → Phase-3 implementation of the [Ashe Ra Wellness Journal PRD](./Ashe_Ra_Wellness_Journal_PRD.pdf).

A warm, sage-toned digital companion to the printed wellness journal — daily entries, streak tracking, and the foundations for the dashboard, insights, and weekly/monthly cadences.

## What's in this slice

- **Stack**: Next.js 16 (App Router, Turbopack) · React 19 · TypeScript strict · Mantine v7 · Framer Motion · Prisma · Lucide icons · React Query
- **Brand theme** (PRD §2): sage palette, Playfair Display + DM Sans, sage-tinted shadows, rounded radii
- **Schema** (PRD §4): full `User` / `DailyEntry` / `MonthlySetup` / `WeeklyReview` / `Onboarding` models — pointed at SQLite for local dev (string-array fields are JSON-packed for portability)
- **Onboarding wizard** (PRD §6.1): 4 steps — welcome, 11-month healing intention, commitment letter, nervous-system baseline
- **Daily journal** (PRD §6.3): all 11 sections (mood, body, sleep, nutrition, gut, symptoms, hormone/cycle, movement, mind, self-care, reflection) with chip multi-selects, sliders, animated water cup tap UI, mood emoji selector with bounce, autosave drafts every 30s, petal-confetti on save
- **Dashboard** (PRD §6.2): time-based greeting, daily affirmation, stats bar, today's status card with hydration ring + completion summary, 30-day check-in heatmap, **7-day mood sparkline / energy-vs-stress / sleep bar charts** (Recharts, animate on mount)
- **Insights page** (PRD §6.6): summary stats with `CountUp` animations, period selector (7/14/30/90/all), mood journey, energy & stress, sleep bar, sleep quality doughnut, symptom heatmap, top symptoms, self-care donut. Callouts come from ZhipuAI (`ZAI_API_KEY`, model configurable via `ZAI_MODEL`) with a rule-based local fallback when the key is missing or the call fails.
- **Advanced insights**: mood-vs-sleep correlation scatter, monthly comparison, hormone cycle phase ring, and pain body map.
- **API routes**: the app reads via server components and writes through a small JSON surface — `POST /api/{entries,monthly,weekly,onboarding}`, `PATCH /api/users/reminders`, `GET /api/insights/{streak,ai}`, `GET /api/export?format={csv,summary}`, and the cron entry point `POST /api/cron/reminders`.
- **App shell**: Mantine `AppShell` with collapsible sidebar nav, animated streak badge in the header
- **History** (PRD §6.7): paginated 20/page, month + mood filters, month separator headers, click → `/journal/[date]`
- **Monthly setup wizard** (PRD §6.5): 7-step wizard with theme/affirmation, health snapshot, three stress sliders, food & nervous-system support, self-care focus, appointments, medical snapshot. Adopt the suggested affirmation or write your own. Saved affirmation surfaces on the dashboard.
- **Weekly review** (PRD §6.4): sticky-note grid (washi-tape decorations, gentle tilts) covering focus, non-negotiables, nervous-system safety, gratitude, wins/challenges, food triggers, energy-sleep pattern, what learnt, where to grow.
- **Streak milestones** (PRD §6.8): 7/14/21/30/60/90-day milestones — full-screen celebration overlay with floating petals + spring-pop emoji + brand affirmation. Newly-earned milestones persist on `User.milestones` so they only fire once. "Gentle return" card surfaces on dashboard when the user comes back after a 2+ day break.
- **Email reminder scaffolding**: brand-styled HTML templates (daily, weekly, milestone), `/api/cron/reminders` cron handler protected by `CRON_SECRET`, hourly Vercel Cron config in `vercel.json`. Dry-runs and logs unless `RESEND_API_KEY` is set. Reminders fire at the user's preferred hour in their own timezone (captured from the browser at onboarding, refreshed on the profile page; UTC when none is set).
- **Animations** (PRD §5): reusable `fadeUp`, `staggerContainer/Item`, `pageTransition`, `springSoft`. Every animated component checks `useReducedMotion`.

## Deferred (later phases)

- **Auth**: a single dev user is auto-created (`you@ashera.local`). A later phase swaps this for Supabase magic-link auth. Production builds refuse to run with dev auth unless `ALLOW_DEV_AUTH=true` is explicitly set.
- **Postgres / Supabase**: the schema is SQLite-friendly. Switching to Supabase needs `provider = "postgresql"` in `prisma/schema.prisma`, replacing the JSON-packed `String` array fields with native `String[]`, and the Supabase env vars.
- **Real email delivery**: needs `RESEND_API_KEY`, `RESEND_FROM` (verified sender), `CRON_SECRET`, and `NEXT_PUBLIC_APP_URL` in `.env.local`. Without these, the cron handler runs in dry mode and logs intended sends.

## Running locally

```bash
npm install
npx prisma db push        # creates SQLite ./prisma/dev.db
node scripts/seed.mjs     # optional: 14 days of demo data so charts have something to draw
npm run dev               # http://localhost:3000
```

Useful checks: `npm run typecheck`, `npm run lint`, `npm test` (Vitest), `npm run build`.

No cloud accounts needed. First load auto-creates the dev user and lands you on `/onboarding` (or `/dashboard` if seeded).

## Switching to Supabase + Postgres later

1. Update `prisma/schema.prisma` provider to `postgresql`.
2. Replace JSON-packed array fields (`bodyFeelings`, `herbalTeas`, `afterMeals`, `symptoms`, `painAreas`, `todayPracticed`, `selfCare`, `completedSections`, `bodyRelationship`, etc.) with `String[]` and remove the `@default("[]")`.
3. Delete the manual JSON pack/unpack in `src/lib/entry-mapper.ts` and `src/app/api/onboarding/route.ts` — Prisma handles arrays natively.
4. Set `DATABASE_URL` to your Supabase Postgres connection string.
5. Replace `src/lib/auth.ts` with Supabase Auth (cookie/JWT-based).

## Project structure

```
src/
  app/
    (app)/                 — authenticated shell (dashboard/journal/history/monthly/weekly/profile)
    api/                   — write surface used by the UI (entries, monthly, weekly, onboarding, reminders) + insights/streak, insights/ai, export, cron
    onboarding/            — top-level wizard, no shell
  components/
    animations/            — Framer Motion variants + MotionFade wrapper
    charts/                — Recharts wrappers (MoodSparkline, EnergyStressChart, SleepBarChart, SleepDoughnut, SymptomBars, SymptomHeatmap, SelfCareDonut, ChartCard, CountUp)
    dashboard/             — StatsBar, TodayStatusCard, CheckInHeatmap, HydrationRing, DashboardCharts, MonthlyAffirmation, GentleReturn
    history/               — HistoryFilters, HistoryPagination
    insights/              — InsightsHero, PeriodTabs, InsightCallout
    journal/               — JournalForm + section primitives (MoodSelector, WaterCups, ChipMulti, etc.)
    layout/                — AppShellClient, StreakBadge
    milestones/            — MilestoneCelebration overlay
    monthly/               — MonthlyWizard (7 steps)
    weekly/                — WeeklyForm (sticky-note grid)
    onboarding/            — OnboardingWizard
    profile/               — ReminderSettings
    providers/             — React Query
  lib/
    api.ts                 — shared request helpers (JSON body parsing, 400s)
    auth.ts                — dev user stub (fails closed in production)
    db.ts                  — Prisma client singleton (rejects SQLite in production)
    entry-mapper.ts        — DailyEntry ↔ View (handles JSON arrays)
    monthly-mapper.ts      — MonthlySetup ↔ View
    milestones.ts          — milestone definitions + detection
    ai/                    — ZhipuAI client + prompts
    email/                 — Resend templates + sender (dry-runs without key)
    insights/local-callouts.ts — rule-based fallback callouts
    data/options.ts        — daily journal chip options
    data/months.ts         — 11-month theme + suggested affirmations
    data/monthly-options.ts — monthly setup chip options
    utils/                 — date / streak / streak-detect / journal-time / json-array / period helpers
    validations/entry.ts   — Zod schema for daily entries
    validations/onboarding.ts — Zod schema for onboarding
    validations/monthly.ts — Zod schema for monthly setups
    validations/weekly.ts  — Zod schema for weekly reviews
    validations/common.ts  — shared field size bounds
  theme/index.ts           — Mantine theme (brand tokens)
prisma/
  schema.prisma            — full schema (SQLite-targeted for now)
scripts/
  seed.mjs                 — 14 days of demo entries
vercel.json                — hourly cron pointing at /api/cron/reminders
```

## To wire up real email delivery

When you're ready to move email reminders out of dry-run mode, you'll need:

1. **Resend account** + verified sender domain — https://resend.com
2. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_...
   RESEND_FROM="Ashe Ra <hello@yourdomain.com>"
   CRON_SECRET=<random-32-char-string>
   NEXT_PUBLIC_APP_URL=https://your-deployment.vercel.app
   ```
3. On Vercel, the existing `vercel.json` will run `/api/cron/reminders` hourly — set the same env vars in your Vercel project. Vercel Cron auto-includes the `Authorization: Bearer $CRON_SECRET` header when you set `CRON_SECRET` as an env var.

Until those are set, `/api/cron/reminders` returns `dryRun: true` and the daily/weekly templates are logged but not sent.
