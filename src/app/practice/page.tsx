'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useModality } from '@/contexts/ModalityContext';
import { getStats, getCurrentModalityStats } from '@/lib/userStats';
import { Zap, BookOpen, Target, TrendingUp, Clock, ChevronRight, Shuffle } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

export default function PracticePage() {
  const { currentModality } = useModality();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    setStats(getStats());
  }, []);

  const modalityStats = stats ? getCurrentModalityStats(stats) : null;
  const accuracy = modalityStats && modalityStats.totalAnswered > 0
    ? Math.round((modalityStats.totalCorrect / modalityStats.totalAnswered) * 100)
    : 0;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Practice</h1>
          <p className="text-gray-600 mt-1">
            Sharpen your skills with targeted practice questions
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-white">
            <div className="text-sm text-gray-600 mb-1">Questions Done</div>
            <div className="text-2xl font-bold text-gray-900">
              {modalityStats?.totalAnswered ?? 0}
            </div>
          </Card>
          <Card className="p-4 bg-white">
            <div className="text-sm text-gray-600 mb-1">Accuracy</div>
            <div className="text-2xl font-bold text-emerald-600">{accuracy}%</div>
          </Card>
          <Card className="p-4 bg-white">
            <div className="text-sm text-gray-600 mb-1">Total Available</div>
            <div className="text-2xl font-bold text-gray-900">
              {currentModality?.questionCount ?? 0}
            </div>
          </Card>
          <Card className="p-4 bg-white">
            <div className="text-sm text-gray-600 mb-1">Remaining</div>
            <div className="text-2xl font-bold text-blue-600">
              {(currentModality?.questionCount ?? 0) - (modalityStats?.totalAnswered ?? 0)}
            </div>
          </Card>
        </div>

        {/* Practice Modes */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Practice Modes</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick 10 */}
            <Link href="/exam/quick-10">
              <Card className="p-6 bg-gradient-to-br from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white cursor-pointer transition-all hover:shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Zap className="w-8 h-8" />
                  </div>
                  <ChevronRight className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Quick 10</h3>
                <p className="text-emerald-50 mb-4">
                  10 random questions for a quick practice session. Perfect for daily review!
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>~5 minutes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shuffle className="w-4 h-4" />
                    <span>Random</span>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Study Mode */}
            <Link href="/exam/study">
              <Card className="p-6 bg-gradient-to-br from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white cursor-pointer transition-all hover:shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <ChevronRight className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Study Mode</h3>
                <p className="text-blue-50 mb-4">
                  Practice by category with instant feedback. Learn as you go!
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    <span>Category-based</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>Instant feedback</span>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Coming Soon */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">More Practice Options (Coming Soon)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-5 bg-white border-2 border-dashed border-gray-300 opacity-75">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Target className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="font-bold text-gray-700">Weak Areas Focus</h3>
              </div>
              <p className="text-sm text-gray-600">
                AI-powered practice targeting your weakest topics
              </p>
            </Card>

            <Card className="p-5 bg-white border-2 border-dashed border-gray-300 opacity-75">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="font-bold text-gray-700">Spaced Repetition</h3>
              </div>
              <p className="text-sm text-gray-600">
                Smart review of questions based on your performance
              </p>
            </Card>

            <Card className="p-5 bg-white border-2 border-dashed border-gray-300 opacity-75">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Shuffle className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="font-bold text-gray-700">Custom Quizzes</h3>
              </div>
              <p className="text-sm text-gray-600">
                Create custom practice sets with your chosen topics
              </p>
            </Card>
          </div>
        </div>

        {/* Performance Tip */}
        {accuracy < 70 && (
          <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <h3 className="font-bold text-gray-900 mb-2">📈 Boost Your Score</h3>
            <p className="text-gray-700 mb-3">
              Your current accuracy is {accuracy}%. Try using Study Mode to get instant feedback
              and improve your understanding before taking more practice questions.
            </p>
            <Link href="/exam/study">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Start Study Mode
              </Button>
            </Link>
          </Card>
        )}

        {/* Ready for Test */}
        {accuracy >= 80 && (
          <Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
            <h3 className="font-bold text-gray-900 mb-2">🎯 Great Job!</h3>
            <p className="text-gray-700 mb-3">
              You're performing well with {accuracy}% accuracy. Ready to test yourself with a full mock exam?
            </p>
            <Link href="/test">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                Take a Mock Exam
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
