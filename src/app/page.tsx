'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Brain, Zap, BookOpen, BarChart3, Heart, Flame, Star, GraduationCap, Library } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getStats, getCurrentModalityStats, type UserStats } from '@/lib/userStats';
import { useModality } from '@/contexts/ModalityContext';
import { ModalitySelectorDropdown } from '@/components/ModalitySelector';
import TabNavigation from '@/components/TabNavigation';
import LockMode from '@/components/LockMode';

export default function HomePage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const { currentModality } = useModality();

  useEffect(() => {
    setStats(getStats());
  }, []);

  // Get modality-specific stats
  const modalityStats = stats ? getCurrentModalityStats(stats) : null;

  const accuracy = modalityStats && modalityStats.totalAnswered > 0
    ? Math.round((modalityStats.totalCorrect / modalityStats.totalAnswered) * 100)
    : 0;
  const xpToNext = modalityStats ? (modalityStats.level * 500) - modalityStats.xp : 500;
  const xpProgress = modalityStats ? ((modalityStats.xp % 500) / 500) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <header className="px-4 sm:px-6 py-3 sm:py-6 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black">
              <span className="text-gray-800">Sono</span>
              <span className="text-emerald-500">Pass</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
              {currentModality?.tagline || 'Your ultrasound registry exam prep'}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Live stats bar — desktop only */}
            {stats && modalityStats && (
              <div className="hidden md:flex items-center gap-3 text-sm bg-gray-50 px-4 py-2 rounded-full">
                <span className="flex items-center gap-1 font-semibold text-amber-600">
                  <Zap className="w-4 h-4" /> {modalityStats.xp}
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
            <LockMode />
            <ModalitySelectorDropdown />
            <Link href="/stats">
              <Button variant="outline" size="sm" className="font-semibold text-xs sm:text-sm px-2.5 sm:px-4">
                <BarChart3 className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">My Stats</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <TabNavigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Welcome Message */}
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-2xl sm:text-5xl font-bold mb-2 sm:mb-3 text-gray-800">
            Master Your {currentModality?.name || 'Registry Exam'}
          </h2>
          <p className="text-sm sm:text-xl text-gray-600">
            {currentModality?.questionCount || 0} Practice Questions &bull; Smart Study Tools &bull; Track Your Progress
          </p>
        </div>

        {/* Level / XP bar */}
        {stats && modalityStats && (
          <div className="mb-6 sm:mb-8 max-w-xl mx-auto">
            <div className="flex justify-between items-center mb-1.5 sm:mb-2 text-xs sm:text-sm">
              <span className="font-bold text-gray-700 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" /> Level {modalityStats.level}
              </span>
              <span className="text-gray-500">{xpToNext} XP to Level {modalityStats.level + 1}</span>
            </div>
            <Progress value={xpProgress} className="h-2.5 sm:h-3 bg-gray-200" />
          </div>
        )}

        {/* Mobile stats row — visible on small screens */}
        {stats && modalityStats && (
          <div className="flex md:hidden items-center justify-center gap-3 text-xs mb-6 bg-white rounded-full px-4 py-2 shadow-sm mx-auto w-fit">
            <span className="flex items-center gap-1 font-semibold text-amber-600">
              <Zap className="w-3.5 h-3.5" /> {modalityStats.xp} XP
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
                <h3 className="text-lg sm:text-2xl font-bold mb-1">{currentModality?.shortName || 'RVT'} Study Guide</h3>
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

        {/* Glossary Banner */}
        <Link href="/glossary" className="block mb-6">
          <Card className="p-4 sm:p-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all cursor-pointer border-0 shadow-lg">
            <div className="flex items-center gap-4 text-white">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Library className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-2xl font-bold mb-1">Ultrasound Glossary</h3>
                <p className="text-sm sm:text-base text-blue-50">
                  Essential terms and definitions - search, filter, and master the terminology
                </p>
              </div>
              <div className="hidden sm:block">
                <div className="px-4 py-2 bg-white/20 rounded-lg text-sm font-semibold">
                  Browse Terms →
                </div>
              </div>
            </div>
          </Card>
        </Link>

        {/* Exam Modes - Horizontal Cards */}
        <div className="space-y-4 mb-8 sm:mb-12">
          {currentModality?.examModes
            .filter(mode => !mode.id.startsWith('mock-'))
            .map((mode, index) => {
            // Map exam mode IDs to icons and colors
            const getCardStyle = (modeId: string) => {
              switch (modeId) {
                case 'quick-10':
                  return {
                    Icon: Zap,
                    gradient: 'from-emerald-500 to-teal-500',
                    hoverGradient: 'hover:from-emerald-600 hover:to-teal-600'
                  };
                case 'study':
                  return {
                    Icon: BookOpen,
                    gradient: 'from-blue-500 to-indigo-500',
                    hoverGradient: 'hover:from-blue-600 hover:to-indigo-600'
                  };
                default:
                  return {
                    Icon: Brain,
                    gradient: 'from-gray-500 to-gray-600',
                    hoverGradient: 'hover:from-gray-600 hover:to-gray-700'
                  };
              }
            };

            const { Icon, gradient, hoverGradient } = getCardStyle(mode.id);

            return (
              <Link key={mode.id} href={mode.route} className="block">
                <Card className={`p-4 sm:p-6 bg-gradient-to-r ${gradient} ${hoverGradient} transition-all cursor-pointer border-0 shadow-lg`}>
                  <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-2xl font-bold mb-1">{mode.name}</h3>
                      <p className="text-sm sm:text-base text-white/90">
                        {mode.description}
                      </p>
                    </div>
                    <div className="hidden sm:block">
                      <div className="px-4 py-2 bg-white/20 rounded-lg text-sm font-semibold">
                        Start →
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}

          {/* Single Mock Exams Card */}
          {currentModality?.examModes.some(mode => mode.id.startsWith('mock-')) && (
            <Link href="/exam/mock-exams" className="block">
              <Card className="p-4 sm:p-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all cursor-pointer border-0 shadow-lg">
                <div className="flex items-center gap-4 text-white">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-2xl font-bold mb-1">Mock Exams</h3>
                    <p className="text-sm sm:text-base text-white/90">
                      Full-length practice exams to test your knowledge
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <div className="px-4 py-2 bg-white/20 rounded-lg text-sm font-semibold">
                      Start →
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          )}
        </div>

        {/* Stats Preview */}
        <Card className="p-4 sm:p-8 bg-white shadow-md border border-gray-200">
          <h3 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">Your Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            <div className="text-center p-3 sm:p-6 bg-gray-50 rounded-lg">
              <div className="text-2xl sm:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">{modalityStats?.totalAnswered ?? 0}</div>
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
