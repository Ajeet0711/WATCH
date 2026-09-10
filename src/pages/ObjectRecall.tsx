import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar.tsx';
import Modal from '../components/Modal.tsx';
import { getObjectsForRecall, calculateAccuracy, getRandomMotivationalMessage } from '../utils/gameHelpers.ts';
import { getAppState } from '../utils/localStorage.ts';
import { recordGameResult, toOutcome } from '../utils/stats.ts';
import type { GameOutcome } from '../utils/stats.ts';
import GameResultExtras from '../components/GameResultExtras.tsx';
import { DIFFICULTY_LEVELS } from '../utils/adaptiveDifficulty.ts';

export default function ObjectRecall() {
  const navigate = useNavigate();
  const state = getAppState();
  const difficulty = state.difficulty as keyof typeof DIFFICULTY_LEVELS;
  
  const [phase, setPhase] = useState<'display' | 'recall'>('display');
  const [displayedObjects, setDisplayedObjects] = useState<string[]>([]);
  const [remainingTime, setRemainingTime] = useState(5);
  const [selections, setSelections] = useState<string[]>([]);
  const [allObjects, setAllObjects] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<GameOutcome | null>(null);

  const objectCount = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6;
  const displayTime = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6;

  useEffect(() => {
    const objects = getObjectsForRecall();
    const displayed = objects.slice(0, objectCount);
    setDisplayedObjects(displayed);
    
    const shuffled = [...displayed, ...objects.slice(objectCount, objectCount + 2)].sort(() => Math.random() - 0.5);
    setAllObjects(shuffled);
    setRemainingTime(displayTime);
  }, [objectCount, displayTime]);

  useEffect(() => {
    if (phase !== 'display') return;
    if (remainingTime <= 0) {
      setPhase('recall');
      return;
    }
    const timer = setTimeout(() => setRemainingTime(remainingTime - 1), 1000);
    return () => clearTimeout(timer);
  }, [remainingTime, phase]);

  const handleObjectClick = (obj: string) => {
    if (selections.includes(obj)) {
      setSelections(selections.filter((s) => s !== obj));
    } else {
      setSelections([...selections, obj]);
    }
  };

  const handleSubmit = () => {
    const correct = selections.filter((s) => displayedObjects.includes(s)).length;
    const accuracy = calculateAccuracy(correct, objectCount);
    const outcome = recordGameResult('object-recall', 'Object Recall', accuracy, correct);

    setResult(toOutcome(outcome, accuracy, getRandomMotivationalMessage(), {
      correct,
      total: objectCount,
    }));
    setShowResult(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-wellness-50 to-white py-8 px-4 pt-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-wellness-700 mb-6 text-center">Object Recall 👁️</h1>

        {phase === 'display' ? (
          <>
            <div className="mb-8 p-6 md:p-8 bg-white rounded-lg text-center">
              <p className="text-lg text-gray-600 mb-6">Remember these objects:</p>
              <div className="text-6xl md:text-7xl space-y-4 mb-8">
                <div className="flex justify-center gap-4 flex-wrap">
                  {displayedObjects.map((obj, idx) => (
                    <div key={idx} className="animate-pulse-glow">
                      {obj}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <p className="text-2xl font-bold text-wellness-600">{remainingTime}s</p>
                <ProgressBar progress={((displayTime - remainingTime) / displayTime) * 100} size="lg" showPercentage={false} />
              </div>
              <p className="text-sm text-gray-500">Memorize these as the display hides...</p>
            </div>
          </>
        ) : (
          <>
            <div className="mb-8 p-6 md:p-8 bg-white rounded-lg">
              <p className="text-lg text-gray-700 mb-6 text-center font-bold">Tap the objects you remember seeing:</p>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                {allObjects.map((obj, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleObjectClick(obj)}
                    className={`aspect-square text-3xl md:text-4xl rounded-lg transition-all transform ${
                      selections.includes(obj)
                        ? 'bg-green-500 ring-4 ring-green-300 scale-95'
                        : 'bg-gray-200 hover:bg-gray-300 scale-100'
                    }`}
                  >
                    {obj}
                  </button>
                ))}
              </div>
              <div className="bg-wellness-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-700">
                  Selected: <span className="font-bold text-wellness-600">{selections.length}</span>
                </p>
                <p className="text-xs text-gray-600 mt-1">You need to select {objectCount} objects</p>
              </div>
              {selections.length === objectCount && (
                <button
                  onClick={handleSubmit}
                  className="w-full bg-wellness-500 hover:bg-wellness-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all"
                >
                  Submit ✓
                </button>
              )}
            </div>
          </>
        )}

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
          <p className="text-lg text-gray-700">
            You remembered {result?.correct || 0} out of {result?.total || objectCount} objects
          </p>
          <p className="text-xl font-bold text-green-600">+{result?.points || 0} Companion Points</p>
        </div>
        <GameResultExtras outcome={result} />
      </Modal>
    </div>
  );
}
