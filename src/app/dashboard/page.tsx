'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { getStats, getCurrentModalityStats, type UserStats } from '@/lib/userStats';
import { useModality } from '@/contexts/ModalityContext';
import {
  Zap,
  BookOpen,
  Brain,
  TrendingUp,
  Target,
  ClipboardList,
  ChevronRight,
  Clock,
  Flame,
  Star,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const { currentModality } = useModality();

  useEffect(() => {
    setStats(getStats());
  }, []);

  const modalityStats = stats ? getCurrentModalityStats(stats) : null;
  const accuracy = modalityStats && modalityStats.totalAnswered > 0
    ? Math.round((modalityStats.totalCorrect / modalityStats.totalAnswered) * 100)
    : 0;

  return (
    <AppLayout>
      <div className="min-h-screen pb-nav" style={{ backgroundColor: '#F5F7FA' }}>

        {/* Hero Header */}
        <div className="px-5 pt-6 pb-5">
          <h1 className="text-3xl font-black tracking-tight mb-0.5">
            <span className="text-gray-900">Sono</span>
            <span style={{ color: '#3abc83' }}>Pass</span>
          </h1>
          <p className="text-gray-500 text-[14px]">Your registry exam prep companion</p>
        </div>

        {/* Study Modes */}
        <div className="px-5 mb-7">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Start Studying</p>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => router.push('/exam/quick-10')}
              className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-4 text-left active:scale-[0.98] transition-all shadow-sm border border-gray-100"
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

            <button
              onClick={() => router.push('/practice')}
              className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-4 text-left active:scale-[0.98] transition-all shadow-sm border border-gray-100"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-blue-50">
                <BookOpen size={17} className="text-blue-500" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-gray-900">Study Mode</p>
                <p className="text-[11px] text-gray-400 leading-snug">Practice by category with feedback</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 shrink-0" />
            </button>

            <button
              onClick={() => router.push('/exam/mock-exams')}
              className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-4 text-left active:scale-[0.98] transition-all shadow-sm border border-gray-100"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-purple-50">
                <Brain size={17} className="text-purple-500" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-gray-900">Mock Exams</p>
                <p className="text-[11px] text-gray-400 leading-snug">Full-length timed practice tests</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 shrink-0" />
            </button>

            <button
              onClick={() => router.push('/study-guide')}
              className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-4 text-left active:scale-[0.98] transition-all shadow-sm border border-gray-100"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-amber-50">
                <ClipboardList size={17} className="text-amber-500" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-gray-900">Study Guide</p>
                <p className="text-[11px] text-gray-400 leading-snug">Theory, anatomy & key concepts</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 shrink-0" />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="px-5 mb-7">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Your Stats</p>
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
              <Flame size={18} className="mx-auto mb-1 text-orange-400" />
              <div className="text-xl font-black text-gray-900">{stats?.streak ?? 0}</div>
              <div className="text-[10px] text-gray-400 font-medium">Day Streak</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
              <Target size={18} className="mx-auto mb-1" style={{ color: '#3abc83' }} />
              <div className="text-xl font-black" style={{ color: '#3abc83' }}>{accuracy}%</div>
              <div className="text-[10px] text-gray-400 font-medium">Accuracy</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
              <Star size={18} className="mx-auto mb-1 text-amber-400" />
              <div className="text-xl font-black text-gray-900">{modalityStats?.totalAnswered ?? 0}</div>
              <div className="text-[10px] text-gray-400 font-medium">Questions</div>
            </div>
          </div>
        </div>

        {/* Today's Card */}
        <div className="px-5 mb-7">
          <div className="rounded-2xl overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
            <div className="flex items-center justify-between px-5 pt-5 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#3abc83' }}>
                Exam Tip
              </span>
              <Clock size={13} className="text-gray-500" />
            </div>
            <h2 className="px-5 text-[17px] font-black text-white leading-snug tracking-tight mb-2">
              Focus on your weak areas first
            </h2>
            <p className="px-5 text-[14px] text-gray-300 leading-relaxed">
              Studies show that targeted practice on weak topics improves scores faster than re-studying what you already know.
            </p>
            <button
              onClick={() => router.push('/progress')}
              className="mx-5 mt-4 mb-5 flex items-center gap-1.5 text-[13px] font-semibold active:opacity-70 transition-opacity"
              style={{ color: '#3abc83' }}
            >
              View my progress
              <span className="text-[16px] leading-none">→</span>
            </button>
          </div>
        </div>

        <div className="px-5 pb-6 text-center">
          <p className="text-[11px] text-gray-400">SonoPass · Made for sonographers</p>
        </div>
      </div>
    </AppLayout>
  );
}
