import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal.tsx';
import { calculateAccuracy, getEncouragingMessage } from '../utils/gameHelpers.ts';
import { getAppState } from '../utils/localStorage.ts';
import { recordGameResult, toOutcome } from '../utils/stats.ts';
import type { GameOutcome } from '../utils/stats.ts';
import GameResultExtras from '../components/GameResultExtras.tsx';
import { DIFFICULTY_LEVELS } from '../utils/adaptiveDifficulty.ts';

const COLORS = [
  { bg: 'bg-red-500', hex: '#EF4444' },
  { bg: 'bg-blue-500', hex: '#3B82F6' },
  { bg: 'bg-green-500', hex: '#22C55E' },
  { bg: 'bg-yellow-500', hex: '#EAB308' },
];

export default function PatternRecall() {
  const navigate = useNavigate();
  const state = getAppState();
  const difficulty = state.difficulty as keyof typeof DIFFICULTY_LEVELS;

  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<GameOutcome | null>(null);
  const [activeBtnIdx, setActiveBtnIdx] = useState<number | null>(null);

  const maxLevel = DIFFICULTY_LEVELS[difficulty].sequenceLength;

  useEffect(() => {
    if (gameOver) return;
    const newSeq = [...sequence, Math.floor(Math.random() * 4)];
    setSequence(newSeq);
    playSequence(newSeq);
  }, [level]);

  const playSequence = async (seq: number[]) => {
    setIsPlaying(true);
    for (let i = 0; i < seq.length; i++) {
      await new Promise((resolve) =>
        setTimeout(() => {
          setActiveBtnIdx(seq[i]);
          setTimeout(() => setActiveBtnIdx(null), 400);
          resolve(null);
        }, 600)
      );
    }
    setIsPlaying(false);
  };

  const handleColorClick = async (idx: number) => {
    if (isPlaying || gameOver) return;

    setActiveBtnIdx(idx);
    setTimeout(() => setActiveBtnIdx(null), 200);

    const newUserSeq = [...userSequence, idx];
    setUserSequence(newUserSeq);

    if (sequence[userSequence.length] !== idx) {
      endGame();
      return;
    }

    if (newUserSeq.length === sequence.length) {
      if (level === maxLevel) {
        winGame();
      } else {
        setUserSequence([]);
        setLevel(level + 1);
      }
    }
  };

  const endGame = () => {
    setGameOver(true);
    const accuracy = calculateAccuracy(level - 1, maxLevel);
    const outcome = recordGameResult('pattern-recall', 'Pattern Recall', accuracy, level - 1);

    setResult(toOutcome(outcome, accuracy, getEncouragingMessage(), { level: level - 1 }));
    setShowResult(true);
  };

  const winGame = () => {
    setGameOver(true);
    const accuracy = 100;
    const outcome = recordGameResult('pattern-recall', 'Pattern Recall', accuracy, level);

    setResult(toOutcome(outcome, accuracy, '🏆 Perfect! You mastered the pattern!', { level }));
    setShowResult(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-wellness-50 to-white py-8 px-4 pt-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-wellness-700 mb-6 text-center">Pattern Recall 🌈</h1>

        <div className="mb-8 p-6 md:p-8 bg-white rounded-lg">
          <p className="text-lg text-center font-bold text-gray-700 mb-6">Level {level} / {maxLevel}</p>
          <div className="grid grid-cols-2 gap-6 md:gap-8 max-w-xs mx-auto">
            {COLORS.map((color, idx) => (
              <button
                key={idx}
                onClick={() => handleColorClick(idx)}
                disabled={isPlaying || gameOver}
                className={`aspect-square rounded-xl transition-all transform ${
                  activeBtnIdx === idx
                    ? 'scale-95 shadow-2xl ring-4 ring-yellow-300'
                    : 'scale-100 shadow-lg hover:scale-105'
                } ${color.bg} ${isPlaying || gameOver ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
              />
            ))}
          </div>
        </div>

        <div className="bg-wellness-50 p-4 rounded-lg mb-8 text-center">
          {isPlaying && <p className="text-base font-bold text-wellness-600">👀 Watch the pattern...</p>}
          {!isPlaying && !gameOver && <p className="text-base font-bold text-wellness-600">🎯 Your turn! Tap the colors in order</p>}
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg"
        >
          Back to Dashboard
        </button>
      </div>

      <Modal
        isOpen={showResult}
        title={result?.message || '🎉 Game Over!'}
        onClose={() => navigate('/dashboard')}
        onAction={() => navigate('/dashboard')}
        actionLabel="Continue"
      >
        <div className="text-center space-y-4">
          <p className="text-3xl font-bold text-wellness-600">Level {result?.level || 0}</p>
          <p className="text-lg text-gray-700">You reached level {result?.level || 0}</p>
          <p className="text-xl font-bold text-green-600">+{result?.points || 0} Companion Points</p>
        </div>
        <GameResultExtras outcome={result} />
      </Modal>
    </div>
  );
}
