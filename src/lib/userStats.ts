const STORAGE_KEY = 'sonopass_stats';

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: string;
  hearts: number;
  lastHeartRefill: string;
  totalAnswered: number;
  totalCorrect: number;
  correctStreak: number;
  categoryStats: Record<string, { answered: number; correct: number }>;
  badges: string[];
  examScores: { exam: string; score: number; total: number; date: string }[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const BADGES: Badge[] = [
  { id: 'first_answer', name: 'First Steps', description: 'Answer your first question', icon: '🎯' },
  { id: 'streak_3', name: 'On a Roll', description: '3-day study streak', icon: '🔥' },
  { id: 'streak_7', name: 'Week Warrior', description: '7-day study streak', icon: '⚡' },
  { id: 'perfect_10', name: 'Perfect 10', description: 'Score 100% on Quick 10', icon: '💎' },
  { id: 'halfway', name: 'Halfway There', description: 'Answer 95 questions', icon: '🏔️' },
  { id: 'centurion', name: 'Centurion', description: 'Answer 100 questions', icon: '💯' },
  { id: 'cerebrovascular_master', name: 'Brain Specialist', description: '80%+ in Cerebrovascular (10+ Qs)', icon: '🧠' },
  { id: 'physics_master', name: 'Physics Pro', description: '80%+ in Physics & Instrumentation (10+ Qs)', icon: '📡' },
  { id: 'exam1_complete', name: 'Exam 1 Done', description: 'Complete Mock Exam 1', icon: '📋' },
  { id: 'exam2_complete', name: 'Exam 2 Done', description: 'Complete Mock Exam 2', icon: '📝' },
  { id: 'level_5', name: 'Rising Star', description: 'Reach Level 5', icon: '⭐' },
  { id: 'level_10', name: 'Expert', description: 'Reach Level 10', icon: '🏆' },
];

function getDefaultStats(): UserStats {
  return {
    xp: 0,
    level: 1,
    streak: 0,
    lastStudyDate: '',
    hearts: 5,
    lastHeartRefill: new Date().toISOString(),
    totalAnswered: 0,
    totalCorrect: 0,
    correctStreak: 0,
    categoryStats: {},
    badges: [],
    examScores: [],
  };
}

export function getStats(): UserStats {
  if (typeof window === 'undefined') return getDefaultStats();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultStats();
    return { ...getDefaultStats(), ...JSON.parse(raw) };
  } catch {
    return getDefaultStats();
  }
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
  if (stats.lastStudyDate === today) return;
  if (stats.lastStudyDate === getYesterday()) {
    stats.streak += 1;
  } else {
    stats.streak = 1;
  }
  stats.lastStudyDate = today;
}

function refreshHearts(stats: UserStats): void {
  const now = Date.now();
  const lastRefill = new Date(stats.lastHeartRefill).getTime();
  const sixHours = 6 * 60 * 60 * 1000;
  if (now - lastRefill >= sixHours && stats.hearts < 5) {
    stats.hearts = 5;
    stats.lastHeartRefill = new Date().toISOString();
  }
}

export function addXP(amount: number): { stats: UserStats; leveledUp: boolean } {
  const stats = getStats();
  const oldLevel = stats.level;
  stats.xp += amount;
  stats.level = Math.floor(stats.xp / 500) + 1;
  saveStats(stats);
  return { stats, leveledUp: stats.level > oldLevel };
}

export function recordAnswer(
  correct: boolean,
  category: string
): { stats: UserStats; xpGained: number; newBadges: string[] } {
  const stats = getStats();
  refreshHearts(stats);
  updateStreak(stats);

  stats.totalAnswered += 1;

  // Category tracking
  if (!stats.categoryStats[category]) {
    stats.categoryStats[category] = { answered: 0, correct: 0 };
  }
  stats.categoryStats[category].answered += 1;

  let xpGained = 0;

  if (correct) {
    stats.totalCorrect += 1;
    stats.categoryStats[category].correct += 1;
    stats.correctStreak += 1;
    // XP: base 10 + streak bonus
    xpGained = stats.correctStreak >= 3 ? 15 : 10;
    stats.xp += xpGained;
    stats.level = Math.floor(stats.xp / 500) + 1;
  } else {
    stats.correctStreak = 0;
    if (stats.hearts > 0) {
      stats.hearts -= 1;
    }
  }

  const newBadges = checkBadges(stats);
  saveStats(stats);
  return { stats, xpGained, newBadges };
}

export function recordExamComplete(
  exam: string,
  score: number,
  total: number
): { stats: UserStats; xpGained: number; newBadges: string[] } {
  const stats = getStats();
  stats.examScores.push({
    exam,
    score,
    total,
    date: new Date().toISOString(),
  });
  // Exam completion bonus
  const xpGained = 50;
  stats.xp += xpGained;
  stats.level = Math.floor(stats.xp / 500) + 1;
  const newBadges = checkBadges(stats);
  saveStats(stats);
  return { stats, xpGained, newBadges };
}

function checkBadges(stats: UserStats): string[] {
  const newBadges: string[] = [];
  const earned = new Set(stats.badges);

  function award(id: string) {
    if (!earned.has(id)) {
      stats.badges.push(id);
      newBadges.push(id);
    }
  }

  if (stats.totalAnswered >= 1) award('first_answer');
  if (stats.streak >= 3) award('streak_3');
  if (stats.streak >= 7) award('streak_7');
  if (stats.totalAnswered >= 95) award('halfway');
  if (stats.totalAnswered >= 100) award('centurion');
  if (stats.level >= 5) award('level_5');
  if (stats.level >= 10) award('level_10');

  // Category mastery
  const cerebro = stats.categoryStats['Cerebrovascular'];
  if (cerebro && cerebro.answered >= 10 && cerebro.correct / cerebro.answered >= 0.8) {
    award('cerebrovascular_master');
  }
  const physics = stats.categoryStats['Physics & Instrumentation'];
  if (physics && physics.answered >= 10 && physics.correct / physics.answered >= 0.8) {
    award('physics_master');
  }

  // Exam completion badges
  for (const es of stats.examScores) {
    if (es.exam === 'mock-1') award('exam1_complete');
    if (es.exam === 'mock-2') award('exam2_complete');
    if (es.exam === 'quick-10' && es.score === es.total) award('perfect_10');
  }

  return newBadges;
}

export function getBadgeInfo(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id);
}
