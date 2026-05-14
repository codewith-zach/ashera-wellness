# Ashe Ra Wellness Journal

Phase-1 → Phase-3 implementation of the [Ashe Ra Wellness Journal PRD](./Ashe_Ra_Wellness_Journal_PRD.pdf).

A warm, sage-toned digital companion to the printed wellness journal — daily entries, streak tracking, and the foundations for the dashboard, insights, and weekly/monthly cadences.

## What's in this slice

- **Stack**: Next.js 14 (App Router) · TypeScript strict · Mantine v7 · Framer Motion · Prisma · Lucide icons · React Query
- **Brand theme** (PRD §2): sage palette, Playfair Display + DM Sans, sage-tinted shadows, rounded radii
- **Schema** (PRD §4): full `User` / `DailyEntry` / `MonthlySetup` / `WeeklyReview` / `Onboarding` models — pointed at SQLite for local dev (string-array fields are JSON-packed for portability)
- **Onboarding wizard** (PRD §6.1): 4 steps — welcome, 11-month healing intention, commitment letter, nervous-system baseline
- **Daily journal** (PRD §6.3): all 11 sections (mood, body, sleep, nutrition, gut, symptoms, hormone/cycle, movement, mind, self-care, reflection) with chip multi-selects, sliders, animated water cup tap UI, mood emoji selector with bounce, autosave drafts every 30s, petal-confetti on save
- **Dashboard** (PRD §6.2): time-based greeting, daily affirmation, stats bar, today's status card with hydration ring + completion summary, 30-day check-in heatmap, **7-day mood sparkline / energy-vs-stress / sleep bar charts** (Recharts, animate on mount)
- **Insights page** (PRD §6.6): summary stats with `CountUp` animations, period selector (7/14/30/90/all), mood journey, energy & stress, sleep bar, sleep quality doughnut, symptom heatmap, top symptoms, self-care donut. Each chart has a gentle local-heuristic callout (the AI version from Phase 4 will replace these).
- **API routes** (PRD §7.1, §7.2): `POST/GET /api/entries`, `GET/PATCH /api/entries/[date]`, `GET /api/insights/{streak,mood,sleep,symptoms,summary}`, `POST /api/onboarding`
- **App shell**: Mantine `AppShell` with collapsible sidebar nav, animated streak badge in the header
- **History** (PRD §6.7): paginated 20/page, month + mood filters, month separator headers, click → `/journal/[date]`
- **Monthly setup wizard** (PRD §6.5): 7-step wizard with theme/affirmation, health snapshot, three stress sliders, food & nervous-system support, self-care focus, appointments, medical snapshot. Adopt the suggested affirmation or write your own. Saved affirmation surfaces on the dashboard.
- **Weekly review** (PRD §6.4): sticky-note grid (washi-tape decorations, gentle tilts) covering focus, non-negotiables, nervous-system safety, gratitude, wins/challenges, food triggers, energy-sleep pattern, what learnt, where to grow.
- **Streak milestones** (PRD §6.8): 7/14/21/30/60/90-day milestones — full-screen celebration overlay with floating petals + spring-pop emoji + brand affirmation. Newly-earned milestones persist on `User.milestones` so they only fire once. "Gentle return" card surfaces on dashboard when the user comes back after a 2+ day break.
- **Email reminder scaffolding**: brand-styled HTML templates (daily, weekly, milestone), `/api/cron/reminders` cron handler protected by `CRON_SECRET`, hourly Vercel Cron config in `vercel.json`. Dry-runs and logs unless `RESEND_API_KEY` is set. Profile page lets the user toggle daily reminders + pick a UTC hour.
- **Animations** (PRD §5): reusable `fadeUp`, `staggerContainer/Item`, `pageTransition`, `springSoft`. Every animated component checks `useReducedMotion`.

## Deferred (later phases)

These are stubbed but intentionally not built in this slice — they need cloud credentials or are scoped to later phases:

- **Auth**: a single dev user is auto-created (`you@ashera.local`). Phase 1.2 swaps this for Supabase magic-link auth.
- **Postgres / Supabase**: the schema is SQLite-friendly. Switching to Supabase needs `provider = "postgresql"` in `prisma/schema.prisma`, replacing the JSON-packed `String` array fields with native `String[]`, and the Supabase env vars.
- **Mood vs Sleep correlation scatter, body silhouette pain map, hormone cycle phase tracker** (Phase 5).
- **AI insight callouts** (Phase 4): the Insights page already ships with placeholder rule-based callouts. Phase 4 swaps these for Anthropic `claude-haiku-4-5-20251001`.
- **Coach dashboard + data export** (Phase 4).
- **Real email delivery**: needs `RESEND_API_KEY`, `RESEND_FROM` (verified sender), `CRON_SECRET`, and `NEXT_PUBLIC_APP_URL` in `.env.local`. Without these, the cron handler runs in dry mode and logs intended sends.
- **Weekly review** (Phase 3, §6.4) — placeholder page in the sidebar.
- **Streak milestone celebrations + email reminders** (Phase 3).
- **AI insights + coach dashboard** (Phase 4).

## Running locally

```bash
npm install
npx prisma db push        # creates SQLite ./prisma/dev.db
node scripts/seed.mjs     # optional: 14 days of demo data so charts have something to draw
npm run dev               # http://localhost:3000
```

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
    api/                   — entries, onboarding, insights/streak
    onboarding/            — top-level wizard, no shell
  components/
    animations/            — Framer Motion variants + MotionFade wrapper
    charts/                — Recharts wrappers (MoodSparkline, EnergyStressChart, SleepBarChart, SleepDoughnut, SymptomBars, SymptomHeatmap, SelfCareDonut, ChartCard, CountUp)
    dashboard/             — StatsBar, TodayStatusCard, CheckInHeatmap, HydrationRing, DashboardCharts, MonthlyAffirmation, GentleReturn
    history/               — HistoryFilters, HistoryPagination
    insights/              — InsightsHero, PeriodTabs, InsightCallout
    journal/               — JournalForm + section primitives (MoodSelector, WaterCups, ChipMulti, etc.)
    layout/                — AppShellClient, StreakBadge, ComingSoon
    milestones/            — MilestoneCelebration overlay
    monthly/               — MonthlyWizard (7 steps)
    weekly/                — WeeklyForm (sticky-note grid)
    onboarding/            — OnboardingWizard
    profile/               — ReminderSettings
    providers/             — React Query
  lib/
    auth.ts                — dev user stub
    db.ts                  — Prisma client singleton
    entry-mapper.ts        — DailyEntry ↔ View (handles JSON arrays)
    monthly-mapper.ts      — MonthlySetup ↔ View
    milestones.ts          — milestone definitions + detection
    email/                 — Resend templates + sender (dry-runs without key)
    insights/local-callouts.ts — placeholder for Phase-4 AI callouts
    data/options.ts        — daily journal chip options
    data/months.ts         — 11-month theme + suggested affirmations
    data/monthly-options.ts — monthly setup chip options
    utils/                 — date / streak / streak-detect / journal-time / json-array / period helpers
    validations/entry.ts   — Zod schemas for daily entry + onboarding
    validations/monthly.ts — Zod schemas for monthly + weekly
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
