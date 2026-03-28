'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { useModality } from '@/contexts/ModalityContext';
import { getStats, getCurrentModalityStats, type UserStats } from '@/lib/userStats';
import TabNavigation from '@/components/TabNavigation';

export default function MockExamsPage() {
  const { currentModality } = useModality();
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    setStats(getStats());
  }, []);

  const modalityStats = stats ? getCurrentModalityStats(stats) : null;

  // Get mock exams from current modality
  const mockExams = currentModality?.examModes.filter(mode =>
    mode.id.startsWith('mock-')
  ) || [];

  // Mock exam completion data (you can enhance this with real data)
  const getExamStats = (examId: string) => {
    const examStats = modalityStats?.exams?.[examId];
    return {
      completed: examStats?.completed || false,
      bestScore: examStats?.bestScore || 0,
      attempts: examStats?.attempts || 0,
    };
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <TabNavigation />
      {/* Header */}
      <header className="px-4 sm:px-6 py-6 sm:py-8 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-indigo-100 flex items-center justify-center">
              <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Mock Exams</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Full-length practice exams to test your knowledge
              </p>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="text-xl sm:text-3xl font-bold text-gray-900">
                {mockExams.filter(e => getExamStats(e.id).completed).length}/{mockExams.length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Completed</div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3 sm:p-4">
              <div className="text-xl sm:text-3xl font-bold text-emerald-600">
                {Math.round(mockExams.reduce((acc, e) => acc + getExamStats(e.id).bestScore, 0) / mockExams.length) || 0}%
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Avg Score</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
              <div className="text-xl sm:text-3xl font-bold text-blue-600">
                {mockExams.reduce((acc, e) => acc + getExamStats(e.id).attempts, 0)}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Total Attempts</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {mockExams.map((exam, index) => {
            const examStats = getExamStats(exam.id);
            const colors = [
              { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
              { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
              { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
              { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
            ];
            const color = colors[index % colors.length];

            return (
              <Card
                key={exam.id}
                className={`p-6 sm:p-8 border-2 ${color.border} hover:shadow-lg transition-all relative overflow-hidden`}
              >
                {examStats.completed && (
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}

                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl ${color.bg} flex items-center justify-center mb-4`}>
                  <Brain className={`w-6 h-6 sm:w-8 sm:h-8 ${color.text}`} />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  {exam.name}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  {exam.description}
                </p>

                {/* Stats */}
                <div className="space-y-2 mb-6">
                  {examStats.bestScore > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Best Score:</span>
                      <span className="font-semibold text-emerald-600">{examStats.bestScore}%</span>
                    </div>
                  )}
                  {examStats.attempts > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Attempts:</span>
                      <span className="font-semibold text-gray-900">{examStats.attempts}</span>
                    </div>
                  )}
                </div>

                <Link href={exam.route}>
                  <Button className={`w-full ${color.text.replace('text-', 'bg-').replace('-600', '-500')} hover:opacity-90`}>
                    {examStats.completed ? 'Retake Exam' : 'Start Exam'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>

        {/* Tips Section */}
        <Card className="mt-8 p-6 sm:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Exam Tips
          </h3>
          <ul className="space-y-2 text-sm sm:text-base text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Set aside uninterrupted time to complete each mock exam</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Use Lock Mode to minimize distractions and simulate real exam conditions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Review all questions after completing to understand your mistakes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Retake exams to track your improvement over time</span>
            </li>
          </ul>
        </Card>
      </main>
    </div>
  );
}
