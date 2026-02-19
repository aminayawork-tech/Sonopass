'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Brain, Zap, BookOpen, BarChart3, Heart, Flame, Star } from 'lucide-react';
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
      <header className="p-6 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold">
            <span className="text-gray-800">Sono</span>
            <span className="text-emerald-600">Pass</span>
          </h1>
          <div className="flex items-center gap-4">
            {/* Live stats bar */}
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
              <Button variant="outline" size="lg" className="font-semibold">
                <BarChart3 className="mr-2 w-5 h-5" />
                My Stats
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Message */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-3 text-gray-800">
            Master Your Vascular Registry Exam
          </h2>
          <p className="text-xl text-gray-600">
            190 Practice Questions &bull; Smart Study Tools &bull; Track Your Progress
          </p>
        </div>

        {/* Level / XP bar */}
        {stats && (
          <div className="mb-8 max-w-xl mx-auto">
            <div className="flex justify-between items-center mb-2 text-sm">
              <span className="font-bold text-gray-700 flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500" /> Level {stats.level}
              </span>
              <span className="text-gray-500">{xpToNext} XP to Level {stats.level + 1}</span>
            </div>
            <Progress value={xpProgress} className="h-3 bg-gray-200" />
          </div>
        )}

        {/* Exam Modes Grid */}
        <div className="grid md:grid-cols-2 gap-5 mb-12">
          {/* Quick 10 */}
          <Link href="/exam/quick-10">
            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer bg-white border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Quick 10</h3>
                  <p className="text-sm text-gray-600">Fast practice session &bull; 10 random questions</p>
                </div>
              </div>
            </Card>
          </Link>

          {/* Study by Section */}
          <Link href="/exam/study">
            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer bg-white border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Study Mode</h3>
                  <p className="text-sm text-gray-600">Browse &amp; study by category</p>
                </div>
              </div>
            </Card>
          </Link>

          {/* Mock Exam 1 */}
          <Link href="/exam/mock-1">
            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer bg-white border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Mock Exam 1</h3>
                  <p className="text-sm text-gray-600">Full exam simulation &bull; 118 questions</p>
                </div>
              </div>
            </Card>
          </Link>

          {/* Mock Exam 2 */}
          <Link href="/exam/mock-2">
            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer bg-white border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Mock Exam 2</h3>
                  <p className="text-sm text-gray-600">Full exam simulation &bull; 72 questions</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Stats Preview */}
        <Card className="p-8 bg-white shadow-md border border-gray-200">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Your Progress</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl font-bold text-gray-800 mb-2">{stats?.totalAnswered ?? 0}</div>
              <div className="text-sm font-medium text-gray-600">Questions Done</div>
            </div>
            <div className="text-center p-6 bg-emerald-50 rounded-lg">
              <div className="text-4xl font-bold text-emerald-600 mb-2">{accuracy}%</div>
              <div className="text-sm font-medium text-gray-600">Accuracy</div>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <div className="text-4xl font-bold text-orange-500 mb-2">{stats?.streak ?? 0}</div>
              <div className="text-sm font-medium text-gray-600">Day Streak</div>
            </div>
            <div className="text-center p-6 bg-amber-50 rounded-lg">
              <div className="text-4xl font-bold text-amber-600 mb-2">{stats?.badges?.length ?? 0}</div>
              <div className="text-sm font-medium text-gray-600">Badges</div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
