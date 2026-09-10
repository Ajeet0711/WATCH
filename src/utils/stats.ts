import type { AppState, GameResult } from './localStorage.ts';
import { getAppState, saveAppState } from './localStorage.ts';
import { calculateAdaptiveDifficulty, getAdaptationMessage } from './adaptiveDifficulty.ts';
import type { DifficultyLevel } from './adaptiveDifficulty.ts';
import { addCompanionProgress, calculateCompanionStage } from './companionProgress.ts';

/** Local-calendar date key, e.g. "2026-09-10". Avoids the UTC shift of toISOString(). */
export function dateKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function daysBetween(fromKey: string, toKey: string): number {
  const [fy, fm, fd] = fromKey.split('-').map(Number);
  const [ty, tm, td] = toKey.split('-').map(Number);
  const from = Date.UTC(fy, fm - 1, fd);
  const to = Date.UTC(ty, tm - 1, td);
  return Math.round((to - from) / 86400000);
}

/**
 * Streak rules: playing again the same day holds it, the next day extends it,
 * and any longer gap starts over at 1.
 */
export function computeStreak(lastGameDate: string, currentStreak: number, today = dateKey()): number {
  if (!lastGameDate) return 1;
  const gap = daysBetween(lastGameDate, today);
  if (gap === 0) return Math.max(currentStreak, 1);
  if (gap === 1) return currentStreak + 1;
  return 1;
}

/** A streak shown on screen is stale once a day has passed with no play. */
export function displayStreak(lastGameDate: string, currentStreak: number, today = dateKey()): number {
  if (!lastGameDate) return 0;
  return daysBetween(lastGameDate, today) <= 1 ? currentStreak : 0;
}

/** Clears daily counters when the calendar day has rolled over. */
export function rollDaily(state: AppState, today = dateKey()): AppState {
  if (state.daily.date === today) return state;
  return {
    ...state,
    daily: { date: today, tasksCompleted: [], gamesCompleted: [], pointsEarned: 0 },
    stats: { ...state.stats, currentStreak: displayStreak(state.stats.lastGameDate, state.stats.currentStreak, today) },
  };
}

/** Reads state with the daily rollover already applied, persisting it if it changed. */
export function getFreshState(): AppState {
  const raw = getAppState();
  const rolled = rollDaily(raw);
  if (rolled !== raw) saveAppState(rolled);
  return rolled;
}

/** Mean accuracy per day for the last `days` days, oldest first. Days with no play read 0. */
export function getDailyAccuracy(history: GameResult[], days = 7): { key: string; label: string; value: number }[] {
  const out: { key: string; label: string; value: number }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = dateKey(d);
    const onDay = history.filter((h) => dateKey(new Date(h.date)) === key);
    const value = onDay.length
      ? Math.round(onDay.reduce((sum, h) => sum + h.accuracy, 0) / onDay.length)
      : 0;
    out.push({ key, label: d.toLocaleDateString(undefined, { weekday: 'short' }), value });
  }
  return out;
}

/** Mean accuracy over the most recent `count` results, or null with no history. */
export function getRecentAccuracy(history: GameResult[], count = 3): number | null {
  const recent = history.slice(-count);
  if (!recent.length) return null;
  return Math.round(recent.reduce((sum, h) => sum + h.accuracy, 0) / recent.length);
}

export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return 'recently';
  const mins = Math.round((now.getTime() - then) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.round(days / 7);
  return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
}

export interface RecordedGame {
  state: AppState;
  points: number;
  streak: number;
  streakExtended: boolean;
  newDifficulty: DifficultyLevel;
  difficultyChanged: boolean;
  adaptationMessage: string;
  stageUp: boolean;
}

/**
 * The single place a finished game is written to state: history, daily totals,
 * streak, companion progress and the next difficulty all move together here.
 */
export function recordGameResult(
  gameId: string,
  gameName: string,
  accuracy: number,
  score: number,
): RecordedGame {
  const state = getFreshState();
  const today = dateKey();
  const points = Math.max(1, Math.round(accuracy * 0.1));

  const result: GameResult = {
    gameId,
    gameName,
    accuracy,
    score,
    difficulty: state.difficulty,
    date: new Date().toISOString(),
    companionPointsEarned: points,
  };

  const history = [...state.history, result];
  const streak = computeStreak(state.stats.lastGameDate, state.stats.currentStreak, today);

  // Adapt off real measured accuracy, smoothed over the last few games.
  const basis = getRecentAccuracy(history, 3) ?? accuracy;
  const newDifficulty = calculateAdaptiveDifficulty(state.difficulty, basis);

  const beforeStage = calculateCompanionStage(state.companion.progress);
  const progress = addCompanionProgress(state.companion.progress, points);

  const updated: AppState = {
    ...state,
    difficulty: newDifficulty,
    companion: { ...state.companion, progress },
    daily: {
      ...state.daily,
      gamesCompleted: [...state.daily.gamesCompleted, result],
      pointsEarned: state.daily.pointsEarned + points,
    },
    stats: {
      totalPoints: state.stats.totalPoints + points,
      totalGamesPlayed: state.stats.totalGamesPlayed + 1,
      currentStreak: streak,
      lastGameDate: today,
    },
    history,
  };

  saveAppState(updated);

  return {
    state: updated,
    points,
    streak,
    streakExtended: streak > state.stats.currentStreak,
    newDifficulty,
    difficultyChanged: newDifficulty !== state.difficulty,
    adaptationMessage: getAdaptationMessage(state.difficulty, newDifficulty),
    stageUp: calculateCompanionStage(progress) > beforeStage,
  };
}

/** Shape stored in each game's result modal state. */
export interface GameOutcome {
  accuracy: number;
  points: number;
  message: string;
  streak: number;
  streakExtended: boolean;
  difficultyChanged: boolean;
  newDifficulty: DifficultyLevel;
  adaptationMessage: string;
  stageUp: boolean;
  correct?: number;
  total?: number;
  level?: number;
}

/** Folds a RecordedGame plus per-game extras into the modal's outcome shape. */
export function toOutcome(
  recorded: RecordedGame,
  accuracy: number,
  message: string,
  extras: Pick<GameOutcome, 'correct' | 'total' | 'level'> = {},
): GameOutcome {
  return {
    accuracy,
    message,
    points: recorded.points,
    streak: recorded.streak,
    streakExtended: recorded.streakExtended,
    difficultyChanged: recorded.difficultyChanged,
    newDifficulty: recorded.newDifficulty,
    adaptationMessage: recorded.adaptationMessage,
    stageUp: recorded.stageUp,
    ...extras,
  };
}
