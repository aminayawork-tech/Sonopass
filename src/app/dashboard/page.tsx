'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getStats, getCurrentModalityStats, type UserStats } from '@/lib/userStats';
import { useModality } from '@/contexts/ModalityContext';
import {
  Zap,
  BookOpen,
  Brain,
  TrendingUp,
  Target,
  Award,
  Users,
  Flame,
  Star,
  ChevronRight,
  Clock,
  CheckCircle,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import RegistryReadinessWidget from '@/components/RegistryReadinessWidget';

export default function DashboardPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const { currentModality } = useModality();
  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    setStats(getStats());

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const modalityStats = stats ? getCurrentModalityStats(stats) : null;

  const accuracy = modalityStats && modalityStats.totalAnswered > 0
    ? Math.round((modalityStats.totalCorrect / modalityStats.totalAnswered) * 100)
    : 0;
  const xpToNext = modalityStats ? (modalityStats.level * 500) - modalityStats.xp : 500;
  const xpProgress = modalityStats ? ((modalityStats.xp % 500) / 500) * 100 : 0;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 sm:space-y-6">
        {/* Welcome Section with Registry Readiness */}
        <div className="flex flex-col gap-4 fade-in">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-sono-gray-900">
              {greeting}, Student! 🎯
            </h1>
            <p className="text-sm sm:text-base text-sono-gray-600 mt-1">
              Ready to continue your {currentModality?.shortName || 'exam'} prep?
            </p>
          </div>

          {/* Registry Readiness - Hero Section */}
          <Card className="p-6 sm:p-8 bg-gradient-to-br from-sono-teal-deep/5 to-sono-blue-soft/5 border-sono-teal-deep/20 shadow-md rounded-2xl">
            <div className="flex flex-col items-center">
              <RegistryReadinessWidget size="large" showLabel={true} />
            </div>
          </Card>

          {/* Streak + Level Cards */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-white px-5 py-4 rounded-2xl shadow-md flex-1 touch-target transition-all duration-200 hover:shadow-lg active:scale-[0.98] border border-sono-gray-300">
              <Flame className="w-6 h-6 text-sono-orange flex-shrink-0" />
              <div>
                <div className="text-xl sm:text-2xl font-bold text-sono-orange">{stats?.streak ?? 0}</div>
                <div className="text-[10px] sm:text-xs text-sono-gray-600 whitespace-nowrap">day streak</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white px-5 py-4 rounded-2xl shadow-md flex-1 touch-target transition-all duration-200 hover:shadow-lg active:scale-[0.98] border border-sono-gray-300">
              <Star className="w-6 h-6 text-sono-amber flex-shrink-0" />
              <div>
                <div className="text-xl sm:text-2xl font-bold text-sono-amber">
                  Level {modalityStats?.level ?? 1}
                </div>
                <div className="text-[10px] sm:text-xs text-sono-gray-600 whitespace-nowrap">{modalityStats?.xp ?? 0} XP</div>
              </div>
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        {stats && modalityStats && (
          <Card className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-sono-amber/30 shadow-md rounded-2xl slide-up">
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="font-semibold text-sono-gray-900">Level Progress</span>
              <span className="text-sono-gray-600">{xpToNext} XP to Level {modalityStats.level + 1}</span>
            </div>
            <Progress value={xpProgress} className="h-3 bg-amber-100" />
          </Card>
        )}

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-4 sm:p-5 bg-white border border-sono-gray-300 shadow-md hover:shadow-lg transition-all rounded-2xl active:scale-[0.98]">
            <div className="flex flex-col gap-3">
              <div className="p-3 bg-sono-blue-soft/10 rounded-xl w-fit">
                <CheckCircle className="w-6 h-6 text-sono-blue-soft" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-sono-gray-900">
                  {modalityStats?.totalAnswered ?? 0}
                </div>
                <div className="text-xs sm:text-sm text-sono-gray-600">Questions Done</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-5 bg-white border border-sono-gray-300 shadow-md hover:shadow-lg transition-all rounded-2xl active:scale-[0.98]">
            <div className="flex flex-col gap-3">
              <div className="p-3 bg-sono-green-ultrasound/10 rounded-xl w-fit">
                <Target className="w-6 h-6 text-sono-green-soft" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-sono-green-soft">{accuracy}%</div>
                <div className="text-xs sm:text-sm text-sono-gray-600">Accuracy</div>
                {accuracy < 70 && (
                  <Link href="/practice">
                    <Button variant="link" size="sm" className="p-0 h-auto text-xs mt-1 text-sono-teal-deep">
                      Study Now →
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-5 bg-white border border-sono-gray-300 shadow-md hover:shadow-lg transition-all rounded-2xl active:scale-[0.98]">
            <div className="flex flex-col gap-3">
              <div className="p-3 bg-sono-purple/10 rounded-xl w-fit">
                <Brain className="w-6 h-6 text-sono-purple" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-sono-gray-900">
                  {currentModality?.questionCount ?? 0}
                </div>
                <div className="text-xs sm:text-sm text-sono-gray-600">Total Questions</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-5 bg-white border border-sono-gray-300 shadow-md hover:shadow-lg transition-all rounded-2xl active:scale-[0.98]">
            <div className="flex flex-col gap-3">
              <div className="p-3 bg-sono-amber/10 rounded-xl w-fit">
                <Award className="w-6 h-6 text-sono-amber" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-sono-gray-900">
                  {stats?.badges?.length ?? 0}
                </div>
                <div className="text-xs sm:text-sm text-sono-gray-600">Badges Earned</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Personalized Recommendation Card */}
        {accuracy > 0 && accuracy < 70 && (
          <Card className="p-6 sm:p-7 bg-gradient-to-r from-sono-teal-deep to-sono-teal-medium text-white shadow-lg hover:shadow-xl transition-all rounded-2xl active:scale-[0.99]">
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="p-4 bg-white/20 rounded-2xl flex-shrink-0">
                  <Target className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">Focus Area Detected</h3>
                  <p className="text-sm sm:text-base opacity-90">
                    Your accuracy is {accuracy}%. Study more to boost your Registry Readiness to {Math.min(100, Math.round(accuracy + 10))}%
                  </p>
                </div>
              </div>
              <Link href="/practice" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-white text-sono-teal-deep hover:bg-gray-50 font-semibold touch-target active:scale-[0.98] rounded-xl h-12 px-6">
                  Study Now
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Study Together Spotlight */}
        <Card className="p-6 sm:p-7 bg-gradient-to-r from-sono-blue-soft to-sono-blue-light text-white shadow-lg hover:shadow-xl transition-all rounded-2xl active:scale-[0.99]">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="p-4 bg-white/20 rounded-2xl flex-shrink-0">
                <Users className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Study Together</h3>
                <p className="text-sm sm:text-base opacity-90">
                  Join live study rooms, compete with friends, and learn together
                </p>
              </div>
            </div>
            <Link href="/study-together" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-white text-sono-blue-soft hover:bg-gray-50 font-semibold touch-target active:scale-[0.98] rounded-xl h-12 px-6">
                Get Started
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Quick Actions Grid */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-sono-gray-900 mb-3 sm:mb-4">Jump back in</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Quick 10 */}
            <Link href="/exam/quick-10">
              <Card className="p-6 sm:p-7 bg-gradient-to-br from-sono-green-soft to-sono-green-ultrasound hover:from-sono-green-soft/90 hover:to-sono-green-ultrasound/90 text-white cursor-pointer transition-all shadow-lg hover:shadow-xl active:scale-[0.98] touch-target rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Zap className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold">Quick 10</h3>
                </div>
                <p className="opacity-90 text-sm mb-3">10 random questions</p>
                <div className="flex items-center gap-2 text-xs sm:text-sm opacity-80">
                  <Clock className="w-4 h-4" />
                  <span>~5 minutes</span>
                </div>
              </Card>
            </Link>

            {/* Study Mode */}
            <Link href="/practice">
              <Card className="p-6 sm:p-7 bg-gradient-to-br from-sono-blue-soft to-sono-blue-light hover:from-sono-blue-soft/90 hover:to-sono-blue-light/90 text-white cursor-pointer transition-all shadow-lg hover:shadow-xl active:scale-[0.98] touch-target rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold">Study Mode</h3>
                </div>
                <p className="opacity-90 text-sm mb-3">Practice by category with feedback</p>
                <div className="flex items-center gap-2 text-xs sm:text-sm opacity-80">
                  <Target className="w-4 h-4" />
                  <span>Category-focused</span>
                </div>
              </Card>
            </Link>

            {/* Mock Exams */}
            <Link href="/exam/mock-exams">
              <Card className="p-6 sm:p-7 bg-gradient-to-br from-sono-purple to-sono-purple/80 hover:from-sono-purple/90 hover:to-sono-purple/70 text-white cursor-pointer transition-all shadow-lg hover:shadow-xl active:scale-[0.98] touch-target rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Brain className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold">Mock Exams</h3>
                </div>
                <p className="opacity-90 text-sm mb-3">Full-length practice tests</p>
                <div className="flex items-center gap-2 text-xs sm:text-sm opacity-80">
                  <Clock className="w-4 h-4" />
                  <span>Timed simulation</span>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Learning Resources */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-sono-gray-900 mb-3 sm:mb-4">Learning Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Link href="/study-guide">
              <Card className="p-5 sm:p-6 bg-white border border-sono-gray-300 shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer touch-target rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="p-3 bg-sono-teal-deep/10 rounded-xl flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-sono-teal-deep" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sono-gray-900 text-base sm:text-lg mb-1">Study Guide</h3>
                      <p className="text-xs sm:text-sm text-sono-gray-600">
                        Theory, anatomy & key concepts
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-sono-gray-400 flex-shrink-0" />
                </div>
              </Card>
            </Link>

            <Link href="/glossary">
              <Card className="p-5 sm:p-6 bg-white border border-sono-gray-300 shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer touch-target rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="p-3 bg-sono-blue-soft/10 rounded-xl flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-sono-blue-soft" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sono-gray-900 text-base sm:text-lg mb-1">Glossary</h3>
                      <p className="text-xs sm:text-sm text-sono-gray-600">
                        Essential terms & definitions
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-sono-gray-400 flex-shrink-0" />
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* View Full Progress */}
        <Link href="/progress">
          <Card className="p-5 sm:p-6 bg-white border border-sono-gray-300 shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer touch-target rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="p-3 bg-sono-green-ultrasound/10 rounded-xl flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-sono-green-soft" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sono-gray-900 text-base sm:text-lg mb-1">View Detailed Progress</h3>
                  <p className="text-xs sm:text-sm text-sono-gray-600">
                    Charts, analytics, and insights into your learning
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-sono-gray-400 flex-shrink-0" />
            </div>
          </Card>
        </Link>
      </div>
    </AppLayout>
  );
}
