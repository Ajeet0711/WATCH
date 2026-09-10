import { Flame, TrendingUp, Sparkles } from 'lucide-react';
import type { GameOutcome } from '../utils/stats.ts';

/** The streak / difficulty / companion feedback shown under a game's score. */
export default function GameResultExtras({ outcome }: { outcome: GameOutcome | null }) {
  if (!outcome) return null;

  return (
    <div className="space-y-2 mt-4">
      {outcome.streakExtended && (
        <p className="flex items-center justify-center gap-2 text-orange-700 bg-orange-50 border border-orange-200 rounded-lg py-2 px-3 font-semibold">
          <Flame size={18} /> {outcome.streak} day streak!
        </p>
      )}
      {outcome.stageUp && (
        <p className="flex items-center justify-center gap-2 text-purple-700 bg-purple-50 border border-purple-200 rounded-lg py-2 px-3 font-semibold">
          <Sparkles size={18} /> Your companion reached a new stage!
        </p>
      )}
      {outcome.difficultyChanged && (
        <p className="flex items-center justify-center gap-2 text-wellness-700 bg-wellness-50 border border-wellness-200 rounded-lg py-2 px-3 text-sm">
          <TrendingUp size={18} className="shrink-0" />
          <span>
            {outcome.adaptationMessage}{' '}
            <span className="font-bold capitalize">Now: {outcome.newDifficulty}.</span>
          </span>
        </p>
      )}
    </div>
  );
}
