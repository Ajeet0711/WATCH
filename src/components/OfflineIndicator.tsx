import { AlertCircle } from 'lucide-react';
import { getAppState } from '../utils/localStorage.ts';

export default function OfflineIndicator() {
  const state = getAppState();

  if (!state.user.offlineMode) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 rounded shadow-lg flex items-center gap-3 max-w-xs z-30 animate-pulse">
      <AlertCircle size={24} />
      <div>
        <p className="font-bold text-sm">Offline Mode</p>
        <p className="text-xs">Changes will sync when online</p>
      </div>
    </div>
  );
}
