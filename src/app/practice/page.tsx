'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useModality } from '@/contexts/ModalityContext';
import {
  ChevronRight, Zap, Target, Heart, Brain,
  Activity, AlertTriangle, Stethoscope, Waves,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

const CARD_GRADIENTS = [
  'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
  'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
  'linear-gradient(135deg, #059669 0%, #10b981 100%)',
  'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
  'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)',
  'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
  'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
  'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
];

// Maps generic icon keys (fallback path)
const ICON_MAP: { [key: string]: any } = {
  'heart': Heart, 'brain': Brain, 'activity': Activity,
  'alert-triangle': AlertTriangle, 'zap': Zap, 'waves': Waves,
  'target': Target, 'shield': Stethoscope, 'default': Stethoscope,
};

// Maps category name → icon component
const CATEGORY_ICONS: { [key: string]: any } = {
  'Cerebrovascular': Brain,
  'Cerebrovascular System': Brain,
  'Arterial Anatomy': Heart,
  'Arterial Hemodynamics': Activity,
  'Arterial Disease': AlertTriangle,
  'Arterial Testing': Target,
  'Venous Anatomy': Waves,
  'Venous Hemodynamics': Activity,
  'Venous Disease': AlertTriangle,
  'Venous Testing': Target,
  'Physics & Instrumentation': Zap,
  'General & Other': Stethoscope,
  'Vascular': Stethoscope,
};

export default function StudyModePage() {
  const router = useRouter();
  const { currentModality, loadQuestions } = useModality();
  const [categories, setCategories] = useState<{ name: string; total: number; icon: string }[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      if (!currentModality) return;
      try {
        const questionsData = await loadQuestions();
        const allQuestions = [
          ...questionsData.exam1,
          ...questionsData.exam2,
          ...questionsData.exam3,
          ...questionsData.exam4,
        ];
        const map = new Map<string, number>();
        allQuestions.forEach((q: any) => {
          map.set(q.category, (map.get(q.category) || 0) + 1);
        });
        const sorted = Array.from(map.entries())
          .sort((a, b) => b[1] - a[1])
          .map(([name, total]) => ({ name, total, icon: 'default' }));
        setCategories(sorted);
      } catch {
        setCategories([]);
      }
    };
    loadCategories();
  }, [currentModality, loadQuestions]);

  return (
    <AppLayout>
      <div className="min-h-screen pb-nav" style={{ backgroundColor: '#F5F7FA' }}>

        {/* Page Header */}
        <div className="px-5 pt-14 pb-5">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Study Mode</h1>
          <p className="text-gray-500 text-[14px] mt-0.5">Practice by topic and category</p>
        </div>

        {/* Quick Actions */}
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
                <p className="text-[11px] text-gray-400 leading-snug">10 random questions · ~5 minutes</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 shrink-0" />
            </button>

          </div>
        </div>

        {/* Topic Categories — colorful grid */}
        <div className="px-5 mb-7">
          <p className="eyebrow mb-3">Topic Categories</p>

          {categories.length === 0 ? (
            <div className="bg-white rounded-2xl px-4 py-6 text-center surface">
              <p className="text-[13px] text-gray-400">Loading categories…</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat, idx) => {
                const IconComponent = CATEGORY_ICONS[cat.name] || ICON_MAP[cat.icon] || Stethoscope;
                const gradient = CARD_GRADIENTS[idx % CARD_GRADIENTS.length];
                return (
                  <button
                    key={cat.name}
                    onClick={() => router.push(`/exam/study?category=${encodeURIComponent(cat.name)}&direct=1`)}
                    className="rounded-2xl p-4 flex flex-col items-center text-center active:scale-[0.97] transition-all shadow-md"
                    style={{ background: gradient }}
                  >
                    <IconComponent size={28} className="text-white mb-2 opacity-90" strokeWidth={1.75} />
                    <p className="text-[13px] font-extrabold text-white leading-snug mb-1">{cat.name}</p>
                    <p className="text-[22px] font-extrabold text-white leading-none">{cat.total}</p>
                    <p className="text-[11px] text-white/80 font-semibold">Questions</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-5 pb-6 text-center">
          <p className="text-[11px] text-gray-400">SonoPass · Made for sonographers</p>
        </div>
      </div>
    </AppLayout>
  );
}
