# API reference

The API is intentionally small: **reads happen in server components**, so
these endpoints exist only for browser-initiated writes, polling, exports,
and the cron. All bodies and responses are JSON.

## Conventions

- **Auth**: session cookie `ashera_session` (set by login/signup).
  Endpoints marked 🔒 return `401 {"error":"Unauthorized"}` without a valid
  session.
- **Validation**: every write endpoint zod-parses its body. Malformed or
  non-object JSON → `400 {"error":"Invalid JSON body"}`; schema failures →
  `400 {"error":"…","issues":{…}}` (flattened zod issues).
- **Field bounds** (shared, `lib/validations/common.ts`): tag strings
  ≤ 100 chars, arrays ≤ 40 items, text ≤ 1000, long text ≤ 5000.
- **Dates** are `YYYY-MM-DD` strings.

## Authentication

| Endpoint | Body | Success | Errors |
| --- | --- | --- | --- |
| `POST /api/auth/signup` | `{displayName, email, password}` (password ≥ 8) | `200 {ok, onboarded}` + session cookie | `409` email in use · `400` validation · `429` rate limited (5/10min/IP) |
| `POST /api/auth/login` | `{email, password}` | `200 {ok, onboarded}` + session cookie | `401 {"error":"Incorrect email or password."}` (same for unknown email — no enumeration) · `429` (10/10min/IP) |
| `POST /api/auth/logout` | — | `200 {ok}` · deletes session row + cookie | — |

`onboarded` tells the client whether to route to `/onboarding` or
`/dashboard`. Sessions last 30 days.

## Journal & reflections

| Endpoint | Body | Notes |
| --- | --- | --- |
| 🔒 `POST /api/entries` | `dailyEntrySchema` (date required; all 11 sections optional) | Upserts one entry per date. Returns `{entry, isNew, streak, milestones}` — `milestones` lists newly-earned streak milestones so the client can celebrate |
| 🔒 `POST /api/weekly` | `{weekNumber (1–44), …review fields}` | Upserts the week's review; returns `{review}` |
| 🔒 `POST /api/monthly` | `{monthNumber (1–11), year, month, …setup fields}` | Upserts the month's setup; returns `{setup}` |
| 🔒 `POST /api/onboarding` | `{healingIntention, commitmentLetter, …, timezone?}` | Saves onboarding, marks user onboarded, stores IANA timezone |

## User settings

| Endpoint | Body | Notes |
| --- | --- | --- |
| 🔒 `PATCH /api/users/reminders` | `{enabled, hour (0–23), timezone?}` | Reminder hour is interpreted in the user's own timezone (captured from the browser) |
| 🔒 `PATCH /api/users/coach` | `{coachEmail}` or `{coachEmail: null}` | Links/unlinks the signed-in client to a coach account. `404` if no coach account with that email; linking to yourself is rejected |

## Insights & export

| Endpoint | Notes |
| --- | --- |
| 🔒 `GET /api/insights/streak` | `{current, longest, weeklyGoal, thisWeek, totalEntries}` — polled by the header streak badge |
| 🔒 `GET /api/insights/ai?period=7\|14\|30\|90\|all` | `{mood, sleep, symptoms, selfCare, overall}` callout texts. Cached per user per day (`AiInsightCache`); falls back to rule-based callouts without a `ZAI_API_KEY` |
| 🔒 `GET /api/export?format=csv` | CSV attachment of all entries (formula-injection safe) |
| 🔒 `GET /api/export?format=summary` | JSON summary: totals, streaks, averages, top symptoms/self-care |

## Cron

| Endpoint | Notes |
| --- | --- |
| `POST /api/cron/reminders` | Hourly via `vercel.json`. Requires `Authorization: Bearer $CRON_SECRET` (constant-time compare). Without the secret it runs **only** in local development. Sends daily + Monday-weekly reminder emails per user's timezone via Resend (dry-run without `RESEND_API_KEY`). Returns `{fired, daily, weekly, dryRun}` — counts only |

## Typical client flow

```
signup  →  {ok, onboarded:false}  →  /onboarding
POST /api/onboarding              →  /dashboard
journal save → POST /api/entries  →  confetti + milestone check
streak badge → GET /api/insights/streak (React Query)
```
