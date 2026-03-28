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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{greeting}!</h1>
            <p className="text-gray-600 mt-1">
              Ready to continue your {currentModality?.shortName || 'exam'} prep?
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <Flame className="w-5 h-5 text-orange-500" />
              <div>
                <div className="text-2xl font-bold text-orange-500">{stats?.streak ?? 0}</div>
                <div className="text-xs text-gray-600">day streak</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <Star className="w-5 h-5 text-amber-500" />
              <div>
                <div className="text-2xl font-bold text-amber-600">
                  Level {modalityStats?.level ?? 1}
                </div>
                <div className="text-xs text-gray-600">{modalityStats?.xp ?? 0} XP</div>
              </div>
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        {stats && modalityStats && (
          <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <div className="flex justify-between items-center mb-2 text-sm">
              <span className="font-semibold text-gray-700">Level Progress</span>
              <span className="text-gray-600">{xpToNext} XP to Level {modalityStats.level + 1}</span>
            </div>
            <Progress value={xpProgress} className="h-3 bg-amber-100" />
          </Card>
        )}

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-white hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {modalityStats?.totalAnswered ?? 0}
                </div>
                <div className="text-sm text-gray-600">Questions Done</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Target className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">{accuracy}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
                {accuracy < 70 && (
                  <Link href="/practice">
                    <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                      Study Now →
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {currentModality?.questionCount ?? 0}
                </div>
                <div className="text-sm text-gray-600">Total Questions</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 rounded-lg">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats?.badges?.length ?? 0}
                </div>
                <div className="text-sm text-gray-600">Badges Earned</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Study Together Spotlight */}
        <Card className="p-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 rounded-xl">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1">Study Together</h3>
                <p className="text-emerald-50">
                  Join live study rooms, compete with friends, and learn together
                </p>
              </div>
            </div>
            <Link href="/study-together">
              <Button className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold">
                Get Started
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Quick Actions Grid */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Jump back in</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Quick 10 */}
            <Link href="/exam/quick-10">
              <Card className="p-6 bg-gradient-to-br from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white cursor-pointer transition-all hover:shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-8 h-8" />
                  <h3 className="text-xl font-bold">Quick 10</h3>
                </div>
                <p className="text-emerald-50 text-sm">10 random questions</p>
                <div className="flex items-center gap-2 mt-4 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>~5 minutes</span>
                </div>
              </Card>
            </Link>

            {/* Study Mode */}
            <Link href="/exam/study">
              <Card className="p-6 bg-gradient-to-br from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white cursor-pointer transition-all hover:shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="w-8 h-8" />
                  <h3 className="text-xl font-bold">Study Mode</h3>
                </div>
                <p className="text-blue-50 text-sm">Practice by category with feedback</p>
                <div className="flex items-center gap-2 mt-4 text-sm">
                  <Target className="w-4 h-4" />
                  <span>Category-focused</span>
                </div>
              </Card>
            </Link>

            {/* Mock Exams */}
            <Link href="/exam/mock-exams">
              <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white cursor-pointer transition-all hover:shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="w-8 h-8" />
                  <h3 className="text-xl font-bold">Mock Exams</h3>
                </div>
                <p className="text-purple-50 text-sm">Full-length practice tests</p>
                <div className="flex items-center gap-2 mt-4 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Timed simulation</span>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Learning Resources */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Learning Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/study-guide">
              <Card className="p-5 bg-white hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <BookOpen className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Study Guide</h3>
                      <p className="text-sm text-gray-600">
                        Theory, anatomy & key concepts
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Card>
            </Link>

            <Link href="/glossary">
              <Card className="p-5 bg-white hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Glossary</h3>
                      <p className="text-sm text-gray-600">
                        Essential terms & definitions
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* View Full Progress */}
        <Link href="/progress">
          <Card className="p-5 bg-white hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-gray-900">View Detailed Progress</h3>
                  <p className="text-sm text-gray-600">
                    Charts, analytics, and insights into your learning
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </Card>
        </Link>
      </div>
    </AppLayout>
  );
}
