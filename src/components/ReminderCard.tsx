import { CheckCircle2, Circle, AlarmClock, Clock } from 'lucide-react';
import type { ReminderStatus } from '../utils/reminders.ts';

interface ReminderCardProps {
  icon: string;
  label: string;
  description: string;
  completed: boolean;
  onClick: () => void;
  status?: ReminderStatus;
  timing?: string;
}

const STATUS_STYLES: Record<ReminderStatus, string> = {
  done: 'bg-green-50 border-green-300',
  due: 'bg-amber-50 border-amber-400 shadow-md shadow-amber-100 ring-2 ring-amber-200',
  overdue: 'bg-red-50 border-red-400 shadow-md shadow-red-100',
  upcoming: 'bg-white border-gray-300 hover:border-wellness-400 hover:shadow-md',
};

const BADGE_STYLES: Record<ReminderStatus, string> = {
  done: 'text-green-700 bg-green-100',
  due: 'text-amber-800 bg-amber-100',
  overdue: 'text-red-700 bg-red-100',
  upcoming: 'text-gray-600 bg-gray-100',
};

export default function ReminderCard({
  icon,
  label,
  description,
  completed,
  onClick,
  status = completed ? 'done' : 'upcoming',
  timing,
}: ReminderCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={completed}
      className={`w-full text-left p-4 md:p-5 rounded-lg border-2 transition-all cursor-pointer ${STATUS_STYLES[status]} ${
        completed ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        <span className={`text-2xl md:text-3xl mt-1 ${status === 'due' ? 'animate-pulse-glow' : ''}`}>
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <h4
            className={`font-bold text-base md:text-lg ${
              completed ? 'text-gray-500 line-through' : 'text-gray-800'
            }`}
          >
            {label}
          </h4>
          <p className={`text-sm ${completed ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
          {timing && (
            <span
              className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-xs font-semibold ${BADGE_STYLES[status]}`}
            >
              {status === 'due' || status === 'overdue' ? <AlarmClock size={13} /> : <Clock size={13} />}
              {timing}
            </span>
          )}
        </div>
        <div className="mt-1 shrink-0">
          {completed ? (
            <CheckCircle2 size={24} className="text-green-500" />
          ) : (
            <Circle size={24} className={status === 'overdue' ? 'text-red-400' : 'text-gray-400'} />
          )}
        </div>
      </div>
    </button>
  );
}
