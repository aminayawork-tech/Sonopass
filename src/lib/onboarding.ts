const KEY = 'sonopass_onboarding';

export interface OnboardingAnswers {
  examFocus: string | null;   // registry id
  examDate: string | null;    // YYYY-MM-DD
  completedAt: string | null;
}

export function getOnboarding(): OnboardingAnswers {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { examFocus: null, examDate: null, completedAt: null };
}

export function saveOnboarding(answers: OnboardingAnswers) {
  try {
    localStorage.setItem(KEY, JSON.stringify(answers));
  } catch {
    // storage unavailable
  }
}

export function daysUntil(date: string | null): number | null {
  if (!date) return null;
  const target = new Date(`${date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}
