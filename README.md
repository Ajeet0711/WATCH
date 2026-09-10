# WATCH

**W**ellness **A**nomaly **T**racking and **C**aregiver **H**elp

A cognitive gaming and memory assistance platform designed for elderly patients,
with daily reminders, adaptive brain games, and a caregiver-facing dashboard.

## Features

- **Adaptive cognitive games** — Memory Match, Object Recall, Pattern Recall and
  Routine Recall. Difficulty adapts to measured accuracy over recent play.
- **Daily reminders** — per-reminder times with due/overdue tracking and
  optional browser notifications.
- **Companion progression** — a companion that grows through four stages as
  points accumulate.
- **Streaks and stats** — day-streak tracking with real calendar-date handling.
- **Caregiver dashboard** — weekly engagement chart, recent activity, and care
  alerts driven by actual patient data.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Typecheck (`tsc -b`) then production build |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint over the project |

## Project structure

```
src/
  components/   Reusable UI (Navbar, ReminderCard, Companion, …)
  pages/        Routed screens (Dashboard, games, Settings, Caregiver)
  hooks/        useReminderAlerts — live reminder status + notifications
  utils/
    localStorage.ts      Persisted app state + schema migration
    stats.ts             Streaks, daily rollover, weekly accuracy, game recording
    reminders.ts         Reminder scheduling, status and notifications
    adaptiveDifficulty.ts  Difficulty adaptation from accuracy
    companionProgress.ts   Companion stages and progress
```

## State and storage

All state persists to `localStorage` under `watchAppState`. State saved under
the previous `cognimatAppState` key is migrated automatically on first read, so
existing progress carries over.

## Tech

React 19 · TypeScript · Vite 8 · Tailwind CSS v4 · React Router 7 · lucide-react

Built as a demo prototype for hackathon presentation.
