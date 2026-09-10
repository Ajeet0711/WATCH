import type { DifficultyLevel } from './adaptiveDifficulty.ts';

export function generateMemoryCards(count: number) {
  const symbols = ['🌟', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎺', '🎻', '🎮'];
  const selected = symbols.slice(0, Math.ceil(count / 2));
  const cards = [...selected, ...selected].slice(0, count);
  return shuffleArray(cards.map((symbol, idx) => ({ id: idx, symbol, matched: false })));
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function calculateAccuracy(correct: number, total: number): number {
  return Math.round((correct / total) * 100);
}

export function generateSequence(length: number): string[] {
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'];
  const sequence: string[] = [];
  for (let i = 0; i < length; i++) {
    sequence.push(colors[Math.floor(Math.random() * colors.length)]);
  }
  return sequence;
}

export function getDailyRoutineActivities(): Array<{ emoji: string; activity: string }> {
  return [
    { emoji: '🌅', activity: 'Wake up' },
    { emoji: '🧘', activity: 'Morning meditation' },
    { emoji: '🍳', activity: 'Eat breakfast' },
    { emoji: '🚶', activity: 'Evening walk' },
    { emoji: '🌙', activity: 'Sleep' },
  ];
}

export function getObjectsForRecall(): string[] {
  return ['🍎', '🐱', '📚', '🏠', '🚗', '🌸'];
}

export function createGameResult(
  gameType: string,
  accuracy: number,
  score: number,
  difficulty: DifficultyLevel
) {
  const pointsMap = { easy: 10, medium: 15, hard: 20 };
  return {
    gameId: gameType,
    gameName: gameType.split('-').join(' ').toUpperCase(),
    accuracy,
    score,
    difficulty,
    date: new Date().toISOString(),
    companionPointsEarned: pointsMap[difficulty],
  };
}

export function getRandomMotivationalMessage(): string {
  const messages = [
    '✨ Amazing work!',
    '🎉 Fantastic performance!',
    '💪 You\'re a memory champion!',
    '🌟 Impressive!',
    '👏 Wonderful effort!',
    '🏆 Excellent!',
    '🎯 Perfect focus!',
    '💝 You did great!',
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

export function getEncouragingMessage(): string {
  const messages = [
    '💭 Your memory is growing. Keep going!',
    '🌱 Every attempt strengthens your mind.',
    '💪 You\'re doing better each day.',
    '🎯 Focus and try again.',
    '🌟 Memory is like a muscle - it grows with practice.',
    '👍 Good effort! You\'re learning.',
    '🧠 Your brain is amazing. Let\'s try again!',
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}
