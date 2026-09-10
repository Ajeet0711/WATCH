import { useEffect, useState } from 'react';
import type { Reminder } from '../utils/localStorage.ts';
import { dateKey } from '../utils/stats.ts';
import {
  fireReminderNotification,
  getReminderStatus,
  hasNotified,
  markNotified,
} from '../utils/reminders.ts';

const CHECK_INTERVAL_MS = 30_000;

/**
 * Re-renders on a timer so reminder statuses stay live, and fires a browser
 * notification the first time each enabled reminder comes due today.
 */
export function useReminderAlerts(reminders: Reminder[], completedIds: string[]): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), CHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const today = dateKey(now);
    for (const reminder of reminders) {
      if (!reminder.enabled || completedIds.includes(reminder.id)) continue;
      if (getReminderStatus(reminder, false, now) !== 'due') continue;
      if (hasNotified(today, reminder.id)) continue;
      markNotified(today, reminder.id);
      fireReminderNotification(reminder);
    }
  }, [now, reminders, completedIds]);

  return now;
}
