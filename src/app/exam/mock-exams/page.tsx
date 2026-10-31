'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Clock, Zap, ChevronRight, ArrowRight } from 'lucide-react';
import { useModality } from '@/contexts/ModalityContext';
import { getStats, getCurrentModalityStats, type UserStats } from '@/lib/userStats';
import AppLayout from '@/components/layout/AppLayout';
import { gradientCss, GRADIENTS, type GradientName } from '@/components/GradientIcon';

const EXAM_GRADIENTS: GradientName[] = ['violet', 'blue', 'cyan', 'rose', 'indigo', 'amber'];

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
    const bestScore = attempts > 0
      ? Math.max(...examScores.map(e => Math.round((e.score / e.total) * 100)))
      : 0;
    return { completed: attempts > 0, bestScore, attempts };
  };

  const completedCount = mockExams.filter(e => getExamStats(e.id).completed).length;
  const accuracy = modalityStats && modalityStats.totalAnswered > 0
    ? Math.round((modalityStats.totalCorrect / modalityStats.totalAnswered) * 100)
    : 0;

  return (
    <AppLayout>
      <div className="min-h-screen" style={{ backgroundColor: '#F4F5F7' }}>

        {/* Header */}
        <div className="px-5 pt-14 pb-5">
          <h1 className="text-[30px] font-extrabold tracking-[-0.03em] text-ink leading-tight">Mock Exams</h1>
          <p className="text-slate-500 text-[15px] mt-1">Practice under real registry conditions</p>
        </div>

        {/* Readiness summary */}
        <div className="px-5 mb-6">
          <div
            className="rounded-[24px] p-5"
            style={{ background: 'linear-gradient(135deg, #0E1726 0%, #1B2A44 100%)', boxShadow: '0 14px 30px -16px rgba(14,23,38,0.65)' }}
          >
            <p className="eyebrow mb-4" style={{ color: '#4fd49a' }}>Exam readiness</p>
            <div className="grid grid-cols-3 divide-x divide-white/10">
              <div className="pr-3">
                <div className="text-[26px] font-extrabold text-white leading-none tracking-tight">
                  {completedCount}<span className="text-slate-500 text-[18px]">/{mockExams.length}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium mt-1.5">Exams done</div>
              </div>
              <div className="px-3">
                <div className="text-[26px] font-extrabold leading-none tracking-tight" style={{ color: '#4fd49a' }}>{accuracy}%</div>
                <div className="text-[11px] text-slate-400 font-medium mt-1.5">Accuracy</div>
              </div>
              <div className="pl-3">
                <div className="text-[26px] font-extrabold text-white leading-none tracking-tight">{stats?.streak ?? 0}</div>
                <div className="text-[11px] text-slate-400 font-medium mt-1.5">Day streak</div>
              </div>
            </div>
            {mockExams.length > 0 && (
              <div className="mt-5 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(completedCount / mockExams.length) * 100}%`, backgroundColor: '#4fd49a' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Quick 10 banner */}
        <div className="px-5 mb-7">
          <button
            onClick={() => router.push('/exam/quick-10')}
            className="w-full rounded-[22px] p-5 flex items-center gap-4 text-left active:scale-[0.98] transition-transform relative overflow-hidden"
            style={{ background: gradientCss('emerald'), boxShadow: `0 12px 26px -14px ${GRADIENTS.emerald[0]}` }}
          >
            <div className="absolute -right-6 -top-8 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute right-10 -bottom-12 w-24 h-24 rounded-full bg-white/10" />
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 relative">
              <Zap size={22} className="text-white" strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0 relative">
              <p className="text-[17px] font-extrabold text-white leading-tight">Quick 10</p>
              <p className="text-[13px] text-white/80 font-medium mt-0.5">10 random questions · ~5 min</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 relative">
              <ArrowRight size={16} style={{ color: GRADIENTS.emerald[0] }} strokeWidth={2.5} />
            </div>
          </button>
        </div>

        {/* Full-length exams */}
        <div className="px-5 mb-7">
          <p className="eyebrow mb-3">Full-length exams</p>
          <div className="flex flex-col gap-3">
            {mockExams.length === 0 && (
              <div className="surface rounded-[22px] px-4 py-6 text-center">
                <p className="text-[13px] text-slate-400">No exams available for this modality yet</p>
              </div>
            )}
            {mockExams.map((exam, index) => {
              const examStats = getExamStats(exam.id);
              const gradient = EXAM_GRADIENTS[index % EXAM_GRADIENTS.length];
              const questionCount = exam.description?.match(/(\d+)\s*questions/)?.[1];
              return (
                <button
                  key={exam.id}
                  onClick={() => router.push(exam.route)}
                  className="surface rounded-[22px] p-4 flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{
                      background: gradientCss(gradient),
                      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.28), 0 6px 14px -6px ${GRADIENTS[gradient][0]}99`,
                    }}
                  >
                    <span className="text-[18px] font-extrabold text-white">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold text-ink leading-tight">{exam.name}</p>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      {questionCount && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-500">
                          {questionCount} questions
                        </span>
                      )}
                      {examStats.completed ? (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ backgroundColor: '#e8f8f2', color: '#2ea873' }}>
                          Best {examStats.bestScore}%
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-500">
                          Not started
                        </span>
                      )}
                    </div>
                  </div>
                  {examStats.completed
                    ? <CheckCircle2 size={18} style={{ color: '#2ea873' }} className="shrink-0" />
                    : <ChevronRight size={18} className="text-slate-300 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tip */}
        <div className="px-5 mb-7">
          <div className="surface rounded-[22px] p-5 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
              <Clock size={17} className="text-ink" />
            </div>
            <div>
              <p className="text-[15px] font-bold text-ink leading-snug">Simulate the real thing</p>
              <p className="text-[13.5px] text-slate-500 leading-relaxed mt-1">
                Set aside uninterrupted time and finish each exam start to end before reviewing answers.
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 pb-6 text-center">
          <p className="text-[11px] text-slate-400">SonoPass · Made for sonographers</p>
        </div>
      </div>
    </AppLayout>
  );
}
