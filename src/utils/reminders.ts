import type { Reminder } from './localStorage.ts';

export type ReminderStatus = 'done' | 'overdue' | 'due' | 'upcoming';

/** Minutes past local midnight for a "HH:MM" string. */
export function minutesOfDay(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function nowMinutes(now: Date = new Date()): number {
  return now.getHours() * 60 + now.getMinutes();
}

/** "08:00" -> "8:00 AM", using the viewer's locale. */
export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const d = new Date();
  d.setHours(h || 0, m || 0, 0, 0);
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

/** A reminder counts as "due" from its time until 60 minutes after. */
export const DUE_WINDOW_MINUTES = 60;

export function getReminderStatus(
  reminder: Reminder,
  completed: boolean,
  now: Date = new Date(),
): ReminderStatus {
  if (completed) return 'done';
  const delta = nowMinutes(now) - minutesOfDay(reminder.time);
  if (delta < 0) return 'upcoming';
  return delta <= DUE_WINDOW_MINUTES ? 'due' : 'overdue';
}

/** Human phrasing for how far away a reminder is. */
export function describeTiming(reminder: Reminder, status: ReminderStatus, now: Date = new Date()): string {
  const delta = nowMinutes(now) - minutesOfDay(reminder.time);
  if (status === 'done') return `Completed · ${formatTime(reminder.time)}`;
  if (status === 'due') return `Due now · ${formatTime(reminder.time)}`;
  if (status === 'overdue') {
    const hours = Math.floor(delta / 60);
    return hours >= 1
      ? `Overdue by ${hours} hour${hours === 1 ? '' : 's'}`
      : `Overdue by ${delta} minutes`;
  }
  const until = -delta;
  if (until < 60) return `In ${until} minute${until === 1 ? '' : 's'}`;
  const hours = Math.floor(until / 60);
  return `At ${formatTime(reminder.time)} · in ${hours} hour${hours === 1 ? '' : 's'}`;
}

/** Sorts by clock time so the day reads top to bottom. */
export function sortByTime(reminders: Reminder[]): Reminder[] {
  return [...reminders].sort((a, b) => minutesOfDay(a.time) - minutesOfDay(b.time));
}

export function nextReminder(reminders: Reminder[], completedIds: string[], now: Date = new Date()): Reminder | null {
  const pending = sortByTime(reminders).filter(
    (r) => r.enabled && !completedIds.includes(r.id) && minutesOfDay(r.time) >= nowMinutes(now),
  );
  return pending[0] ?? null;
}

/* -------------------------------------------------------------------------- */
/* Browser notifications                                                      */
/* -------------------------------------------------------------------------- */

const NOTIFIED_KEY = 'watchNotified';

export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function notificationPermission(): NotificationPermission | 'unsupported' {
  return notificationsSupported() ? Notification.permission : 'unsupported';
}

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!notificationsSupported()) return 'unsupported';
  if (Notification.permission !== 'default') return Notification.permission;
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

/** Tracks which reminders already fired today so a reminder alerts once. */
function readNotified(dayKey: string): string[] {
  try {
    const raw = localStorage.getItem(NOTIFIED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { date: string; ids: string[] };
    return parsed.date === dayKey ? parsed.ids : [];
  } catch {
    return [];
  }
}

function writeNotified(dayKey: string, ids: string[]): void {
  try {
    localStorage.setItem(NOTIFIED_KEY, JSON.stringify({ date: dayKey, ids }));
  } catch {
    /* storage full or blocked — notifications simply repeat next session */
  }
}

export function hasNotified(dayKey: string, id: string): boolean {
  return readNotified(dayKey).includes(id);
}

export function markNotified(dayKey: string, id: string): void {
  const ids = readNotified(dayKey);
  if (!ids.includes(id)) writeNotified(dayKey, [...ids, id]);
}

export function fireReminderNotification(reminder: Reminder): void {
  if (!notificationsSupported() || Notification.permission !== 'granted') return;
  try {
    new Notification(`${reminder.icon} ${reminder.label}`, {
      body: `${reminder.description} · ${formatTime(reminder.time)}`,
      tag: `watch-${reminder.id}`,
      icon: `${import.meta.env.BASE_URL}favicon.svg`,
    });
  } catch {
    /* some browsers block constructed Notifications outside a service worker */
  }
}
