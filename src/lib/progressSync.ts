import type { UserStats } from '@/lib/userStats';

// What gets synced to the account. Stats are the same object the app keeps in localStorage.
export interface ProgressData {
  stats: UserStats | null;
  completedTopics: string[];
}

export const STATS_KEY = 'sonopass_stats';
export const TOPICS_KEY = 'completedTopics';
const OWNER_KEY = 'sonopass_progress_owner';      // account id the local progress belongs to (absent = guest)
const UPDATED_KEY = 'sonopass_progress_updated_at'; // when local progress last changed
export const PROGRESS_CHANGED_EVENT = 'sonopass:progress-changed';

export function readLocalProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    const topics = localStorage.getItem(TOPICS_KEY);
    return { stats: raw ? JSON.parse(raw) : null, completedTopics: topics ? JSON.parse(topics) : [] };
  } catch {
    return { stats: null, completedTopics: [] };
  }
}

export function writeLocalProgress(data: ProgressData) {
  if (data.stats) localStorage.setItem(STATS_KEY, JSON.stringify(data.stats));
  else localStorage.removeItem(STATS_KEY);
  localStorage.setItem(TOPICS_KEY, JSON.stringify(data.completedTopics ?? []));
}

// Called whenever the app saves progress, so signed-in users get it pushed to their account.
export function markLocalProgressChanged() {
  try {
    localStorage.setItem(UPDATED_KEY, new Date().toISOString());
    window.dispatchEvent(new Event(PROGRESS_CHANGED_EVENT));
  } catch {
    // storage unavailable
  }
}

export const getLocalOwner = () => localStorage.getItem(OWNER_KEY);
export const setLocalOwner = (userId: string) => localStorage.setItem(OWNER_KEY, userId);
export const getLocalUpdatedAt = () => localStorage.getItem(UPDATED_KEY);
export const setLocalUpdatedAt = (iso: string) => localStorage.setItem(UPDATED_KEY, iso);

// On sign-out the next person on this device must not see the previous account's progress.
export function clearLocalProgress() {
  [STATS_KEY, TOPICS_KEY, OWNER_KEY, UPDATED_KEY].forEach((k) => localStorage.removeItem(k));
}

export function hasMeaningfulProgress(data: ProgressData): boolean {
  const s = data.stats;
  const answered = s ? Object.values(s.modalities ?? {}).some((m) => (m?.totalAnswered ?? 0) > 0) : false;
  return answered || (s?.badges?.length ?? 0) > 0 || data.completedTopics.length > 0;
}

const later = (a?: string, b?: string) => ((a ?? '') > (b ?? '') ? a ?? '' : b ?? '');

// Combine guest progress made before signing in with what the account already has.
export function mergeProgress(account: ProgressData, guest: ProgressData): ProgressData {
  const a = account.stats;
  const g = guest.stats;
  const completedTopics = Array.from(new Set([...(account.completedTopics ?? []), ...(guest.completedTopics ?? [])]));
  if (!a || !g) return { stats: a ?? g ?? null, completedTopics };

  const modalities: UserStats['modalities'] = { ...a.modalities };
  for (const [id, gm] of Object.entries(g.modalities ?? {})) {
    const am = modalities[id];
    if (!am) {
      modalities[id] = gm;
      continue;
    }
    const categoryStats = { ...am.categoryStats };
    for (const [cat, c] of Object.entries(gm.categoryStats ?? {})) {
      const prev = categoryStats[cat] ?? { answered: 0, correct: 0 };
      categoryStats[cat] = { answered: prev.answered + c.answered, correct: prev.correct + c.correct };
    }
    const xp = am.xp + gm.xp;
    modalities[id] = {
      xp,
      level: Math.floor(xp / 500) + 1,
      totalAnswered: am.totalAnswered + gm.totalAnswered,
      totalCorrect: am.totalCorrect + gm.totalCorrect,
      correctStreak: Math.max(am.correctStreak, gm.correctStreak),
      categoryStats,
      examScores: [...(am.examScores ?? []), ...(gm.examScores ?? [])],
      lastStudyDate: later(am.lastStudyDate, gm.lastStudyDate),
    };
  }

  return {
    stats: {
      ...a,
      streak: Math.max(a.streak, g.streak),
      lastStudyDate: later(a.lastStudyDate, g.lastStudyDate),
      badges: Array.from(new Set([...(a.badges ?? []), ...(g.badges ?? [])])),
      modalities,
    },
    completedTopics,
  };
}

export type ReconcileAction = 'download' | 'upload' | 'merge' | 'reset' | 'none';

// Decides what to do when a signed-in device opens the app. Pure, so it can be unit tested.
export function decideReconcile(opts: {
  userId: string;
  localOwner: string | null;
  localUpdatedAt: string | null;
  local: ProgressData;
  server: { data: ProgressData; updated_at: string } | null;
}): ReconcileAction {
  const { userId, localOwner, localUpdatedAt, local, server } = opts;
  const localHas = hasMeaningfulProgress(local);
  const otherAccount = localOwner !== null && localOwner !== userId;
  if (!server) return otherAccount ? 'reset' : localHas ? 'upload' : 'none';
  if (localOwner === userId) return (localUpdatedAt ?? '') > server.updated_at ? 'upload' : 'download';
  if (localOwner === null && localHas) return 'merge';
  return 'download';
}
