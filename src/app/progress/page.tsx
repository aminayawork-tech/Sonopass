'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getStats, getCurrentModalityStats, getBadgeInfo, type UserStats } from '@/lib/userStats';
import { useModality } from '@/contexts/ModalityContext';
import {
  TrendingUp,
  Target,
  Award,
  Flame,
  Star,
  CheckCircle,
  Brain,
  Clock,
  Trophy,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import RegistryReadinessWidget from '@/components/RegistryReadinessWidget';

export default function ProgressPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const { currentModality } = useModality();

  useEffect(() => {
    setStats(getStats());
  }, []);

  const modalityStats = stats ? getCurrentModalityStats(stats) : null;

  const accuracy = modalityStats && modalityStats.totalAnswered > 0
    ? Math.round((modalityStats.totalCorrect / modalityStats.totalAnswered) * 100)
    : 0;
  const xpToNext = modalityStats ? (modalityStats.level * 500) - modalityStats.xp : 500;
  const xpProgress = modalityStats ? ((modalityStats.xp % 500) / 500) * 100 : 0;
  const completionRate = currentModality && modalityStats
    ? Math.round((modalityStats.totalAnswered / currentModality.questionCount) * 100)
    : 0;

  // Mock category performance data - replace with real data when available
  const categoryPerformance = [
    { name: 'Anatomy & Physiology', correct: 45, total: 60, percentage: 75 },
    { name: 'Hemodynamics', correct: 32, total: 40, percentage: 80 },
    { name: 'Vascular Protocols', correct: 28, total: 45, percentage: 62 },
    { name: 'Disease States', correct: 38, total: 50, percentage: 76 },
    { name: 'Instrumentation', correct: 22, total: 30, percentage: 73 },
  ];

  const weakestCategory = categoryPerformance.reduce((min, cat) =>
    cat.percentage < min.percentage ? cat : min
  );

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 sm:space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-sono-gray-900">Progress</h1>
            <p className="text-sm sm:text-base text-sono-gray-600 mt-1">
              Track your learning journey and identify areas for improvement
            </p>
          </div>
        </div>

        {/* Registry Readiness - Hero Section */}
        <Card className="p-6 sm:p-8 bg-gradient-to-br from-sono-teal-deep/5 to-sono-blue-soft/5 border border-sono-teal-deep/20 shadow-md rounded-2xl">
          <div className="flex flex-col items-center">
            <RegistryReadinessWidget size="large" showLabel={true} />
          </div>
        </Card>

        {/* Overall Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <Card className="p-4 sm:p-5 bg-white border border-sono-gray-300 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-sono-green-ultrasound/10 rounded-xl">
                <CheckCircle className="w-5 h-5 text-sono-green-soft" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-sono-gray-900">
                  {modalityStats?.totalAnswered ?? 0}
                </div>
                <div className="text-xs text-sono-gray-600">Questions Done</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-5 bg-white border border-sono-gray-300 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-sono-blue-soft/10 rounded-xl">
                <Target className="w-5 h-5 text-sono-blue-soft" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-sono-blue-soft">{accuracy}%</div>
                <div className="text-xs text-sono-gray-600">Accuracy</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-5 bg-white border border-sono-gray-300 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-sono-orange/10 rounded-xl">
                <Flame className="w-5 h-5 text-sono-orange" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-sono-orange">
                  {stats?.streak ?? 0}
                </div>
                <div className="text-xs text-sono-gray-600">Day Streak</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-5 bg-white border border-sono-gray-300 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-sono-amber/10 rounded-xl">
                <Star className="w-5 h-5 text-sono-amber" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-sono-amber">
                  Level {modalityStats?.level ?? 1}
                </div>
                <div className="text-xs text-sono-gray-600">{modalityStats?.xp ?? 0} XP</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-5 bg-white border border-sono-gray-300 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-sono-purple/10 rounded-xl">
                <Trophy className="w-5 h-5 text-sono-purple" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-sono-purple">
                  {stats?.badges?.length ?? 0}
                </div>
                <div className="text-xs text-sono-gray-600">Badges</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="p-5 sm:p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-sono-amber/30 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-sono-gray-900">Level Progress</h3>
              <p className="text-xs sm:text-sm text-sono-gray-600">
                {xpToNext} XP to reach Level {(modalityStats?.level ?? 1) + 1}
              </p>
            </div>
            <Star className="w-7 h-7 sm:w-8 sm:h-8 text-sono-amber" />
          </div>
          <Progress value={xpProgress} className="h-3 sm:h-4 bg-amber-100" />
        </Card>

        {/* Completion Progress */}
        <Card className="p-5 sm:p-6 bg-white border border-sono-gray-300 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-sono-gray-900">Question Bank Progress</h3>
              <p className="text-xs sm:text-sm text-sono-gray-600">
                {modalityStats?.totalAnswered ?? 0} of {currentModality?.questionCount ?? 0} questions completed
              </p>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-sono-green-soft">{completionRate}%</div>
          </div>
          <Progress value={completionRate} className="h-3 sm:h-4 bg-gray-100" />
        </Card>

        {/* Performance by Category */}
        <Card className="p-5 sm:p-6 bg-white border border-sono-gray-300 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-bold text-sono-gray-900">Performance by Category</h3>
            <Link href="/practice">
              <Button variant="link" className="text-sono-teal-deep text-sm">
                Study Now →
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {categoryPerformance.map((category) => (
              <div key={category.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-semibold text-sono-gray-900">{category.name}</div>
                    <div className="text-xs sm:text-sm text-sono-gray-600">
                      {category.correct} / {category.total} correct
                    </div>
                  </div>
                  <div className={`text-xl sm:text-2xl font-bold ${
                    category.percentage >= 80 ? 'text-sono-green-soft' :
                    category.percentage >= 70 ? 'text-sono-blue-soft' :
                    category.percentage >= 60 ? 'text-sono-orange' :
                    'text-sono-red'
                  }`}>
                    {category.percentage}%
                  </div>
                </div>
                <Progress
                  value={category.percentage}
                  className={`h-2 ${
                    category.percentage >= 80 ? 'bg-sono-green-ultrasound/20' :
                    category.percentage >= 70 ? 'bg-sono-blue-soft/20' :
                    category.percentage >= 60 ? 'bg-sono-orange/20' :
                    'bg-sono-red/20'
                  }`}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Weak Areas Focus */}
        {weakestCategory.percentage < 75 && (
          <Card className="p-5 sm:p-6 bg-gradient-to-r from-sono-teal-deep/5 to-sono-blue-soft/5 border border-sono-teal-deep/20 rounded-2xl shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-sono-teal-deep/10 rounded-xl flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-sono-teal-deep" />
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-bold text-sono-gray-900 mb-1">Focus Area Detected</h3>
                <p className="text-sm sm:text-base text-sono-gray-700 mb-4">
                  Your weakest category is <strong>{weakestCategory.name}</strong> at {weakestCategory.percentage}%.
                  Focus your practice here to improve your overall score!
                </p>
                <Link href="/practice">
                  <Button className="bg-sono-teal-deep hover:bg-sono-teal-medium text-white rounded-xl h-11">
                    <Target className="w-4 h-4 mr-2" />
                    Practice This Category
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {/* Badges Section */}
        {stats && stats.badges && stats.badges.length > 0 && (
          <Card className="p-5 sm:p-6 bg-white border border-sono-gray-300 rounded-2xl shadow-sm">
            <h3 className="text-base sm:text-lg font-bold text-sono-gray-900 mb-4">Badges Earned</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {stats.badges.map((badgeId, index) => {
                const badgeInfo = getBadgeInfo(badgeId);
                return (
                  <div
                    key={badgeId || index}
                    className="flex flex-col items-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-sono-amber/30"
                  >
                    <div className="text-3xl mb-2">{badgeInfo?.icon || '🏆'}</div>
                    <div className="text-xs sm:text-sm font-semibold text-center text-sono-gray-900">
                      {badgeInfo?.name || badgeId}
                    </div>
                    {badgeInfo?.description && (
                      <div className="text-[10px] sm:text-xs text-sono-gray-600 text-center mt-1">
                        {badgeInfo.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Study Recommendations */}
        <Card className="p-5 sm:p-6 bg-gradient-to-r from-sono-green-ultrasound/5 to-sono-green-soft/5 border border-sono-green-soft/30 rounded-2xl shadow-sm">
          <h3 className="text-base sm:text-lg font-bold text-sono-gray-900 mb-4">📚 Study Recommendations</h3>
          <div className="space-y-3">
            {accuracy < 70 && (
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-sono-green-soft flex-shrink-0 mt-0.5" />
                <p className="text-sm sm:text-base text-sono-gray-700">
                  <strong>Use Study Mode:</strong> Your accuracy is below 70%. Try Study Mode for instant feedback and better understanding.
                </p>
              </div>
            )}
            {completionRate < 50 && (
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-sono-green-soft flex-shrink-0 mt-0.5" />
                <p className="text-sm sm:text-base text-sono-gray-700">
                  <strong>Keep Practicing:</strong> You&apos;ve completed {completionRate}% of the question bank. More practice will improve your confidence!
                </p>
              </div>
            )}
            {accuracy >= 80 && completionRate >= 60 && (
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-sono-green-soft flex-shrink-0 mt-0.5" />
                <p className="text-sm sm:text-base text-sono-gray-700">
                  <strong>Ready for Mock Exams:</strong> Your performance is strong! Time to test yourself with full-length mock exams.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
