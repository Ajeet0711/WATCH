export const COMPANION_STAGES = {
  1: { name: 'Inception', visual: '🥚', range: '0-24%', message: 'Your memory journey has begun...' },
  2: { name: 'Growth', visual: '🌱', range: '25-49%', message: 'Your companion is growing stronger!' },
  3: { name: 'Metamorphosis', visual: '🦋', range: '50-79%', message: 'Beautiful transformation in progress...' },
  4: { name: 'Mastery', visual: '✨🦋', range: '80-100%', message: 'You have achieved mastery!' },
} as const;

export const COMPANIONS = {
  butterfly: { name: 'Coco the Butterfly', emoji: '🦋', description: 'A graceful guide through memory gardens' },
  plant: { name: 'Vera the Plant', emoji: '🌿', description: 'Grows with your growth, seasons your victory' },
  phoenix: { name: 'Agni the Phoenix', emoji: '🐉', description: 'Rises stronger with each challenge conquered' },
  pet: { name: 'Buddy the Friend', emoji: '🐾', description: 'Your loyal companion through every memory task' },
} as const;

export function calculateCompanionStage(progress: number): 1 | 2 | 3 | 4 {
  if (progress >= 80) return 4;
  if (progress >= 50) return 3;
  if (progress >= 25) return 2;
  return 1;
}

export function getCompanionStageInfo(stage: 1 | 2 | 3 | 4) {
  return COMPANION_STAGES[stage];
}

export function getPointsUntilNextMilestone(progress: number): number {
  const milestones = [25, 50, 80, 100];
  for (const milestone of milestones) {
    if (progress < milestone) {
      return milestone - Math.floor(progress);
    }
  }
  return 0;
}

export function addCompanionProgress(currentProgress: number, points: number): number {
  return Math.min(100, currentProgress + points);
}

export function getCompanionVisual(companionType: string, stage: 1 | 2 | 3 | 4): string {
  if (companionType === 'butterfly') return COMPANION_STAGES[stage].visual;
  if (companionType === 'plant') return stage === 1 ? '🌱' : stage === 2 ? '🌿' : stage === 3 ? '🌳' : '🌲';
  if (companionType === 'phoenix') return stage === 1 ? '🐣' : stage === 2 ? '🐦' : stage === 3 ? '🐉' : '✨🐉';
  return stage === 1 ? '🐕' : stage === 2 ? '🐕‍🦺' : stage === 3 ? '🦮' : '👑🐕';
}
