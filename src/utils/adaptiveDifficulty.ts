export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export const DIFFICULTY_LEVELS = {
  easy: { level: 1, label: 'Easy', cardCount: 6, sequenceLength: 3, multiplier: 1 },
  medium: { level: 2, label: 'Medium', cardCount: 8, sequenceLength: 4, multiplier: 1.5 },
  hard: { level: 3, label: 'Hard', cardCount: 10, sequenceLength: 5, multiplier: 2 },
} as const;

export function calculateAdaptiveDifficulty(
  currentDifficulty: DifficultyLevel,
  accuracy: number
): DifficultyLevel {
  if (accuracy > 80 && currentDifficulty !== 'hard') {
    return currentDifficulty === 'easy' ? 'medium' : 'hard';
  }
  if (accuracy < 50 && currentDifficulty !== 'easy') {
    return currentDifficulty === 'hard' ? 'medium' : 'easy';
  }
  return currentDifficulty;
}

const DIFFICULTY_RANK: Record<DifficultyLevel, number> = { easy: 0, medium: 1, hard: 2 };

export function getAdaptationMessage(
  currentDifficulty: DifficultyLevel,
  newDifficulty: DifficultyLevel
): string {
  if (newDifficulty === currentDifficulty) {
    return 'Your performance is steady. Keep practicing!';
  }
  if (DIFFICULTY_RANK[newDifficulty] > DIFFICULTY_RANK[currentDifficulty]) {
    return 'Great work! The next activity will be a bit more challenging.';
  }
  return 'Let\'s start with something a bit easier to build confidence.';
}

export function simulateAIMockUpdate(): { accuracy: number; feedback: string } {
  const accuracy = Math.floor(Math.random() * 40) + 50; // 50-90%
  const feedback =
    accuracy > 80
      ? '✨ Excellent performance!'
      : accuracy > 60
        ? '👍 Good job!'
        : '💪 Keep practicing!';
  return { accuracy, feedback };
}
