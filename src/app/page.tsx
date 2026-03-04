'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Brain, Zap, BookOpen, BarChart3, Heart, Flame, Star, GraduationCap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getStats, type UserStats } from '@/lib/userStats';

export default function HomePage() {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    setStats(getStats());
  }, []);

  const accuracy = stats && stats.totalAnswered > 0
    ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
    : 0;
  const xpToNext = stats ? (stats.level * 500) - stats.xp : 500;
  const xpProgress = stats ? ((stats.xp % 500) / 500) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <header className="px-4 sm:px-6 py-3 sm:py-6 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl sm:text-4xl font-bold">
            <span className="text-gray-800">Sono</span>
            <span className="text-emerald-500">Pass</span>
          </h1>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Live stats bar — desktop only */}
            {stats && (
              <div className="hidden md:flex items-center gap-3 text-sm bg-gray-50 px-4 py-2 rounded-full">
                <span className="flex items-center gap-1 font-semibold text-amber-600">
                  <Zap className="w-4 h-4" /> {stats.xp}
                </span>
                <span className="text-gray-300">|</span>
                <span className="flex items-center gap-1 font-semibold text-orange-500">
                  <Flame className="w-4 h-4" /> {stats.streak}
                </span>
                <span className="text-gray-300">|</span>
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Heart
                      key={i}
                      className={`w-4 h-4 ${i < (stats?.hearts ?? 0) ? 'text-red-500 fill-red-500' : 'text-gray-300'}`}
                    />
                  ))}
                </span>
              </div>
            )}
            <Link href="/stats">
              <Button variant="outline" size="sm" className="font-semibold text-xs sm:text-sm px-2.5 sm:px-4">
                <BarChart3 className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">My Stats</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Welcome Message */}
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-2xl sm:text-5xl font-bold mb-2 sm:mb-3 text-gray-800">
            Master Your Vascular Registry Exam
          </h2>
          <p className="text-sm sm:text-xl text-gray-600">
            200 Practice Questions (10 with Images!) &bull; Smart Study Tools &bull; Track Your Progress
          </p>
        </div>

        {/* Level / XP bar */}
        {stats && (
          <div className="mb-6 sm:mb-8 max-w-xl mx-auto">
            <div className="flex justify-between items-center mb-1.5 sm:mb-2 text-xs sm:text-sm">
              <span className="font-bold text-gray-700 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" /> Level {stats.level}
              </span>
              <span className="text-gray-500">{xpToNext} XP to Level {stats.level + 1}</span>
            </div>
            <Progress value={xpProgress} className="h-2.5 sm:h-3 bg-gray-200" />
          </div>
        )}

        {/* Mobile stats row — visible on small screens */}
        {stats && (
          <div className="flex md:hidden items-center justify-center gap-3 text-xs mb-6 bg-white rounded-full px-4 py-2 shadow-sm mx-auto w-fit">
            <span className="flex items-center gap-1 font-semibold text-amber-600">
              <Zap className="w-3.5 h-3.5" /> {stats.xp} XP
            </span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1 font-semibold text-orange-500">
              <Flame className="w-3.5 h-3.5" /> {stats.streak}d
            </span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-3 h-3 ${i < (stats?.hearts ?? 0) ? 'text-red-500 fill-red-500' : 'text-gray-300'}`}
                />
              ))}
            </span>
          </div>
        )}

        {/* Study Guide Banner */}
        <Link href="/study-guide" className="block mb-6">
          <Card className="p-4 sm:p-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transition-all cursor-pointer border-0 shadow-lg">
            <div className="flex items-center gap-4 text-white">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-2xl font-bold mb-1">RVT Study Guide</h3>
                <p className="text-sm sm:text-base text-emerald-50">
                  Theory, anatomy, protocols & key concepts - your complete study companion
                </p>
              </div>
              <div className="hidden sm:block">
                <div className="px-4 py-2 bg-white/20 rounded-lg text-sm font-semibold">
                  Start Learning →
                </div>
              </div>
            </div>
          </Card>
        </Link>

        {/* Exam Modes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-5 mb-8 sm:mb-12">
          {/* Quick 10 */}
          <Link href="/exam/quick-10">
            <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer bg-white border border-gray-200 h-full">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 text-center sm:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-0.5 sm:mb-1">Quick 10</h3>
                  <p className="text-xs sm:text-sm text-gray-600 hidden xs:block">10 random questions</p>
                </div>
              </div>
            </Card>
          </Link>

          {/* Study by Section */}
          <Link href="/exam/study">
            <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer bg-white border border-gray-200 h-full">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 text-center sm:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-0.5 sm:mb-1">Study Mode</h3>
                  <p className="text-xs sm:text-sm text-gray-600 hidden xs:block">Browse by category</p>
                </div>
              </div>
            </Card>
          </Link>

          {/* Mock Exam 1 */}
          <Link href="/exam/mock-1">
            <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer bg-white border border-gray-200 h-full">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 text-center sm:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-0.5 sm:mb-1">Mock Exam 1</h3>
                  <p className="text-xs sm:text-sm text-gray-600 hidden xs:block">128 questions (10 w/ images)</p>
                </div>
              </div>
            </Card>
          </Link>

          {/* Mock Exam 2 */}
          <Link href="/exam/mock-2">
            <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer bg-white border border-gray-200 h-full">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 text-center sm:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-0.5 sm:mb-1">Mock Exam 2</h3>
                  <p className="text-xs sm:text-sm text-gray-600 hidden xs:block">72 questions</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Stats Preview */}
        <Card className="p-4 sm:p-8 bg-white shadow-md border border-gray-200">
          <h3 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">Your Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            <div className="text-center p-3 sm:p-6 bg-gray-50 rounded-lg">
              <div className="text-2xl sm:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">{stats?.totalAnswered ?? 0}</div>
              <div className="text-xs sm:text-sm font-medium text-gray-600">Questions Done</div>
            </div>
            <div className="text-center p-3 sm:p-6 bg-emerald-50 rounded-lg">
              <div className="text-2xl sm:text-4xl font-bold text-emerald-600 mb-1 sm:mb-2">{accuracy}%</div>
              <div className="text-xs sm:text-sm font-medium text-gray-600">Accuracy</div>
            </div>
            <div className="text-center p-3 sm:p-6 bg-orange-50 rounded-lg">
              <div className="text-2xl sm:text-4xl font-bold text-orange-500 mb-1 sm:mb-2">{stats?.streak ?? 0}</div>
              <div className="text-xs sm:text-sm font-medium text-gray-600">Day Streak</div>
            </div>
            <div className="text-center p-3 sm:p-6 bg-amber-50 rounded-lg">
              <div className="text-2xl sm:text-4xl font-bold text-amber-600 mb-1 sm:mb-2">{stats?.badges?.length ?? 0}</div>
              <div className="text-xs sm:text-sm font-medium text-gray-600">Badges</div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
