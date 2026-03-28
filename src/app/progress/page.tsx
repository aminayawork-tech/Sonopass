'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getStats, getCurrentModalityStats, type UserStats } from '@/lib/userStats';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Progress</h1>
            <p className="text-gray-600 mt-1">
              Track your learning journey and identify areas for improvement
            </p>
          </div>
        </div>

        {/* Overall Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="p-5 bg-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {modalityStats?.totalAnswered ?? 0}
                </div>
                <div className="text-xs text-gray-600">Questions Done</div>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{accuracy}%</div>
                <div className="text-xs text-gray-600">Accuracy</div>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-500">
                  {stats?.streak ?? 0}
                </div>
                <div className="text-xs text-gray-600">Day Streak</div>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Star className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">
                  Level {modalityStats?.level ?? 1}
                </div>
                <div className="text-xs text-gray-600">{modalityStats?.xp ?? 0} XP</div>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Trophy className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {stats?.badges?.length ?? 0}
                </div>
                <div className="text-xs text-gray-600">Badges</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Level Progress</h3>
              <p className="text-sm text-gray-600">
                {xpToNext} XP to reach Level {(modalityStats?.level ?? 1) + 1}
              </p>
            </div>
            <Star className="w-8 h-8 text-amber-500" />
          </div>
          <Progress value={xpProgress} className="h-4 bg-amber-100" />
        </Card>

        {/* Completion Progress */}
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Question Bank Progress</h3>
              <p className="text-sm text-gray-600">
                {modalityStats?.totalAnswered ?? 0} of {currentModality?.questionCount ?? 0} questions completed
              </p>
            </div>
            <div className="text-3xl font-bold text-emerald-600">{completionRate}%</div>
          </div>
          <Progress value={completionRate} className="h-4 bg-gray-100" />
        </Card>

        {/* Performance by Category */}
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Performance by Category</h3>
          <div className="space-y-4">
            {categoryPerformance.map((category) => (
              <div key={category.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{category.name}</div>
                    <div className="text-sm text-gray-600">
                      {category.correct} / {category.total} correct
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${
                    category.percentage >= 80 ? 'text-emerald-600' :
                    category.percentage >= 70 ? 'text-blue-600' :
                    category.percentage >= 60 ? 'text-orange-500' :
                    'text-red-500'
                  }`}>
                    {category.percentage}%
                  </div>
                </div>
                <Progress
                  value={category.percentage}
                  className={`h-2 ${
                    category.percentage >= 80 ? 'bg-emerald-100' :
                    category.percentage >= 70 ? 'bg-blue-100' :
                    category.percentage >= 60 ? 'bg-orange-100' :
                    'bg-red-100'
                  }`}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Weak Areas Focus */}
        {weakestCategory.percentage < 75 && (
          <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-orange-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Focus Area Detected</h3>
                <p className="text-gray-700 mb-4">
                  Your weakest category is <strong>{weakestCategory.name}</strong> at {weakestCategory.percentage}%.
                  Focus your practice here to improve your overall score!
                </p>
                <Link href="/practice">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
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
          <Card className="p-6 bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Badges Earned</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {stats.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200"
                >
                  <Award className="w-10 h-10 text-amber-500 mb-2" />
                  <div className="text-sm font-semibold text-center text-gray-900">
                    {badge.name}
                  </div>
                  <div className="text-xs text-gray-600 text-center mt-1">
                    {new Date(badge.earnedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Study Recommendations */}
        <Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📚 Study Recommendations</h3>
          <div className="space-y-3">
            {accuracy < 70 && (
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">
                  <strong>Use Study Mode:</strong> Your accuracy is below 70%. Try Study Mode for instant feedback and better understanding.
                </p>
              </div>
            )}
            {completionRate < 50 && (
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">
                  <strong>Keep Practicing:</strong> You've completed {completionRate}% of the question bank. More practice will improve your confidence!
                </p>
              </div>
            )}
            {accuracy >= 80 && completionRate >= 60 && (
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">
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
