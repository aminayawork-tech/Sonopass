import { performMigrationIfNeeded, getDefaultStats as getDefaultStatsFromMigration, getDefaultModalityStats, type NewUserStats } from './migration';

const STORAGE_KEY = 'sonopass_stats';

// Export the new multi-modality stats type
export type UserStats = NewUserStats;

// Modality-specific stats structure
export interface ModalityStats {
  xp: number;
  level: number;
  totalAnswered: number;
  totalCorrect: number;
  correctStreak: number;
  categoryStats: Record<string, { answered: number; correct: number }>;
  examScores: { exam: string; score: number; total: number; date: string }[];
  lastStudyDate: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  scope: 'global' | 'modality'; // Global or modality-specific
  modality?: string; // If modality-specific, which modality
}

export const BADGES: Badge[] = [
  // Global badges (shared across all modalities)
  { id: 'first_answer', name: 'First Steps', description: 'Answer your first question', icon: '🎯', scope: 'global' },
  { id: 'streak_3', name: 'On a Roll', description: '3-day study streak', icon: '🔥', scope: 'global' },
  { id: 'streak_7', name: 'Week Warrior', description: '7-day study streak', icon: '⚡', scope: 'global' },

  // Vascular modality badges
  { id: 'vascular_perfect_10', name: 'Perfect 10', description: 'Score 100% on Quick 10', icon: '💎', scope: 'modality', modality: 'vascular' },
  { id: 'vascular_halfway', name: 'Halfway There', description: 'Answer 95 questions', icon: '🏔️', scope: 'modality', modality: 'vascular' },
  { id: 'vascular_centurion', name: 'Centurion', description: 'Answer 100 questions', icon: '💯', scope: 'modality', modality: 'vascular' },
  { id: 'vascular_cerebrovascular_master', name: 'Brain Specialist', description: '80%+ in Cerebrovascular (10+ Qs)', icon: '🧠', scope: 'modality', modality: 'vascular' },
  { id: 'vascular_physics_master', name: 'Physics Pro', description: '80%+ in Physics & Instrumentation (10+ Qs)', icon: '📡', scope: 'modality', modality: 'vascular' },
  { id: 'vascular_exam1_complete', name: 'Exam 1 Done', description: 'Complete Mock Exam 1', icon: '📋', scope: 'modality', modality: 'vascular' },
  { id: 'vascular_exam2_complete', name: 'Exam 2 Done', description: 'Complete Mock Exam 2', icon: '📝', scope: 'modality', modality: 'vascular' },
  { id: 'vascular_level_5', name: 'Rising Star', description: 'Reach Level 5', icon: '⭐', scope: 'modality', modality: 'vascular' },
  { id: 'vascular_level_10', name: 'Expert', description: 'Reach Level 10', icon: '🏆', scope: 'modality', modality: 'vascular' },
];

export function getStats(): UserStats {
  if (typeof window === 'undefined') return getDefaultStatsFromMigration();

  // Perform migration if needed (converts old format to new)
  const migrated = performMigrationIfNeeded();
  if (migrated) {
    return migrated;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultStatsFromMigration();
    const stats = JSON.parse(raw) as UserStats;

    // Ensure modalities object exists
    if (!stats.modalities) {
      stats.modalities = { vascular: getDefaultModalityStats() };
    }

    return stats;
  } catch {
    return getDefaultStatsFromMigration();
  }
}

/**
 * Get stats for the current modality
 */
// Weighted: 70% accuracy, 20% coverage of 500 questions, +5 for a 7+ day streak
export function getRegistryReadiness(stats: UserStats): number {
  const modalityStats = getCurrentModalityStats(stats);
  if (modalityStats.totalAnswered === 0) return 0;
  const accuracy = (modalityStats.totalCorrect / modalityStats.totalAnswered) * 100;
  const coverage = (modalityStats.totalAnswered / 500) * 100;
  const consistencyBonus = stats.streak > 7 ? 5 : 0;
  return Math.min(100, Math.round(accuracy * 0.7 + coverage * 0.2 + consistencyBonus));
}

export function getCurrentModalityStats(stats: UserStats): ModalityStats {
  const modalityId = stats.currentModality || 'vascular';
  if (!stats.modalities[modalityId]) {
    stats.modalities[modalityId] = getDefaultModalityStats();
    saveStats(stats);
  }
  return stats.modalities[modalityId];
}

export function saveStats(stats: UserStats): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function updateStreak(stats: UserStats): void {
  const today = getToday();
  const modalityStats = getCurrentModalityStats(stats);

  // Update global streak
  if (stats.lastStudyDate !== today) {
    if (stats.lastStudyDate === getYesterday()) {
      stats.streak += 1;
    } else {
      stats.streak = 1;
    }
    stats.lastStudyDate = today;
  }

  // Update modality-specific last study date
  modalityStats.lastStudyDate = today;
}

export const MAX_HEARTS = 5;
export const HEART_REFILL_MS = 6 * 60 * 60 * 1000;
export const STREAK_HEART_EVERY = 5;
export const SHARE_HEART_REWARD = 2;

function refreshHearts(stats: UserStats): void {
  const lastRefill = new Date(stats.lastHeartRefill).getTime();
  if (stats.hearts < MAX_HEARTS && Date.now() - lastRefill >= HEART_REFILL_MS) {
    stats.hearts = MAX_HEARTS;
    stats.lastHeartRefill = new Date().toISOString();
  }
}

// The refill clock starts when you first drop below full, not at the last refill.
function loseHeart(stats: UserStats): void {
  if (stats.hearts <= 0) return;
  if (stats.hearts >= MAX_HEARTS) stats.lastHeartRefill = new Date().toISOString();
  stats.hearts -= 1;
}

function gainHearts(stats: UserStats, amount: number): number {
  const before = stats.hearts;
  stats.hearts = Math.min(MAX_HEARTS, stats.hearts + amount);
  return stats.hearts - before;
}

export function getHeartRefillAt(stats: UserStats): number | null {
  if (stats.hearts >= MAX_HEARTS) return null;
  return new Date(stats.lastHeartRefill).getTime() + HEART_REFILL_MS;
}

export function spendHintHeart(): UserStats | null {
  const stats = getStats();
  refreshHearts(stats);
  if (stats.hearts <= 0) {
    saveStats(stats);
    return null;
  }
  loseHeart(stats);
  saveStats(stats);
  return stats;
}

export function canClaimShareReward(stats: UserStats): boolean {
  return stats.hearts < MAX_HEARTS && stats.lastShareReward !== getToday();
}

export function claimShareReward(): { stats: UserStats; gained: number } {
  const stats = getStats();
  refreshHearts(stats);
  if (!canClaimShareReward(stats)) return { stats, gained: 0 };
  const gained = gainHearts(stats, SHARE_HEART_REWARD);
  stats.lastShareReward = getToday();
  saveStats(stats);
  return { stats, gained };
}

export function addXP(amount: number, modality?: string): { stats: UserStats; leveledUp: boolean } {
  const stats = getStats();
  const modalityId = modality || stats.currentModality || 'vascular';
  const modalityStats = getCurrentModalityStats(stats);

  const oldLevel = modalityStats.level;
  modalityStats.xp += amount;
  modalityStats.level = Math.floor(modalityStats.xp / 500) + 1;

  saveStats(stats);
  return { stats, leveledUp: modalityStats.level > oldLevel };
}

export function recordAnswer(
  correct: boolean,
  category: string,
  modality?: string
): { stats: UserStats; xpGained: number; newBadges: string[]; heartEarned: boolean } {
  const stats = getStats();
  const modalityId = modality || stats.currentModality || 'vascular';

  // Ensure modality stats exist
  if (!stats.modalities[modalityId]) {
    stats.modalities[modalityId] = getDefaultModalityStats();
  }

  const modalityStats = stats.modalities[modalityId];

  refreshHearts(stats);
  updateStreak(stats);

  // Update modality-specific stats
  modalityStats.totalAnswered += 1;

  // Category tracking (modality-specific)
  if (!modalityStats.categoryStats[category]) {
    modalityStats.categoryStats[category] = { answered: 0, correct: 0 };
  }
  modalityStats.categoryStats[category].answered += 1;

  let xpGained = 0;
  let heartEarned = false;

  if (correct) {
    modalityStats.totalCorrect += 1;
    modalityStats.categoryStats[category].correct += 1;
    modalityStats.correctStreak += 1;
    // XP: base 10 + streak bonus
    xpGained = modalityStats.correctStreak >= 3 ? 15 : 10;
    modalityStats.xp += xpGained;
    modalityStats.level = Math.floor(modalityStats.xp / 500) + 1;
    if (modalityStats.correctStreak % STREAK_HEART_EVERY === 0) {
      heartEarned = gainHearts(stats, 1) > 0;
    }
  } else {
    modalityStats.correctStreak = 0;
    loseHeart(stats);
  }

  const newBadges = checkBadges(stats, modalityId);
  saveStats(stats);
  return { stats, xpGained, newBadges, heartEarned };
}

export function recordExamComplete(
  exam: string,
  score: number,
  total: number,
  modality?: string
): { stats: UserStats; xpGained: number; newBadges: string[] } {
  const stats = getStats();
  const modalityId = modality || stats.currentModality || 'vascular';

  // Ensure modality stats exist
  if (!stats.modalities[modalityId]) {
    stats.modalities[modalityId] = getDefaultModalityStats();
  }

  const modalityStats = stats.modalities[modalityId];

  modalityStats.examScores.push({
    exam,
    score,
    total,
    date: new Date().toISOString(),
  });
  // Exam completion bonus
  const xpGained = 50;
  modalityStats.xp += xpGained;
  modalityStats.level = Math.floor(modalityStats.xp / 500) + 1;

  const newBadges = checkBadges(stats, modalityId);
  saveStats(stats);
  return { stats, xpGained, newBadges };
}

function checkBadges(stats: UserStats, modalityId: string): string[] {
  const newBadges: string[] = [];
  const earned = new Set(stats.badges);
  const modalityStats = stats.modalities[modalityId];

  function award(id: string) {
    if (!earned.has(id)) {
      stats.badges.push(id);
      newBadges.push(id);
    }
  }

  // Global badges (check across all modalities)
  if (modalityStats.totalAnswered >= 1) award('first_answer');
  if (stats.streak >= 3) award('streak_3');
  if (stats.streak >= 7) award('streak_7');

  // Modality-specific badges
  const prefix = `${modalityId}_`;

  if (modalityStats.totalAnswered >= 95) award(`${prefix}halfway`);
  if (modalityStats.totalAnswered >= 100) award(`${prefix}centurion`);
  if (modalityStats.level >= 5) award(`${prefix}level_5`);
  if (modalityStats.level >= 10) award(`${prefix}level_10`);

  // Category mastery (modality-specific)
  if (modalityId === 'vascular') {
    const cerebro = modalityStats.categoryStats['Cerebrovascular'];
    if (cerebro && cerebro.answered >= 10 && cerebro.correct / cerebro.answered >= 0.8) {
      award(`${prefix}cerebrovascular_master`);
    }
    const physics = modalityStats.categoryStats['Physics & Instrumentation'];
    if (physics && physics.answered >= 10 && physics.correct / physics.answered >= 0.8) {
      award(`${prefix}physics_master`);
    }
  }

  // Exam completion badges (modality-specific)
  for (const es of modalityStats.examScores) {
    if (es.exam === 'mock-1') award(`${prefix}exam1_complete`);
    if (es.exam === 'mock-2') award(`${prefix}exam2_complete`);
    if (es.exam === 'quick-10' && es.score === es.total) award(`${prefix}perfect_10`);
  }

  return newBadges;
}

export function getBadgeInfo(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id);
}
