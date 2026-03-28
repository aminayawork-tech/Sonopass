'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useModality } from '@/contexts/ModalityContext';
import { getStats, getCurrentModalityStats } from '@/lib/userStats';
import { Brain, Clock, CheckCircle, Target, TrendingUp, ChevronRight, AlertCircle } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

export default function TestPage() {
  const { currentModality } = useModality();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    setStats(getStats());
  }, []);

  const modalityStats = stats ? getCurrentModalityStats(stats) : null;
  const accuracy = modalityStats && modalityStats.totalAnswered > 0
    ? Math.round((modalityStats.totalCorrect / modalityStats.totalAnswered) * 100)
    : 0;

  const mockExams = currentModality?.examModes.filter(mode => mode.id.startsWith('mock-')) || [];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mock Exams</h1>
          <p className="text-gray-600 mt-1">
            Full-length practice exams to simulate the real test experience
          </p>
        </div>

        {/* Readiness Check */}
        <Card className={`p-6 ${accuracy >= 70 ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200' : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200'}`}>
          <div className="flex items-start gap-4">
            {accuracy >= 70 ? (
              <CheckCircle className="w-8 h-8 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-8 h-8 text-orange-600 flex-shrink-0" />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {accuracy >= 70 ? '✅ Ready for Mock Exams!' : '⚠️ Not Quite Ready'}
              </h3>
              <p className="text-gray-700 mb-3">
                {accuracy >= 70
                  ? `Your current accuracy is ${accuracy}%. You're performing well and ready for full practice exams!`
                  : `Your current accuracy is ${accuracy}%. We recommend practicing more before taking mock exams. Try Study Mode first!`
                }
              </p>
              {accuracy < 70 && (
                <Link href="/practice">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Go to Practice
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </Card>

        {/* Mock Exams List */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Available Mock Exams</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockExams.map((exam, index) => (
              <Link key={exam.id} href={exam.route}>
                <Card className="p-6 bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white cursor-pointer transition-all hover:shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white/20 rounded-xl">
                        <Brain className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{exam.name}</h3>
                        <p className="text-purple-100 text-sm">{exam.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-4 text-sm mt-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Timed exam</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      <span>Full simulation</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Mock Exam Tips */}
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📝 Mock Exam Tips</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Set aside dedicated time</p>
                <p className="text-sm text-gray-600">
                  Mock exams simulate the real test, so find a quiet place and minimize distractions
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Review your results</p>
                <p className="text-sm text-gray-600">
                  After completing, carefully review incorrect answers to learn from mistakes
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Track your progress</p>
                <p className="text-sm text-gray-600">
                  Take multiple mock exams and watch your scores improve over time
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Build stamina</p>
                <p className="text-sm text-gray-600">
                  Full-length exams help you build the endurance needed for test day
                </p>
              </div>
            </li>
          </ul>
        </Card>

        {/* View Progress */}
        <Link href="/progress">
          <Card className="p-5 bg-white hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-gray-900">View Your Exam Performance</h3>
                  <p className="text-sm text-gray-600">
                    See detailed analytics and track your mock exam scores
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
