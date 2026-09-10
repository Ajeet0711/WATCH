import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar.tsx';
import Modal from '../components/Modal.tsx';
import { calculateAccuracy, shuffleArray, getRandomMotivationalMessage } from '../utils/gameHelpers.ts';
import { getAppState } from '../utils/localStorage.ts';
import { recordGameResult, toOutcome } from '../utils/stats.ts';
import type { GameOutcome } from '../utils/stats.ts';
import GameResultExtras from '../components/GameResultExtras.tsx';
import { DIFFICULTY_LEVELS } from '../utils/adaptiveDifficulty.ts';

interface Card {
  id: number;
  symbol: string;
  matched: boolean;
  flipped: boolean;
}

export default function MemoryMatch() {
  const navigate = useNavigate();
  const state = getAppState();
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<GameOutcome | null>(null);
  const difficulty = state.difficulty as keyof typeof DIFFICULTY_LEVELS;
  const cardCount = DIFFICULTY_LEVELS[difficulty].cardCount;

  useEffect(() => {
    const symbols = ['🌟', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎺', '🎻', '🎮'];
    const selected = symbols.slice(0, Math.ceil(cardCount / 2));
    const newCards = [...selected, ...selected]
      .slice(0, cardCount)
      .map((symbol, idx) => ({ id: idx, symbol, matched: false, flipped: false }));
    setCards(shuffleArray(newCards));
  }, [cardCount]);

  const handleCardClick = (index: number) => {
    if (flipped.includes(index) || matched.includes(index) || flipped.length === 2) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setAttempts(attempts + 1);
      if (cards[newFlipped[0]].symbol === cards[newFlipped[1]].symbol) {
        setMatched([...matched, ...newFlipped]);
        setFlipped([]);
        if (matched.length + 2 === cardCount) {
          finishGame();
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const finishGame = () => {
    const accuracyValue = calculateAccuracy(cardCount / 2, attempts);
    const outcome = recordGameResult('memory-match', 'Memory Match', accuracyValue, Math.round(accuracyValue));
    setResult(toOutcome(outcome, accuracyValue, getRandomMotivationalMessage()));
    setShowResult(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-wellness-50 to-white py-8 px-4 pt-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-wellness-700 mb-6 text-center">Memory Match 🎮</h1>
        
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            <span className="font-bold text-lg">Matched Pairs: {matched.length / 2} / {cardCount / 2}</span>
            <span className="font-bold text-lg">Attempts: {attempts}</span>
          </div>
          <ProgressBar progress={(matched.length / cardCount) * 100} size="lg" showPercentage={false} />
        </div>

        <div className={`grid gap-3 md:gap-4 mb-8 p-6 md:p-8 bg-white rounded-lg ${
          cardCount === 6 ? 'grid-cols-3' : cardCount === 8 ? 'grid-cols-4' : 'grid-cols-5'
        }`}>
          {cards.map((card, idx) => (
            <button
              key={idx}
              onClick={() => handleCardClick(idx)}
              className={`aspect-square text-3xl md:text-4xl font-bold rounded-lg transition-all transform ${
                flipped.includes(idx) || matched.includes(idx)
                  ? 'bg-wellness-100 scale-95'
                  : 'bg-gradient-to-br from-wellness-400 to-wellness-600 hover:scale-105 cursor-pointer'
              } ${matched.includes(idx) ? 'ring-4 ring-green-500' : ''}`}
            >
              {flipped.includes(idx) || matched.includes(idx) ? card.symbol : '?'}
            </button>
          ))}
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
        title={result?.message || '🎉 Great Job!'}
        onClose={() => navigate('/dashboard')}
        onAction={() => navigate('/dashboard')}
        actionLabel="Continue"
      >
        <div className="text-center space-y-4">
          <p className="text-3xl font-bold text-wellness-600">{result?.accuracy || 0}%</p>
          <p className="text-lg text-gray-700">Accuracy</p>
          <p className="text-xl font-bold text-green-600">+{result?.points || 0} Companion Points</p>
          <p className="text-sm text-gray-600">Your companion is growing! Come back tomorrow for more games.</p>
        </div>
        <GameResultExtras outcome={result} />
      </Modal>
    </div>
  );
}
