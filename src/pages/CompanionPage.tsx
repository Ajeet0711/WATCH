import { useState } from 'react';
import Companion from '../components/Companion.tsx';
import ProgressBar from '../components/ProgressBar.tsx';
import FeatureCard from '../components/FeatureCard.tsx';
import { getAppState, saveAppState } from '../utils/localStorage.ts';
import { getCompanionStageInfo, calculateCompanionStage } from '../utils/companionProgress.ts';
import { COMPANION_OPTIONS } from '../data/companions.ts';

export default function CompanionPage() {
  const [state, setState] = useState(getAppState());

  const handleCompanionChange = (companionType: string) => {
    const updated = {
      ...state,
      companion: {
        ...state.companion,
        type: companionType as 'butterfly' | 'plant' | 'phoenix' | 'pet',
      },
    };
    saveAppState(updated);
    setState(updated);
  };

  const stage = calculateCompanionStage(state.companion.progress);
  const stageInfo = getCompanionStageInfo(stage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-wellness-50 to-white py-8 px-4 pt-24">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-wellness-700">Your Companion 🦋</h1>

        {/* Main Companion Display */}
        <div className="bg-gradient-to-r from-wellness-50 to-blue-50 p-8 rounded-lg border-2 border-wellness-300">
          <Companion type={state.companion.type} progress={state.companion.progress} size="lg" />
        </div>

        {/* Evolution Timeline */}
        <div className="bg-white p-8 rounded-lg border-2 border-wellness-200">
          <h2 className="text-2xl font-bold text-wellness-700 mb-6">Evolution Timeline</h2>
          <div className="grid grid-cols-4 gap-4">
            {([1, 2, 3, 4] as const).map((s) => {
              const info = getCompanionStageInfo(s as 1 | 2 | 3 | 4);
              return (
                <div
                  key={s}
                  className={`p-4 rounded-lg text-center transition-all ${
                    stage === s
                      ? 'bg-gradient-to-b from-wellness-400 to-wellness-600 text-white ring-4 ring-wellness-300 scale-105'
                      : stage > s
                        ? 'bg-wellness-100 border-2 border-wellness-300'
                        : 'bg-gray-100 border-2 border-gray-300 opacity-50'
                  }`}
                >
                  <p className="text-3xl mb-2">{info.visual}</p>
                  <p className="font-bold text-sm md:text-base">{info.name}</p>
                  <p className="text-xs md:text-sm mt-1">{info.range}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Companion Selection */}
        <div className="bg-white p-8 rounded-lg border-2 border-wellness-200">
          <h2 className="text-2xl font-bold text-wellness-700 mb-6">Choose Your Companion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COMPANION_OPTIONS.map((c) => (
              <FeatureCard
                key={c.id}
                title={c.name}
                description={c.description}
                icon={c.emoji}
                onClick={() => handleCompanionChange(c.id)}
                isActive={state.companion.type === c.id}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white p-8 rounded-lg border-2 border-wellness-200">
          <h2 className="text-2xl font-bold text-wellness-700 mb-6">Companion Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Total Points</p>
              <p className="text-4xl font-bold text-wellness-600">{state.stats.totalPoints}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm">Current Stage</p>
              <p className="text-4xl font-bold text-wellness-600">{stageInfo.name}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm">Completion</p>
              <p className="text-4xl font-bold text-wellness-600">{state.companion.progress}%</p>
            </div>
          </div>
          <div className="mt-6">
            <ProgressBar progress={state.companion.progress} label="Companion Progress" size="lg" />
          </div>
        </div>

        {/* Growth Guide */}
        <div className="bg-wellness-50 p-8 rounded-lg border-2 border-wellness-200">
          <h2 className="text-2xl font-bold text-wellness-700 mb-6">How to Grow Your Companion</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl mb-2">🎮</p>
              <p className="font-bold text-gray-800">Play Games</p>
              <p className="text-sm text-gray-600">+10-20 points per game</p>
            </div>
            <div className="text-center">
              <p className="text-2xl mb-2">✅</p>
              <p className="font-bold text-gray-800">Complete Tasks</p>
              <p className="text-sm text-gray-600">+5 points per task</p>
            </div>
            <div className="text-center">
              <p className="text-2xl mb-2">🏆</p>
              <p className="font-bold text-gray-800">Reach Milestones</p>
              <p className="text-sm text-gray-600">Companion evolves at 25%, 50%, 80%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
