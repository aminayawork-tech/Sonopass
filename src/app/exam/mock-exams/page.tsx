'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, CheckCircle2, Clock, Zap, Target, ChevronRight, Flame, Star } from 'lucide-react';
import { useModality } from '@/contexts/ModalityContext';
import { getStats, getCurrentModalityStats, type UserStats } from '@/lib/userStats';
import AppLayout from '@/components/layout/AppLayout';

export default function MockExamsPage() {
  const router = useRouter();
  const { currentModality } = useModality();
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    setStats(getStats());
  }, []);

  const modalityStats = stats ? getCurrentModalityStats(stats) : null;

  const mockExams = currentModality?.examModes.filter(mode =>
    mode.id.startsWith('mock-')
  ) || [];

  const getExamStats = (examId: string) => {
    if (!modalityStats) return { completed: false, bestScore: 0, attempts: 0 };
    const examScores = modalityStats.examScores.filter(e => e.exam === examId);
    const attempts = examScores.length;
    const completed = attempts > 0;
    const bestScore = examScores.length > 0
      ? Math.max(...examScores.map(e => Math.round((e.score / e.total) * 100)))
      : 0;
    return { completed, bestScore, attempts };
  };

  const completedCount = mockExams.filter(e => getExamStats(e.id).completed).length;
  const accuracy = modalityStats && modalityStats.totalAnswered > 0
    ? Math.round((modalityStats.totalCorrect / modalityStats.totalAnswered) * 100)
    : 0;

  return (
    <AppLayout>
      <div className="min-h-screen pb-nav" style={{ backgroundColor: '#F5F7FA' }}>

        {/* Page Header */}
        <div className="px-5 pt-14 pb-5">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Mock Exams</h1>
          <p className="text-gray-500 text-[14px] mt-0.5">Full-length timed practice tests</p>
        </div>

        {/* Stats Row */}
        <div className="px-5 mb-7">
          <p className="eyebrow mb-3">Your Stats</p>
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-white rounded-2xl p-4 text-center surface">
              <Brain size={18} className="mx-auto mb-1 text-purple-500" />
              <div className="text-xl font-extrabold text-gray-900">{completedCount}/{mockExams.length}</div>
              <div className="text-[10px] text-gray-400 font-medium">Completed</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center surface">
              <Target size={18} className="mx-auto mb-1" style={{ color: '#3abc83' }} />
              <div className="text-xl font-extrabold" style={{ color: '#3abc83' }}>{accuracy}%</div>
              <div className="text-[10px] text-gray-400 font-medium">Accuracy</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center surface">
              <Flame size={18} className="mx-auto mb-1 text-orange-400" />
              <div className="text-xl font-extrabold text-gray-900">{stats?.streak ?? 0}</div>
              <div className="text-[10px] text-gray-400 font-medium">Day Streak</div>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div className="px-5 mb-7">
          <p className="eyebrow mb-3">Quick Start</p>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => router.push('/exam/quick-10')}
              className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-4 text-left active:scale-[0.98] transition-all surface"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#e8f8f2' }}>
                <Zap size={17} style={{ color: '#3abc83' }} strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-gray-900">Quick 10</p>
                <p className="text-[11px] text-gray-400 leading-snug">10 random questions • ~5 minutes</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 shrink-0" />
            </button>
          </div>
        </div>

        {/* Full-Length Exams */}
        <div className="px-5 mb-7">
          <p className="eyebrow mb-3">Full-Length Exams</p>
          <div className="flex flex-col gap-2.5">
            {mockExams.length === 0 && (
              <div className="bg-white rounded-2xl px-4 py-6 text-center surface">
                <p className="text-[13px] text-gray-400">No exams available for this modality yet</p>
              </div>
            )}
            {mockExams.map((exam, index) => {
              const examStats = getExamStats(exam.id);
              const colors = [
                { bg: '#faf5ff', color: '#a855f7' },
                { bg: '#e8f8f2', color: '#3abc83' },
                { bg: '#eff6ff', color: '#3b82f6' },
                { bg: '#fff7ed', color: '#f97316' },
              ];
              const c = colors[index % colors.length];
              return (
                <button
                  key={exam.id}
                  onClick={() => router.push(exam.route)}
                  className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-4 text-left active:scale-[0.98] transition-all surface"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: c.bg }}>
                    <Brain size={17} style={{ color: c.color }} strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-gray-900">{exam.name}</p>
                    <p className="text-[11px] text-gray-400 leading-snug">
                      {examStats.completed
                        ? `Best: ${examStats.bestScore}% · ${examStats.attempts} attempt${examStats.attempts !== 1 ? 's' : ''}`
                        : exam.description || 'Full-length timed exam'}
                    </p>
                  </div>
                  {examStats.completed && (
                    <CheckCircle2 size={16} style={{ color: '#3abc83' }} className="shrink-0" />
                  )}
                  <ChevronRight size={16} className="text-gray-300 shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Tip Card */}
        <div className="px-5 mb-7">
          <div className="rounded-2xl overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
            <div className="flex items-center justify-between px-5 pt-5 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#3abc83' }}>
                Exam Tip
              </span>
              <Clock size={13} className="text-gray-500" />
            </div>
            <h2 className="px-5 text-[17px] font-extrabold text-white leading-snug tracking-tight mb-2">
              Simulate real exam conditions
            </h2>
            <p className="px-5 text-[14px] text-gray-300 leading-relaxed pb-5">
              Set aside uninterrupted time and work through each mock exam from start to finish before reviewing answers.
            </p>
          </div>
        </div>

        <div className="px-5 pb-6 text-center">
          <p className="text-[11px] text-gray-400">SonoPass · Made for sonographers</p>
        </div>
      </div>
    </AppLayout>
  );
}
