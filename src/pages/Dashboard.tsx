import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { BellRing, Bell } from 'lucide-react';
import Companion from '../components/Companion.tsx';
import ReminderCard from '../components/ReminderCard.tsx';
import GameCard from '../components/GameCard.tsx';
import VoiceButton from '../components/VoiceButton.tsx';
import { getAppState, saveAppState, loadDemoData } from '../utils/localStorage.ts';
import { getFreshState } from '../utils/stats.ts';
import { GAMES } from '../data/games.ts';
import { useReminderAlerts } from '../hooks/useReminderAlerts.ts';
import {
  describeTiming,
  formatTime,
  getReminderStatus,
  nextReminder,
  notificationPermission,
  requestNotificationPermission,
  sortByTime,
} from '../utils/reminders.ts';

export default function Dashboard() {
  const [state, setState] = useState(getFreshState);
  const [permission, setPermission] = useState(notificationPermission);

  const { user, companion, daily, stats } = state;
  const reminders = sortByTime(state.reminders.filter((r) => r.enabled));
  const now = useReminderAlerts(reminders, daily.tasksCompleted);

  const handleTaskComplete = (taskId: string) => {
    const alreadyDone = daily.tasksCompleted.includes(taskId);
    const delta = alreadyDone ? -5 : 5;
    const updated = {
      ...state,
      daily: {
        ...daily,
        tasksCompleted: alreadyDone
          ? daily.tasksCompleted.filter((t) => t !== taskId)
          : [...daily.tasksCompleted, taskId],
        pointsEarned: Math.max(0, daily.pointsEarned + delta),
      },
      stats: { ...stats, totalPoints: Math.max(0, stats.totalPoints + delta) },
    };
    saveAppState(updated);
    setState(updated);
  };

  const handleLoadDemo = () => {
    loadDemoData();
    setState(getAppState());
  };

  const handleEnableNotifications = async () => {
    setPermission(await requestNotificationPermission());
  };

  if (!user.hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  const statuses = reminders.map((r) => ({
    reminder: r,
    completed: daily.tasksCompleted.includes(r.id),
    status: getReminderStatus(r, daily.tasksCompleted.includes(r.id), now),
  }));
  const needsAttention = statuses.filter((s) => s.status === 'due' || s.status === 'overdue');
  const upNext = nextReminder(reminders, daily.tasksCompleted, now);
  const hour = now.getHours();

  return (
    <div className="min-h-screen bg-gradient-to-b from-wellness-50 to-white py-8 px-4 pt-24">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Greeting Section */}
        <div className="bg-gradient-to-r from-wellness-400 to-wellness-600 text-white p-6 md:p-8 rounded-lg">
          <p className="text-2xl md:text-3xl font-bold mb-2">
            Good {hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening'} 👋
          </p>
          <p className="text-lg md:text-xl">{user.name}! Ready for some cognitive games today?</p>
          {upNext && (
            <p className="mt-4 inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm md:text-base font-semibold">
              <Bell size={18} /> Up next: {upNext.icon} {upNext.label} at {formatTime(upNext.time)}
            </p>
          )}
        </div>

        {/* Due-now banner */}
        {needsAttention.length > 0 && (
          <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-5 flex items-start gap-4">
            <BellRing size={28} className="text-amber-600 shrink-0 mt-0.5 animate-pulse-glow" />
            <div className="flex-1">
              <p className="font-bold text-amber-900 text-lg">
                {needsAttention.length} reminder{needsAttention.length === 1 ? '' : 's'} need
                {needsAttention.length === 1 ? 's' : ''} attention
              </p>
              <p className="text-amber-800">
                {needsAttention.map((s) => `${s.reminder.icon} ${s.reminder.label}`).join(' · ')}
              </p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { label: 'Daily Progress', value: `${daily.tasksCompleted.length}/${reminders.length}`, icon: '📊' },
            { label: 'Games Today', value: daily.gamesCompleted.length.toString(), icon: '🎮' },
            { label: 'Day Streak', value: stats.currentStreak.toString(), icon: '🔥' },
            { label: 'Companion', value: `${companion.progress}%`, icon: '🦋' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-4 rounded-lg border-2 border-wellness-200 text-center">
              <p className="text-2xl md:text-3xl mb-2">{stat.icon}</p>
              <p className="text-xs md:text-sm text-gray-600">{stat.label}</p>
              <p className="text-xl md:text-2xl font-bold text-wellness-600">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Companion Display */}
        <div className="bg-white p-6 md:p-8 rounded-lg border-2 border-wellness-200">
          <h2 className="text-2xl font-bold text-wellness-700 mb-6 text-center">Your Companion</h2>
          <Companion type={companion.type} progress={companion.progress} size="md" />
        </div>

        {/* Wellness Check-in */}
        <div className="bg-white p-6 md:p-8 rounded-lg border-2 border-wellness-200">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h2 className="text-2xl font-bold text-wellness-700">Today's Reminders</h2>
            {permission !== 'granted' && permission !== 'unsupported' && (
              <button
                onClick={handleEnableNotifications}
                className="inline-flex items-center gap-2 text-sm font-semibold bg-wellness-100 hover:bg-wellness-200 text-wellness-700 px-4 py-2 rounded-full transition-all"
              >
                <Bell size={16} /> Turn on alerts
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {statuses.map(({ reminder, completed, status }) => (
              <ReminderCard
                key={reminder.id}
                icon={reminder.icon}
                label={reminder.label}
                description={reminder.description}
                completed={completed}
                status={status}
                timing={describeTiming(reminder, status, now)}
                onClick={() => handleTaskComplete(reminder.id)}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Reminder times can be changed in Settings.
          </p>
        </div>

        {/* Games Section */}
        <div className="bg-white p-6 md:p-8 rounded-lg border-2 border-wellness-200">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
            <h2 className="text-2xl font-bold text-wellness-700">Let's Play!</h2>
            <span className="text-sm font-semibold text-wellness-600 bg-wellness-50 px-3 py-1 rounded-full capitalize">
              Level: {state.difficulty}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {GAMES.map((game) => (
              <GameCard
                key={game.id}
                id={game.id}
                name={game.name}
                description={game.description}
                icon={game.icon}
                duration={game.duration}
                difficulty={state.difficulty}
              />
            ))}
          </div>

          {/* Voice Button */}
          <div className="flex justify-center mb-6">
            <VoiceButton />
          </div>

          {/* Demo Mode */}
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-300 text-center">
            <p className="text-sm text-blue-700 mb-3">Want to see demo data with progress?</p>
            <button
              onClick={handleLoadDemo}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-all"
            >
              Load Demo Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
