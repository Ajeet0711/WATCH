import { useState } from 'react';
import Companion from '../components/Companion.tsx';
import ProgressBar from '../components/ProgressBar.tsx';
import { loadDemoData } from '../utils/localStorage.ts';
import { getFreshState, getDailyAccuracy, getRecentAccuracy, formatRelativeTime } from '../utils/stats.ts';
import { getReminderStatus, sortByTime } from '../utils/reminders.ts';
import { COMPANION_OPTIONS } from '../data/companions.ts';

export default function CaregiverDashboard() {
  const [state, setState] = useState(getFreshState);

  const handleLoadDemo = () => {
    loadDemoData();
    setState(getFreshState());
  };

  const user = state.user;
  const companion = state.companion;
  const stats = state.stats;
  const daily = state.daily;

  const recentActivities = [...state.history]
    .slice(-5)
    .reverse()
    .map((g) => ({
      name: g.gameName,
      time: formatRelativeTime(g.date),
      status: g.accuracy >= 70 ? '✓' : '•',
    }));

  const weekly = getDailyAccuracy(state.history, 7);
  const weeklyPeak = Math.max(100, ...weekly.map((d) => d.value));
  const recentAccuracy = getRecentAccuracy(state.history, 5);
  const activeDays = weekly.filter((d) => d.value > 0).length;

  // Reminders the patient has not yet checked off today.
  const missedReminders = sortByTime(state.reminders.filter((r) => r.enabled)).filter(
    (r) => getReminderStatus(r, daily.tasksCompleted.includes(r.id)) === 'overdue',
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-wellness-50 to-white py-8 px-4 pt-24">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-wellness-700">Caregiver Dashboard 📊</h1>

        {/* Patient Info Header */}
        <div className="bg-gradient-to-r from-wellness-400 to-wellness-600 text-white p-8 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-sm mb-2 opacity-90">Patient Name</p>
              <p className="text-3xl font-bold mb-4">{user.name}</p>
              <p className="text-lg mb-2">
                Companion: {COMPANION_OPTIONS.find((c) => c.id === companion.type)?.name}
              </p>
              <p className="text-sm opacity-90">Stage: {Math.ceil(companion.progress / 25)}/4</p>
            </div>
            <div className="text-right">
              <div className="mb-4">
                <p className="text-sm mb-1 opacity-90">Current Streak</p>
                <p className="text-5xl font-bold">🔥 {stats.currentStreak}</p>
              </div>
              <div>
                <p className="text-sm mb-1 opacity-90">Total Points</p>
                <p className="text-3xl font-bold">{stats.totalPoints}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Daily Activity', value: `${Math.min(100, Math.round((daily.tasksCompleted.length / 5) * 100))}%`, icon: '📈', color: 'from-green-400' },
            { label: 'Games Completed', value: daily.gamesCompleted.length.toString(), icon: '🎮', color: 'from-blue-400' },
            { label: 'Current Streak', value: stats.currentStreak.toString(), icon: '🔥', color: 'from-orange-400' },
            { label: 'Companion Growth', value: `${companion.progress}%`, icon: '🦋', color: 'from-purple-400' },
          ].map((metric) => (
            <div
              key={metric.label}
              className={`bg-gradient-to-br ${metric.color} to-green-500 text-white p-6 rounded-lg shadow-lg`}
            >
              <p className="text-2xl mb-2">{metric.icon}</p>
              <p className="text-xs opacity-90">{metric.label}</p>
              <p className="text-3xl font-bold">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-8 rounded-lg border-2 border-wellness-200">
          <h2 className="text-2xl font-bold text-wellness-700 mb-4">Recent Activities</h2>
          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-800">{activity.name}</p>
                    <p className="text-sm text-gray-600">{activity.time}</p>
                  </div>
                  <span className="text-2xl text-green-500">{activity.status}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-4">No activities yet today</p>
            )}
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="bg-white p-8 rounded-lg border-2 border-wellness-200">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
            <h2 className="text-2xl font-bold text-wellness-700">Weekly Engagement</h2>
            <p className="text-sm text-gray-600">
              Active {activeDays} of 7 days
              {recentAccuracy !== null && ` · recent accuracy ${recentAccuracy}%`}
            </p>
          </div>
          <div className="flex items-end gap-2 md:gap-4 h-48 p-4 bg-gray-50 rounded-lg">
            {weekly.map((day) => (
              <div key={day.key} className="flex-1 flex flex-col items-center gap-2 justify-end h-full">
                <p className="text-xs font-bold text-gray-500">{day.value || ''}</p>
                <div
                  className={`w-full rounded-t-lg transition-all ${day.value ? 'bg-wellness-500' : 'bg-gray-200'}`}
                  style={{ height: `${Math.max((day.value / weeklyPeak) * 130, 4)}px` }}
                  title={`${day.label}: ${day.value ? `${day.value}% accuracy` : 'no activity'}`}
                />
                <p className="text-xs md:text-sm font-bold text-gray-600">{day.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Care Alerts */}
        <div className="bg-white p-8 rounded-lg border-2 border-wellness-200">
          <h2 className="text-2xl font-bold text-wellness-700 mb-4">Care Alerts</h2>
          <div className="space-y-3">
            {daily.gamesCompleted.length > 0 ? (
              <div className="p-4 bg-green-50 border-l-4 border-green-500">
                <p className="font-semibold text-green-800">✓ Great Engagement Today</p>
                <p className="text-sm text-green-700">{user.name} has completed {daily.gamesCompleted.length} game(s)</p>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border-l-4 border-amber-500">
                <p className="font-semibold text-amber-800">⏳ No Games Yet Today</p>
                <p className="text-sm text-amber-700">{user.name} has not played a game today.</p>
              </div>
            )}

            {missedReminders.length > 0 && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500">
                <p className="font-semibold text-red-800">⚠️ {missedReminders.length} Overdue Reminder(s)</p>
                <p className="text-sm text-red-700">
                  {missedReminders.map((r) => `${r.icon} ${r.label}`).join(' · ')}
                </p>
              </div>
            )}
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500">
              <p className="font-semibold text-blue-800">ℹ️ Companion Growing</p>
              <p className="text-sm text-blue-700">Companion progress: {companion.progress}%. Next milestone at 100%</p>
            </div>
            {stats.currentStreak > 0 ? (
              <div className="p-4 bg-purple-50 border-l-4 border-purple-500">
                <p className="font-semibold text-purple-800">🔥 Streak Active</p>
                <p className="text-sm text-purple-700">{user.name} has a {stats.currentStreak} day streak</p>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border-l-4 border-gray-400">
                <p className="font-semibold text-gray-800">💤 No Active Streak</p>
                <p className="text-sm text-gray-700">Playing a game today will start a new streak.</p>
              </div>
            )}
          </div>
        </div>

        {/* Companion Evolution */}
        <div className="bg-white p-8 rounded-lg border-2 border-wellness-200">
          <h2 className="text-2xl font-bold text-wellness-700 mb-6">Companion Evolution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <Companion type={companion.type} progress={companion.progress} size="lg" />
            </div>
            <div>
              <ProgressBar progress={companion.progress} label="Companion Progress" size="lg" />
              <div className="mt-6 space-y-3">
                <div className="p-4 bg-wellness-50 rounded-lg border-2 border-wellness-200">
                  <p className="font-bold text-wellness-700">Stage: {Math.ceil(companion.progress / 25)} / 4</p>
                  <p className="text-sm text-gray-600 mt-1">Keep encouraging daily activities for continued growth!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Data Section */}
        <div className="bg-blue-50 p-8 rounded-lg border-2 border-blue-300">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">📌 Demo Mode</h2>
          <p className="text-blue-700 mb-4">Load realistic test data to see the dashboard in action:</p>
          <button
            onClick={handleLoadDemo}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            Load Demo Data
          </button>
        </div>
      </div>
    </div>
  );
}
