/**
 * Migration utility for converting old single-modality stats to new multi-modality format
 * Ensures zero data loss when upgrading existing users
 */

// Old format (single modality, vascular-only)
interface OldUserStats {
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: string;
  hearts: number;
  lastHeartRefill: string;
  totalAnswered: number;
  totalCorrect: number;
  correctStreak?: number;
  categoryStats: Record<string, { answered: number; correct: number }>;
  badges: string[];
  examScores: Array<{ exam: string; score: number; total: number; date: string }>;
}

// New format (multi-modality)
export interface NewUserStats {
  // Global (shared across modalities)
  currentModality: string;
  streak: number;
  lastStudyDate: string;
  hearts: number;
  lastHeartRefill: string;
  badges: string[];

  // Per-modality stats
  modalities: Record<string, {
    xp: number;
    level: number;
    totalAnswered: number;
    totalCorrect: number;
    correctStreak: number;
    categoryStats: Record<string, { answered: number; correct: number }>;
    examScores: Array<{ exam: string; score: number; total: number; date: string }>;
    lastStudyDate: string;
  }>;
}

const STORAGE_KEY = 'sonopass_stats';
const MIGRATION_KEY = 'sonopass_migration_v1';

/**
 * Checks if migration is needed
 */
export function needsMigration(): boolean {
  if (typeof window === 'undefined') return false;

  const migrationDone = localStorage.getItem(MIGRATION_KEY);
  if (migrationDone === 'true') return false;

  const stats = localStorage.getItem(STORAGE_KEY);
  if (!stats) return false;

  try {
    const parsed = JSON.parse(stats);
    // If it has 'modalities' field, it's already new format
    if (parsed.modalities) return false;
    // If it has old fields like xp, level at root level, needs migration
    if (typeof parsed.xp === 'number') return true;
  } catch {
    return false;
  }

  return false;
}

/**
 * Migrate old stats format to new multi-modality format
 */
export function migrateStats(oldStats: OldUserStats): NewUserStats {
  console.log('[Migration] Converting old stats to new multi-modality format...');

  // Create new stats structure with vascular data migrated
  const newStats: NewUserStats = {
    currentModality: 'vascular', // Default to vascular for existing users
    streak: oldStats.streak || 0,
    lastStudyDate: oldStats.lastStudyDate || '',
    hearts: oldStats.hearts !== undefined ? oldStats.hearts : 5,
    lastHeartRefill: oldStats.lastHeartRefill || new Date().toISOString(),
    badges: oldStats.badges || [],
    modalities: {
      vascular: {
        xp: oldStats.xp || 0,
        level: oldStats.level || 1,
        totalAnswered: oldStats.totalAnswered || 0,
        totalCorrect: oldStats.totalCorrect || 0,
        correctStreak: oldStats.correctStreak || 0,
        categoryStats: oldStats.categoryStats || {},
        examScores: oldStats.examScores || [],
        lastStudyDate: oldStats.lastStudyDate || '',
      },
    },
  };

  console.log('[Migration] Migration successful!', {
    oldXp: oldStats.xp,
    newVascularXp: newStats.modalities.vascular.xp,
    totalAnswered: oldStats.totalAnswered,
  });

  return newStats;
}

/**
 * Perform migration if needed and save to localStorage
 */
export function performMigrationIfNeeded(): NewUserStats | null {
  if (typeof window === 'undefined') return null;

  if (!needsMigration()) {
    return null;
  }

  try {
    const stats = localStorage.getItem(STORAGE_KEY);
    if (!stats) return null;

    const oldStats: OldUserStats = JSON.parse(stats);

    // Backup old stats
    const backupKey = `${STORAGE_KEY}_backup_${Date.now()}`;
    localStorage.setItem(backupKey, stats);
    console.log(`[Migration] Backed up old stats to ${backupKey}`);

    // Migrate
    const newStats = migrateStats(oldStats);

    // Save new format
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
    localStorage.setItem(MIGRATION_KEY, 'true');

    console.log('[Migration] Migration complete! New stats saved.');
    return newStats;
  } catch (error) {
    console.error('[Migration] Failed to migrate stats:', error);
    return null;
  }
}

/**
 * Get default stats structure for a new modality
 */
export function getDefaultModalityStats() {
  return {
    xp: 0,
    level: 1,
    totalAnswered: 0,
    totalCorrect: 0,
    correctStreak: 0,
    categoryStats: {},
    examScores: [],
    lastStudyDate: '',
  };
}

/**
 * Get default stats for a brand new user
 */
export function getDefaultStats(): NewUserStats {
  return {
    currentModality: 'vascular',
    streak: 0,
    lastStudyDate: '',
    hearts: 5,
    lastHeartRefill: new Date().toISOString(),
    badges: [],
    modalities: {
      vascular: getDefaultModalityStats(),
    },
  };
}
