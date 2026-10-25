'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStats, getCurrentModalityStats, getBadgeInfo, type UserStats } from '@/lib/userStats';
import { useModality } from '@/contexts/ModalityContext';
import {
  TrendingUp, Target, Flame, Star, Brain, Trophy, ChevronRight, Clock,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import RegistryReadinessWidget from '@/components/RegistryReadinessWidget';

export default function ProgressPage() {
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
  const completionRate = currentModality && modalityStats
    ? Math.round((modalityStats.totalAnswered / currentModality.questionCount) * 100)
    : 0;

  const categoryPerformance = [
    { name: 'Anatomy & Physiology', percentage: 75 },
    { name: 'Hemodynamics', percentage: 80 },
    { name: 'Vascular Protocols', percentage: 62 },
    { name: 'Disease States', percentage: 76 },
    { name: 'Instrumentation', percentage: 73 },
  ];

  const weakest = categoryPerformance.reduce((min, cat) =>
    cat.percentage < min.percentage ? cat : min
  );

  return (
    <AppLayout>
      <div className="min-h-screen pb-nav" style={{ backgroundColor: '#F5F7FA' }}>

        {/* Page Header */}
        <div className="px-5 pt-14 pb-5">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Progress</h1>
          <p className="text-gray-500 text-[14px] mt-0.5">Track your learning journey</p>
        </div>

        {/* Stats Row */}
        <div className="px-5 mb-7">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Overview</p>
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

        {/* Registry Readiness */}
        <div className="px-5 mb-7">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Registry Readiness</p>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center">
            <RegistryReadinessWidget size="large" showLabel={true} />
          </div>
        </div>

        {/* Question Bank Progress */}
        <div className="px-5 mb-7">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Question Bank</p>
          <div className="bg-white rounded-2xl px-4 py-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[14px] font-bold text-gray-900">Completion</p>
              <p className="text-[14px] font-black" style={{ color: '#3abc83' }}>{completionRate}%</p>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${completionRate}%`, backgroundColor: '#3abc83' }}
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-2">
              {modalityStats?.totalAnswered ?? 0} of {currentModality?.questionCount ?? 0} questions answered
            </p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="px-5 mb-7">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">By Category</p>
          <div className="flex flex-col gap-2.5">
            {categoryPerformance.map((cat) => {
              const color = cat.percentage >= 80 ? '#3abc83'
                : cat.percentage >= 70 ? '#3b82f6'
                : cat.percentage >= 60 ? '#f97316'
                : '#ef4444';
              return (
                <button
                  key={cat.name}
                  onClick={() => router.push(`/exam/study?category=${encodeURIComponent(cat.name)}`)}
                  className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-4 text-left active:scale-[0.98] transition-all shadow-sm border border-gray-100"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-[14px] font-bold text-gray-900 truncate pr-2">{cat.name}</p>
                      <p className="text-[14px] font-black shrink-0" style={{ color }}>{cat.percentage}%</p>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${cat.percentage}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Badges */}
        {stats && stats.badges && stats.badges.length > 0 && (
          <div className="px-5 mb-7">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Badges Earned</p>
            <div className="grid grid-cols-3 gap-2.5">
              {stats.badges.map((badgeId, index) => {
                const badgeInfo = getBadgeInfo(badgeId);
                return (
                  <div
                    key={badgeId || index}
                    className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100"
                  >
                    <div className="text-2xl mb-1">{badgeInfo?.icon || '🏆'}</div>
                    <div className="text-[11px] font-bold text-gray-900 leading-tight">
                      {badgeInfo?.name || badgeId}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Focus Card */}
        {weakest.percentage < 75 && (
          <div className="px-5 mb-7">
            <div className="rounded-2xl overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
              <div className="flex items-center justify-between px-5 pt-5 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#3abc83' }}>
                  Focus Area
                </span>
                <Brain size={13} className="text-gray-500" />
              </div>
              <h2 className="px-5 text-[17px] font-black text-white leading-snug tracking-tight mb-2">
                Work on {weakest.name}
              </h2>
              <p className="px-5 text-[14px] text-gray-300 leading-relaxed">
                Your score of {weakest.percentage}% here is your biggest opportunity to raise your overall readiness.
              </p>
              <button
                onClick={() => router.push('/practice')}
                className="mx-5 mt-4 mb-5 flex items-center gap-1.5 text-[13px] font-semibold active:opacity-70 transition-opacity"
                style={{ color: '#3abc83' }}
              >
                Practice this category
                <span className="text-[16px] leading-none">→</span>
              </button>
            </div>
          </div>
        )}

        <div className="px-5 pb-6 text-center">
          <p className="text-[11px] text-gray-400">SonoPass · Made for sonographers</p>
        </div>
      </div>
    </AppLayout>
  );
}
