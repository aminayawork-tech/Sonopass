'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, Target, Award, Calendar, Zap, Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { getStats, BADGES, type UserStats } from '@/lib/userStats';

export default function StatsPage() {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    setStats(getStats());
  }, []);

  const totalQuestions = 200;
  const accuracy = stats && stats.totalAnswered > 0
    ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
    : 0;

  // Category totals (approximate from the dataset)
  const categoryTotals: Record<string, number> = {
    'Cerebrovascular': 53,
    'Arterial Anatomy': 30,
    'Arterial Hemodynamics': 28,
    'Physics & Instrumentation': 18,
    'Arterial Disease': 16,
    'General & Other': 62,
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <header className="px-4 sm:px-6 py-3 sm:py-6 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl sm:text-4xl font-bold">
            <span className="text-gray-800">Sono</span>
            <span className="text-emerald-600">Pass</span>
            <span className="text-gray-600 text-base sm:text-2xl ml-2 sm:ml-3">Stats</span>
          </h1>
          <Link href="/">
            <Button variant="outline" size="sm" className="font-semibold text-xs sm:text-sm px-2.5 sm:px-4">
              <ArrowLeft className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* XP / Level Banner */}
        {stats && (
          <Card className="p-4 sm:p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-800">Level {stats.level}</div>
                  <div className="text-xs sm:text-sm text-gray-600">{stats.xp} Total XP</div>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                <span className="text-xs sm:text-sm text-gray-600">{(stats.level * 500) - stats.xp} XP to next</span>
              </div>
            </div>
            <Progress value={((stats.xp % 500) / 500) * 100} className="h-2.5 sm:h-3 bg-amber-100" />
          </Card>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8 sm:mb-12">
          <Card className="p-3 sm:p-6 bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-600">Done</div>
            </div>
            <div className="text-xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{stats?.totalAnswered ?? 0}</div>
            <Progress value={((stats?.totalAnswered ?? 0) / totalQuestions) * 100} className="h-1.5 sm:h-2 bg-gray-100" />
            <div className="text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-2">
              {stats?.totalAnswered ?? 0} / {totalQuestions}
            </div>
          </Card>

          <Card className="p-3 sm:p-6 bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-600">Accuracy</div>
            </div>
            <div className="text-xl sm:text-3xl font-bold text-emerald-600 mb-1 sm:mb-2">{accuracy}%</div>
            <Progress value={accuracy} className="h-1.5 sm:h-2 bg-emerald-100" />
            <div className="text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-2">
              {stats?.totalCorrect ?? 0} correct
            </div>
          </Card>

          <Card className="p-3 sm:p-6 bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-600">Streak</div>
            </div>
            <div className="text-xl sm:text-3xl font-bold text-orange-500 mb-1 sm:mb-2">{stats?.streak ?? 0}</div>
            <div className="text-[10px] sm:text-xs text-gray-500 mt-3 sm:mt-6">
              {stats?.streak ? `${stats.streak} day${stats.streak > 1 ? 's' : ''}!` : 'Start studying'}
            </div>
          </Card>

          <Card className="p-3 sm:p-6 bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-600">Badges</div>
            </div>
            <div className="text-xl sm:text-3xl font-bold text-indigo-600 mb-1 sm:mb-2">{stats?.badges?.length ?? 0}</div>
            <div className="text-[10px] sm:text-xs text-gray-500 mt-3 sm:mt-6">
              {stats?.badges?.length ? `${BADGES.length - stats.badges.length} left` : 'Earn badges!'}
            </div>
          </Card>
        </div>

        {/* Badges Section */}
        <Card className="p-4 sm:p-8 bg-white shadow-md border border-gray-200 mb-8 sm:mb-12">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Badges</h2>
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
            {BADGES.map((badge) => {
              const earned = stats?.badges?.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`p-2 sm:p-4 rounded-lg border-2 text-center transition-all ${
                    earned
                      ? 'bg-amber-50 border-amber-300'
                      : 'bg-gray-50 border-gray-200 opacity-50'
                  }`}
                >
                  <div className="text-xl sm:text-3xl mb-1 sm:mb-2">{badge.icon}</div>
                  <div className={`font-semibold text-[10px] sm:text-sm leading-tight ${earned ? 'text-gray-800' : 'text-gray-500'}`}>
                    {badge.name}
                  </div>
                  <div className="text-[9px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 hidden xs:block">{badge.description}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Category Progress */}
        <Card className="p-4 sm:p-8 bg-white shadow-md border border-gray-200 mb-8 sm:mb-12">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Progress by Category</h2>

          <div className="space-y-3 sm:space-y-4">
            {Object.entries(categoryTotals).map(([category, total]) => {
              const catStats = stats?.categoryStats?.[category];
              const answered = catStats?.answered ?? 0;
              const correct = catStats?.correct ?? 0;
              const catAccuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;
              const progressPct = total > 0 ? (answered / total) * 100 : 0;

              return (
                <div key={category} className="p-3 sm:p-5 bg-gray-50 rounded-lg border-l-4 border-emerald-500">
                  <div className="flex justify-between items-start mb-2 sm:mb-3">
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-900">{category}</h3>
                    <div className="text-right">
                      <div className="text-base sm:text-xl font-bold text-gray-800">{answered}/{total}</div>
                      <div className="text-[10px] sm:text-xs text-gray-600">
                        {catAccuracy > 0 ? `${catAccuracy}%` : 'Not started'}
                      </div>
                    </div>
                  </div>
                  <Progress value={progressPct} className="h-1.5 sm:h-2 bg-gray-200" />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Exam History */}
        {stats && stats.examScores.length > 0 && (
          <Card className="p-4 sm:p-8 bg-white shadow-md border border-gray-200 mb-8 sm:mb-12">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Exam History</h2>
            <div className="space-y-2 sm:space-y-3">
              {stats.examScores.slice(-10).reverse().map((es, i) => (
                <div key={i} className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-sm sm:text-base text-gray-800 capitalize">{es.exam.replace('-', ' ')}</div>
                    <div className="text-[10px] sm:text-xs text-gray-500">{new Date(es.date).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-base sm:text-lg font-bold text-emerald-600">
                      {es.total > 0 ? Math.round((es.score / es.total) * 100) : 0}%
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500">{es.score}/{es.total}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Study Tips */}
        <Card className="p-4 sm:p-8 bg-white shadow-md border border-gray-200">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Study Tips</h2>
          <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5">1.</span>
              <span>Study consistently - aim for at least 10 questions per day to build your streak</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5">2.</span>
              <span>Focus on weak areas - review categories with lower accuracy first</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5">3.</span>
              <span>Take mock exams under timed conditions to simulate the real registry test</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5">4.</span>
              <span>Read each explanation carefully - understanding the &quot;why&quot; helps with retention</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5">5.</span>
              <span>Earn all badges by mastering each category to 80%+ accuracy</span>
            </li>
          </ul>
        </Card>
      </main>
    </div>
  );
}
