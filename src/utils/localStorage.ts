export interface GameResult {
  gameId: string;
  gameName: string;
  accuracy: number;
  score: number;
  difficulty: string;
  date: string;
  companionPointsEarned: number;
}

export interface Reminder {
  id: string;
  icon: string;
  label: string;
  description: string;
  /** 24-hour "HH:MM" local time. */
  time: string;
  enabled: boolean;
}

export interface AppState {
  user: {
    name: string;
    hasCompletedOnboarding: boolean;
    interactionMode: 'voice' | 'touch';
    offlineMode: boolean;
  };
  companion: {
    type: 'butterfly' | 'plant' | 'phoenix' | 'pet';
    progress: number; // 0-100
  };
  daily: {
    date: string;
    tasksCompleted: string[];
    gamesCompleted: GameResult[];
    pointsEarned: number;
  };
  stats: {
    totalPoints: number;
    currentStreak: number;
    totalGamesPlayed: number;
    lastGameDate: string;
  };
  difficulty: 'easy' | 'medium' | 'hard';
  history: GameResult[];
  reminders: Reminder[];
}

export const DEFAULT_REMINDERS: Reminder[] = [
  { id: 'medicine', icon: '💊', label: 'Take Medicine', description: 'Take your daily medication', time: '08:00', enabled: true },
  { id: 'water', icon: '💧', label: 'Drink Water', description: 'Stay hydrated throughout the day', time: '11:00', enabled: true },
  { id: 'game', icon: '🧠', label: 'Brain Game', description: 'Play a cognitive game', time: '14:00', enabled: true },
  { id: 'walk', icon: '🚶', label: 'Go for Walk', description: 'Take a gentle walk', time: '16:30', enabled: true },
  { id: 'appointment', icon: '📅', label: 'Appointment', description: 'Attend your appointments', time: '18:00', enabled: false },
];

const DEFAULT_STATE: AppState = {
  user: {
    name: 'Patient',
    hasCompletedOnboarding: false,
    interactionMode: 'touch',
    offlineMode: false,
  },
  companion: {
    type: 'butterfly',
    progress: 0,
  },
  daily: {
    date: new Date().toISOString().split('T')[0],
    tasksCompleted: [],
    gamesCompleted: [],
    pointsEarned: 0,
  },
  stats: {
    totalPoints: 0,
    currentStreak: 0,
    totalGamesPlayed: 0,
    lastGameDate: '',
  },
  difficulty: 'easy',
  history: [],
  reminders: DEFAULT_REMINDERS,
};

function freshDefaults(): AppState {
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

const STORAGE_KEY = 'watchAppState';
/** Key used before the CogniMate -> WATCH rename; read once, then migrated. */
const LEGACY_STORAGE_KEY = 'cognimatAppState';

/** Returns saved state, moving pre-rename data to the new key if it's still there. */
function readStored(): string | null {
  const current = localStorage.getItem(STORAGE_KEY);
  if (current) return current;
  const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (legacy) {
    localStorage.setItem(STORAGE_KEY, legacy);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  }
  return legacy;
}

export function getAppState(): AppState {
  const base = freshDefaults();
  try {
    const stored = readStored();
    if (!stored) return base;
    const parsed = JSON.parse(stored) as Partial<AppState>;
    // Shallow-merge each section so state saved by an older build gains new
    // fields (e.g. reminders) instead of arriving undefined.
    return {
      ...base,
      ...parsed,
      user: { ...base.user, ...parsed.user },
      companion: { ...base.companion, ...parsed.companion },
      daily: { ...base.daily, ...parsed.daily },
      stats: { ...base.stats, ...parsed.stats },
      reminders: parsed.reminders?.length ? parsed.reminders : base.reminders,
      history: parsed.history ?? [],
    };
  } catch {
    return base;
  }
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save app state:', e);
  }
}

export function updateAppState(updates: Partial<AppState>): AppState {
  const current = getAppState();
  const updated = { ...current, ...updates };
  saveAppState(updated);
  return updated;
}

export function clearAppState(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_STORAGE_KEY);
}

export function resetToDefaults(): void {
  saveAppState(freshDefaults());
}

export function loadDemoData(): void {
  const demoState: AppState = {
    reminders: DEFAULT_REMINDERS,
    user: {
      name: 'Maya',
      hasCompletedOnboarding: true,
      interactionMode: 'touch',
      offlineMode: false,
    },
    companion: {
      type: 'butterfly',
      progress: 68,
    },
    daily: {
      date: new Date().toISOString().split('T')[0],
      tasksCompleted: ['medicine', 'water', 'game'],
      gamesCompleted: [
        {
          gameId: 'memory-match',
          gameName: 'Memory Match',
          accuracy: 85,
          score: 85,
          difficulty: 'medium',
          date: new Date().toISOString(),
          companionPointsEarned: 10,
        },
      ],
      pointsEarned: 10,
    },
    stats: {
      totalPoints: 350,
      currentStreak: 5,
      totalGamesPlayed: 23,
      lastGameDate: new Date().toISOString().split('T')[0],
    },
    difficulty: 'medium',
    history: [
      {
        gameId: 'memory-match',
        gameName: 'Memory Match',
        accuracy: 75,
        score: 75,
        difficulty: 'easy',
        date: new Date(Date.now() - 86400000).toISOString(),
        companionPointsEarned: 10,
      },
      {
        gameId: 'pattern-recall',
        gameName: 'Pattern Recall',
        accuracy: 90,
        score: 90,
        difficulty: 'medium',
        date: new Date(Date.now() - 172800000).toISOString(),
        companionPointsEarned: 12,
      },
    ],
  };
  saveAppState(demoState);
}
