'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useModality } from '@/contexts/ModalityContext';
import { getStats, getCurrentModalityStats } from '@/lib/userStats';
import {
  BookOpen, GraduationCap, Library, ChevronRight,
  Zap, Target, Heart, Brain,
  Activity, BarChart3, AlertTriangle, Stethoscope, Waves,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

export default function StudyModePage() {
  const router = useRouter();
  const { currentModality } = useModality();
  const [stats, setStats] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    setStats(getStats());
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      if (!currentModality) return;
      try {
        const response = await fetch(`/study-guides/${currentModality.id}/categories.json`);
        if (response.ok) {
          const data = await response.json();
          const mapped = Array.isArray(data) ? data.map((cat: any) => ({
            id: cat.id,
            name: cat.title,
            icon: cat.icon,
            total: cat.questionCount || 0,
          })) : [];
          setCategories(mapped);
        }
      } catch {
        setCategories([]);
      }
    };
    loadCategories();
  }, [currentModality]);

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      '🫀': Heart, 'heart': Heart,
      '📖': BookOpen, 'book': BookOpen,
      '🧠': Brain, 'brain': Brain,
      '❤️': Heart,
      '📊': BarChart3, 'activity': Activity,
      '⚠️': AlertTriangle, 'alert-triangle': AlertTriangle,
      '⚡': Zap, 'zap': Zap,
      '🔊': Waves, 'waves': Waves,
      '🎯': Target, 'target': Target,
      '🛡️': Stethoscope, 'shield': Stethoscope,
      'default': BookOpen,
    };
    return iconMap[iconName] || iconMap['default'];
  };

  const iconColors = [
    { bg: '#e8f8f2', color: '#3abc83' },
    { bg: '#eff6ff', color: '#3b82f6' },
    { bg: '#faf5ff', color: '#a855f7' },
    { bg: '#fff7ed', color: '#f97316' },
    { bg: '#fef2f2', color: '#ef4444' },
    { bg: '#f0fdf4', color: '#22c55e' },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen pb-nav" style={{ backgroundColor: '#F5F7FA' }}>

        {/* Page Header */}
        <div className="px-5 pt-14 pb-5">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Study Mode</h1>
          <p className="text-gray-500 text-[14px] mt-0.5">Practice by topic and category</p>
        </div>

        {/* Quick Actions */}
        <div className="px-5 mb-7">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Start</p>
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
              onClick={() => router.push('/exam/study')}
              className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-4 text-left active:scale-[0.98] transition-all shadow-sm border border-gray-100"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-blue-50">
                <Target size={17} className="text-blue-500" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-gray-900">All Topics Quiz</p>
                <p className="text-[11px] text-gray-400 leading-snug">Practice with instant feedback</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 shrink-0" />
            </button>
          </div>
        </div>

        {/* Topic Categories */}
        <div className="px-5 mb-7">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Topic Categories</p>
          <div className="flex flex-col gap-2.5">
            {categories.length === 0 && (
              <div className="bg-white rounded-2xl px-4 py-6 text-center shadow-sm border border-gray-100">
                <p className="text-[13px] text-gray-400">Loading categories…</p>
              </div>
            )}
            {categories.map((cat, idx) => {
              const IconComponent = getIconComponent(cat.icon);
              const colors = iconColors[idx % iconColors.length];
              return (
                <button
                  key={cat.id}
                  onClick={() => router.push(`/exam/study?category=${encodeURIComponent(cat.name)}`)}
                  className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-4 text-left active:scale-[0.98] transition-all shadow-sm border border-gray-100"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: colors.bg }}
                  >
                    <IconComponent size={17} style={{ color: colors.color }} strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-gray-900">{cat.name}</p>
                    <p className="text-[11px] text-gray-400 leading-snug">{cat.total} questions</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Resources */}
        <div className="px-5 mb-7">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Resources</p>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => router.push('/study-guide')}
              className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-4 text-left active:scale-[0.98] transition-all shadow-sm border border-gray-100"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-amber-50">
                <GraduationCap size={17} className="text-amber-500" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-gray-900">Study Guide</p>
                <p className="text-[11px] text-gray-400 leading-snug">Theory, anatomy & key concepts</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 shrink-0" />
            </button>

            <button
              onClick={() => router.push('/glossary')}
              className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-4 text-left active:scale-[0.98] transition-all shadow-sm border border-gray-100"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-purple-50">
                <Library size={17} className="text-purple-500" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-gray-900">Glossary</p>
                <p className="text-[11px] text-gray-400 leading-snug">Essential terms & definitions</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 shrink-0" />
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
