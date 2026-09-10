import { useState } from 'react';
import { getAppState, saveAppState, resetToDefaults, loadDemoData } from '../utils/localStorage.ts';
import { COMPANION_OPTIONS } from '../data/companions.ts';
import { sortByTime, notificationPermission, requestNotificationPermission } from '../utils/reminders.ts';

export default function Settings() {
  const [state, setState] = useState(getAppState());
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [permission, setPermission] = useState(notificationPermission);

  const flash = (msg: string) => {
    setSavedMessage(msg);
    setTimeout(() => setSavedMessage(''), 2000);
  };

  const updateReminder = (id: string, changes: Partial<{ time: string; enabled: boolean }>) => {
    const updated = {
      ...state,
      reminders: state.reminders.map((r) => (r.id === id ? { ...r, ...changes } : r)),
    };
    saveAppState(updated);
    setState(updated);
    flash('✓ Reminder updated!');
  };

  const handleEnableNotifications = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    flash(result === 'granted' ? '✓ Alerts turned on!' : 'Alerts were not enabled.');
  };

  const handleInteractionModeChange = (mode: 'voice' | 'touch') => {
    const updated = {
      ...state,
      user: {
        ...state.user,
        interactionMode: mode,
      },
    };
    saveAppState(updated);
    setState(updated);
    setSavedMessage('✓ Saved successfully!');
    setTimeout(() => setSavedMessage(''), 2000);
  };

  const handleOfflineModeToggle = () => {
    const updated = {
      ...state,
      user: {
        ...state.user,
        offlineMode: !state.user.offlineMode,
      },
    };
    saveAppState(updated);
    setState(updated);
    setSavedMessage('✓ Saved successfully!');
    setTimeout(() => setSavedMessage(''), 2000);
  };

  const handleReset = () => {
    resetToDefaults();
    setState(getAppState());
    setShowResetConfirm(false);
    setSavedMessage('✓ Data reset successfully!');
    setTimeout(() => setSavedMessage(''), 2000);
  };

  const handleLoadDemo = () => {
    loadDemoData();
    setState(getAppState());
    setSavedMessage('✓ Demo data loaded!');
    setTimeout(() => setSavedMessage(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-wellness-50 to-white py-8 px-4 pt-24">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-wellness-700">Settings ⚙️</h1>

        {/* Success Message */}
        {savedMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded text-green-700 font-semibold">
            {savedMessage}
          </div>
        )}

        {/* Daily Reminders */}
        <div className="bg-white p-6 md:p-8 rounded-lg border-2 border-wellness-200">
          <h2 className="text-2xl font-bold text-wellness-700 mb-2">Daily Reminders</h2>
          <p className="text-gray-600 mb-6">Set the time each reminder should appear on the dashboard.</p>

          {permission !== 'granted' && (
            <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-300 rounded-lg flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-amber-800 font-medium">
                {permission === 'unsupported'
                  ? 'This browser does not support notifications. Reminders still appear on the dashboard.'
                  : permission === 'denied'
                    ? 'Notifications are blocked. Enable them in your browser settings to get alerts.'
                    : 'Turn on notifications to be alerted when a reminder is due.'}
              </p>
              {permission === 'default' && (
                <button
                  onClick={handleEnableNotifications}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-5 rounded-lg transition-all"
                >
                  Turn On Alerts
                </button>
              )}
            </div>
          )}

          <div className="space-y-3">
            {sortByTime(state.reminders).map((reminder) => (
              <div
                key={reminder.id}
                className={`flex flex-wrap items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                  reminder.enabled ? 'border-wellness-200 bg-white' : 'border-gray-200 bg-gray-50 opacity-70'
                }`}
              >
                <span className="text-2xl">{reminder.icon}</span>
                <div className="flex-1 min-w-[8rem]">
                  <p className="font-bold text-gray-800">{reminder.label}</p>
                  <p className="text-sm text-gray-600">{reminder.description}</p>
                </div>
                <label className="sr-only" htmlFor={`time-${reminder.id}`}>
                  {reminder.label} time
                </label>
                <input
                  id={`time-${reminder.id}`}
                  type="time"
                  value={reminder.time}
                  disabled={!reminder.enabled}
                  onChange={(e) => updateReminder(reminder.id, { time: e.target.value })}
                  className="border-2 border-gray-300 rounded-lg px-3 py-2 text-lg font-semibold focus:border-wellness-500 disabled:bg-gray-100 disabled:text-gray-400"
                />
                <button
                  onClick={() => updateReminder(reminder.id, { enabled: !reminder.enabled })}
                  aria-pressed={reminder.enabled}
                  aria-label={`${reminder.enabled ? 'Disable' : 'Enable'} ${reminder.label}`}
                  className={`relative w-16 h-9 rounded-full transition-all shrink-0 ${
                    reminder.enabled ? 'bg-wellness-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-7 h-7 bg-white rounded-full shadow transition-all ${
                      reminder.enabled ? 'left-8' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Interaction Mode */}
        <div className="bg-white p-6 md:p-8 rounded-lg border-2 border-wellness-200">
          <h2 className="text-2xl font-bold text-wellness-700 mb-6">Interaction Mode</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleInteractionModeChange('voice')}
              className={`p-6 rounded-lg border-2 transition-all ${
                state.user.interactionMode === 'voice'
                  ? 'bg-wellness-100 border-wellness-500'
                  : 'bg-gray-50 border-gray-300 hover:border-wellness-300'
              }`}
            >
              <p className="text-3xl mb-3">🎤</p>
              <p className="font-bold text-lg text-gray-800">Voice Assisted</p>
              <p className="text-sm text-gray-600 mt-2">Use voice commands and audio feedback</p>
              {state.user.interactionMode === 'voice' && <p className="text-wellness-600 font-bold mt-3">✓ Selected</p>}
            </button>

            <button
              onClick={() => handleInteractionModeChange('touch')}
              className={`p-6 rounded-lg border-2 transition-all ${
                state.user.interactionMode === 'touch'
                  ? 'bg-wellness-100 border-wellness-500'
                  : 'bg-gray-50 border-gray-300 hover:border-wellness-300'
              }`}
            >
              <p className="text-3xl mb-3">👆</p>
              <p className="font-bold text-lg text-gray-800">Touch & Tap</p>
              <p className="text-sm text-gray-600 mt-2">Use taps and touches on screen</p>
              {state.user.interactionMode === 'touch' && <p className="text-wellness-600 font-bold mt-3">✓ Selected</p>}
            </button>
          </div>
        </div>

        {/* Connectivity Settings */}
        <div className="bg-white p-6 md:p-8 rounded-lg border-2 border-wellness-200">
          <h2 className="text-2xl font-bold text-wellness-700 mb-6">Connectivity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-bold text-gray-800">Offline Mode</p>
                <p className="text-sm text-gray-600">Changes will sync when online</p>
              </div>
              <button
                onClick={handleOfflineModeToggle}
                className={`px-6 py-2 rounded-lg font-bold transition-all ${
                  state.user.offlineMode
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {state.user.offlineMode ? 'ON' : 'OFF'}
              </button>
            </div>
            <p className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
              💡 Offline mode allows the app to work without internet. Your progress is saved locally and syncs when you're back online.
            </p>
          </div>
        </div>

        {/* Patient Profile */}
        <div className="bg-white p-6 md:p-8 rounded-lg border-2 border-wellness-200">
          <h2 className="text-2xl font-bold text-wellness-700 mb-6">Patient Profile</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Patient Name</p>
              <p className="text-2xl font-bold text-gray-800">{state.user.name}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Selected Companion</p>
              <p className="text-2xl font-bold text-gray-800">
                {COMPANION_OPTIONS.find((c) => c.id === state.companion.type)?.name}
              </p>
            </div>
          </div>
        </div>

        {/* Accessibility Features */}
        <div className="bg-wellness-50 p-6 md:p-8 rounded-lg border-2 border-wellness-200">
          <h2 className="text-2xl font-bold text-wellness-700 mb-4">♿ Accessibility Features</h2>
          <div className="space-y-3">
            {[
              { icon: '🔤', name: 'Large Text', desc: '18px minimum font size' },
              { icon: '🎯', name: 'Simple Navigation', desc: 'Minimal menus and clear buttons' },
              { icon: '✨', name: 'High Contrast', desc: 'Colors chosen for readability' },
              { icon: '🎤', name: 'Voice Support', desc: 'Complete voice interface option' },
              { icon: '⏸️', name: 'Pause Anytime', desc: 'Resume games when ready' },
              { icon: '🌐', name: 'Multilingual', desc: 'Support for 5+ languages' },
            ].map((feature) => (
              <div key={feature.name} className="flex items-start gap-3 p-3">
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <p className="font-bold text-gray-800">{feature.name}</p>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo & Testing */}
        <div className="bg-white p-6 md:p-8 rounded-lg border-2 border-wellness-200">
          <h2 className="text-2xl font-bold text-wellness-700 mb-6">Demo & Testing</h2>
          <div className="space-y-3">
            <button
              onClick={handleLoadDemo}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all text-lg"
            >
              📊 Load Demo Data
            </button>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-all text-lg"
            >
              🔄 Reset All Data
            </button>
          </div>
        </div>

        {/* Reset Confirmation */}
        {showResetConfirm && (
          <div className="bg-red-50 p-6 rounded-lg border-2 border-red-300">
            <p className="font-bold text-red-800 mb-4">Are you sure you want to reset all data?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        )}

        {/* About */}
        <div className="bg-gray-100 p-6 md:p-8 rounded-lg border-2 border-gray-300 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">About WATCH</h2>
          <p className="text-base font-semibold text-wellness-700 mb-3">
            <span className="text-wellness-600">W</span>ellness{' '}
            <span className="text-wellness-600">A</span>nomaly{' '}
            <span className="text-wellness-600">T</span>racking and{' '}
            <span className="text-wellness-600">C</span>aregiver{' '}
            <span className="text-wellness-600">H</span>elp
          </p>
          <p className="text-gray-700 mb-3">Version 1.0.0 | Hackathon Demo</p>
          <p className="text-sm text-gray-600 mb-6">
            A cognitive gaming and memory assistance platform designed for elderly patients in Northeast India
          </p>
          <div className="space-y-2 text-xs md:text-sm text-gray-600">
            <p>❤️ Made with care for our elderly community</p>
            <p>🌐 Multilingual support for NER languages</p>
            <p>📱 Works offline for connectivity-challenged areas</p>
            <p className="pt-4 font-semibold">This is a demo prototype for hackathon presentation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
