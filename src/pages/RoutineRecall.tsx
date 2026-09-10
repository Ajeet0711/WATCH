import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal.tsx';
import { getDailyRoutineActivities, calculateAccuracy, getRandomMotivationalMessage } from '../utils/gameHelpers.ts';
import { recordGameResult, toOutcome } from '../utils/stats.ts';
import type { GameOutcome } from '../utils/stats.ts';
import GameResultExtras from '../components/GameResultExtras.tsx';

export default function RoutineRecall() {
  const navigate = useNavigate();
  const activities = getDailyRoutineActivities();
  const correctOrder = activities;

  const [userOrder, setUserOrder] = useState<typeof activities>([]);
  const [availableActivities, setAvailableActivities] = useState(activities);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<GameOutcome | null>(null);

  const handleActivityClick = (activity: typeof activities[0]) => {
    setUserOrder([...userOrder, activity]);
    setAvailableActivities(availableActivities.filter((a) => a.activity !== activity.activity));
  };

  const handleRemove = (index: number) => {
    const removed = userOrder[index];
    setAvailableActivities([...availableActivities, removed].sort((a, b) => a.activity.localeCompare(b.activity)));
    setUserOrder(userOrder.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    let correct = 0;
    userOrder.forEach((activity, idx) => {
      if (correctOrder[idx].activity === activity.activity) {
        correct++;
      }
    });

    const accuracy = calculateAccuracy(correct, correctOrder.length);
    const outcome = recordGameResult('routine-recall', 'Routine Recall', accuracy, correct);

    setResult(toOutcome(outcome, accuracy, getRandomMotivationalMessage(), {
      correct,
      total: correctOrder.length,
    }));
    setShowResult(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-wellness-50 to-white py-8 px-4 pt-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-wellness-700 mb-6 text-center">Routine Recall ⏰</h1>

        <div className="mb-8 p-6 md:p-8 bg-white rounded-lg">
          <p className="text-lg text-center font-bold text-gray-700 mb-6">Arrange your daily routine in the correct order</p>

          {/* User's Selected Order */}
          <div className="mb-8">
            <p className="text-sm font-bold text-gray-600 mb-3">Your Order:</p>
            <div className="bg-wellness-50 p-4 rounded-lg min-h-24 space-y-2">
              {userOrder.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Tap activities below to arrange them...</p>
              ) : (
                userOrder.map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white p-3 rounded-lg border-2 border-wellness-300"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-wellness-600 text-lg">{idx + 1}</span>
                      <span className="text-2xl">{activity.emoji}</span>
                      <span className="font-semibold text-gray-800">{activity.activity}</span>
                    </div>
                    <button
                      onClick={() => handleRemove(idx)}
                      className="text-red-500 hover:text-red-700 font-bold text-lg"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Available Activities */}
          <div>
            <p className="text-sm font-bold text-gray-600 mb-3">Available Activities:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableActivities.map((activity) => (
                <button
                  key={activity.activity}
                  onClick={() => handleActivityClick(activity)}
                  className="p-3 bg-gradient-to-r from-wellness-100 to-wellness-200 hover:from-wellness-200 hover:to-wellness-300 border-2 border-wellness-300 rounded-lg text-left transition-all transform hover:scale-105 font-semibold"
                >
                  <span className="text-xl mr-3">{activity.emoji}</span>
                  {activity.activity}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg"
          >
            Cancel
          </button>
          {userOrder.length === correctOrder.length && (
            <button
              onClick={handleSubmit}
              className="flex-1 bg-wellness-500 hover:bg-wellness-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all"
            >
              Submit ✓
            </button>
          )}
        </div>
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
            You got {result?.correct || 0} out of {result?.total || 5} in correct order
          </p>
          <p className="text-xl font-bold text-green-600">+{result?.points || 0} Companion Points</p>
        </div>
        <GameResultExtras outcome={result} />
      </Modal>
    </div>
  );
}
