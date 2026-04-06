'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, CheckCircle2, Clock, ArrowRight, Zap, Target } from 'lucide-react';
import { useModality } from '@/contexts/ModalityContext';
import { getStats, getCurrentModalityStats, type UserStats } from '@/lib/userStats';
import AppLayout from '@/components/layout/AppLayout';

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

  // Get exam stats from examScores array
  const getExamStats = (examId: string) => {
    if (!modalityStats) {
      return { completed: false, bestScore: 0, attempts: 0 };
    }

    const examScores = modalityStats.examScores.filter(e => e.exam === examId);
    const attempts = examScores.length;
    const completed = attempts > 0;
    const bestScore = examScores.length > 0
      ? Math.max(...examScores.map(e => Math.round((e.score / e.total) * 100)))
      : 0;

    return { completed, bestScore, attempts };
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 sm:space-y-6">
        {/* Page Header */}
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-sono-purple/10 flex items-center justify-center">
              <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-sono-purple" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-sono-gray-900">Mock Exams</h1>
              <p className="text-sm sm:text-base text-sono-gray-600 mt-1">
                Full-length practice exams to test your knowledge
              </p>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <Card className="bg-white border border-sono-gray-300 rounded-2xl p-4 sm:p-5">
              <div className="text-2xl sm:text-3xl font-bold text-sono-gray-900">
                {mockExams.filter(e => getExamStats(e.id).completed).length}/{mockExams.length}
              </div>
              <div className="text-xs sm:text-sm text-sono-gray-600 mt-1">Completed</div>
            </Card>
            <Card className="bg-white border border-sono-gray-300 rounded-2xl p-4 sm:p-5">
              <div className="text-2xl sm:text-3xl font-bold text-sono-green-soft">
                {Math.round(mockExams.reduce((acc, e) => acc + getExamStats(e.id).bestScore, 0) / mockExams.length) || 0}%
              </div>
              <div className="text-xs sm:text-sm text-sono-gray-600 mt-1">Avg Score</div>
            </Card>
            <Card className="bg-white border border-sono-gray-300 rounded-2xl p-4 sm:p-5">
              <div className="text-2xl sm:text-3xl font-bold text-sono-blue-soft">
                {mockExams.reduce((acc, e) => acc + getExamStats(e.id).attempts, 0)}
              </div>
              <div className="text-xs sm:text-sm text-sono-gray-600 mt-1">Total Attempts</div>
            </Card>
          </div>
        </div>

        {/* Quick Practice Options */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-sono-gray-900 mb-3 sm:mb-4">Quick Practice</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Link href="/exam/quick-10">
              <Card className="p-5 sm:p-6 bg-gradient-to-br from-sono-green-soft to-sono-green-ultrasound text-white hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-6 h-6" />
                  <h3 className="font-bold text-lg">Quick 10</h3>
                </div>
                <p className="text-sm opacity-90">10 random questions • ~5 minutes</p>
              </Card>
            </Link>

            <Link href="/exam/study">
              <Card className="p-5 sm:p-6 bg-gradient-to-br from-sono-blue-soft to-sono-blue-light text-white hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-6 h-6" />
                  <h3 className="font-bold text-lg">Study Mode</h3>
                </div>
                <p className="text-sm opacity-90">Practice by category with feedback</p>
              </Card>
            </Link>
          </div>
        </div>

        {/* Mock Exams Grid */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-sono-gray-900 mb-3 sm:mb-4">Full-Length Mock Exams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {mockExams.map((exam, index) => {
              const examStats = getExamStats(exam.id);
              const colors = [
                { bg: 'bg-sono-purple/10', text: 'text-sono-purple', border: 'border-sono-purple/30', btnBg: 'bg-sono-purple' },
                { bg: 'bg-sono-green-ultrasound/10', text: 'text-sono-green-ultrasound', border: 'border-sono-green-ultrasound/30', btnBg: 'bg-sono-green-ultrasound' },
                { bg: 'bg-sono-blue-soft/10', text: 'text-sono-blue-soft', border: 'border-sono-blue-soft/30', btnBg: 'bg-sono-blue-soft' },
                { bg: 'bg-sono-amber/10', text: 'text-sono-amber', border: 'border-sono-amber/30', btnBg: 'bg-sono-amber' },
              ];
              const color = colors[index % colors.length];

              return (
                <Card
                  key={exam.id}
                  className={`p-6 sm:p-8 bg-white border-2 ${color.border} hover:shadow-lg transition-all relative overflow-hidden rounded-2xl`}
                >
                  {examStats.completed && (
                    <div className="absolute top-4 right-4">
                      <div className="w-8 h-8 rounded-full bg-sono-green-ultrasound flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-sono-gray-900" />
                      </div>
                    </div>
                  )}

                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${color.bg} flex items-center justify-center mb-4`}>
                    <Brain className={`w-6 h-6 sm:w-8 sm:h-8 ${color.text}`} />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-sono-gray-900 mb-2">
                    {exam.name}
                  </h3>
                  <p className="text-sm sm:text-base text-sono-gray-600 mb-4">
                    {exam.description}
                  </p>

                  {/* Stats */}
                  <div className="space-y-2 mb-6">
                    {examStats.bestScore > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-sono-gray-600">Best Score:</span>
                        <span className="font-semibold text-sono-green-soft">{examStats.bestScore}%</span>
                      </div>
                    )}
                    {examStats.attempts > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-sono-gray-600">Attempts:</span>
                        <span className="font-semibold text-sono-gray-900">{examStats.attempts}</span>
                      </div>
                    )}
                  </div>

                  <Link href={exam.route}>
                    <Button className={`w-full text-white ${color.btnBg} hover:opacity-90 rounded-xl h-12`}>
                      {examStats.completed ? 'Retake Exam' : 'Start Exam'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Tips Section */}
        <Card className="p-6 sm:p-8 bg-gradient-to-r from-sono-green-ultrasound/5 to-sono-blue-soft/5 border border-sono-green-ultrasound/20 rounded-2xl">
          <h3 className="text-xl font-bold text-sono-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-sono-green-ultrasound" />
            Exam Tips
          </h3>
          <ul className="space-y-3 text-sm sm:text-base text-sono-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-sono-green-ultrasound mt-1 font-bold">•</span>
              <span>Set aside uninterrupted time to complete each mock exam</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-sono-green-ultrasound mt-1 font-bold">•</span>
              <span>Use Lock Mode to minimize distractions and simulate real exam conditions</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-sono-green-ultrasound mt-1 font-bold">•</span>
              <span>Review all questions after completing to understand your mistakes</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-sono-green-ultrasound mt-1 font-bold">•</span>
              <span>Retake exams to track your improvement over time</span>
            </li>
          </ul>
        </Card>
      </div>
    </AppLayout>
  );
}
