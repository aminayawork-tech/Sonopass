// Free plan: one Quick 10 per day, for one registry. The same 10 questions are kept for the day,
// so leaving and coming back resumes them instead of drawing new ones.
const KEY = 'sonopass_free_quick10';

export interface FreeQuickTen {
  date: string;          // local YYYY-MM-DD
  modality: string;      // registry id the free set was used on
  questionIds: string[];
  completed: boolean;
}

export function todayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getTodaysQuickTen(): FreeQuickTen | null {
  try {
    const raw = localStorage.getItem(KEY);
    const v: FreeQuickTen | null = raw ? JSON.parse(raw) : null;
    return v && v.date === todayKey() ? v : null;
  } catch {
    return null;
  }
}

export function startTodaysQuickTen(modality: string, questionIds: string[]): FreeQuickTen {
  const v: FreeQuickTen = { date: todayKey(), modality, questionIds, completed: false };
  try {
    localStorage.setItem(KEY, JSON.stringify(v));
  } catch {
    // ignore
  }
  return v;
}

export function completeTodaysQuickTen() {
  const v = getTodaysQuickTen();
  if (!v) return;
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...v, completed: true }));
  } catch {
    // ignore
  }
}

export type QuickTenAccess =
  | { allowed: true; resumeIds: string[] | null }
  | { allowed: false; reason: 'used' | 'other-registry'; modality: string };

export function quickTenAccess(modality: string): QuickTenAccess {
  const today = getTodaysQuickTen();
  if (!today) return { allowed: true, resumeIds: null };
  if (today.modality !== modality) return { allowed: false, reason: 'other-registry', modality: today.modality };
  if (today.completed) return { allowed: false, reason: 'used', modality: today.modality };
  return { allowed: true, resumeIds: today.questionIds };
}
