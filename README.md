# Ashera Wellness Journal

A warm, sage-toned digital companion to a printed wellness journal. Daily
check-ins with 11 body-and-mind sections, streaks and gentle celebrations,
charts and AI-assisted insights, weekly/monthly reflections, coach access,
and email reminders — as an installable PWA.

Built with **Next.js 16 · React 19 · TypeScript strict · Mantine 7 · Prisma +
PostgreSQL**. Production-ready: real accounts, sessions, roles, admin
dashboard, timezone-aware reminder cron.

## Quick start

```bash
npm install
createdb ashera                     # once; local PostgreSQL
npx prisma db push                  # create the schema
node scripts/seed.mjs --make-admin  # demo data + admin dev user
node scripts/seed-coach.mjs         # optional: demo coach + 2 clients
npm run dev                         # http://localhost:3000
```

Demo logins (password `DEV_PASSWORD`, default `ashera-dev-1`):

| Account | Role | Sees |
| --- | --- | --- |
| `you@ashera.local` | admin | everything + `/admin` |
| `coach@ashera.local` | coach | own journal + `/coach` client dashboard |
| `amara@ashera.local` | client | own journal (active demo data) |
| `priya@ashera.local` | client | own journal (at-risk demo data) |

Or create your own account at `/signup`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` / `start` | Production build / serve |
| `npm run typecheck` | TypeScript, strict, no emit |
| `npm run lint` | ESLint 9 (flat config) |
| `npm test` / `test:watch` | Vitest unit tests |
| `npm run db:push` | Apply `prisma/schema.prisma` to the database |
| `npm run db:studio` | Prisma Studio (browse data) |

## Documentation

| Doc | Contents |
| --- | --- |
| [Architecture](./docs/ARCHITECTURE.md) | How the app is built: stack, data model, auth, roles, AI insights, cron, PWA |
| [API reference](./docs/API.md) | Every endpoint: auth, bodies, responses, errors |
| [Development guide](./docs/DEVELOPMENT.md) | Workflow, conventions, recipes for common changes, troubleshooting |
| [Operations](./docs/OPERATIONS.md) | Deploying, environment variables, cron/email setup, security notes |

## Feature map

- **Onboarding** — 4-step wizard: healing intention, commitment letter, nervous-system baseline
- **Daily journal** — mood, body, sleep, hydration (animated cup), nutrition, gut, symptoms, cycle, skin, pain, movement, mind, reflection; autosaved drafts; confetti on save
- **Dashboard** — greeting, affirmation, stats, 30-day heatmap, 7-day charts, gentle-return card after breaks
- **Insights** — mood/energy/sleep/symptom/self-care charts with period selector + AI callouts; advanced page adds mood-vs-sleep scatter, month comparison, cycle ring, pain map, wellbeing radar
- **Weekly review** — sticky-note grid · **Monthly setup** — 7-step wizard with themes & affirmations
- **Streaks** — 7/14/21/30/60/90-day milestone celebrations
- **Coach dashboard** — linked clients' streaks, mood, sleep, at-risk flags
- **Admin** — fleet stats + per-user table
- **Profile** — reminder settings (own timezone), coach linking, CSV/JSON export
- **PWA** — installable, offline fallback via a hand-rolled service worker

The product brief lives in [Ashe_Ra_Wellness_Journal_PRD.pdf](./Ashe_Ra_Wellness_Journal_PRD.pdf).
