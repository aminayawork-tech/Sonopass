'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStats, getCurrentModalityStats, type UserStats } from '@/lib/userStats';
import { useModality } from '@/contexts/ModalityContext';
import {
  Zap,
  BookOpen,
  Timer,
  BookMarked,
  Target,
  Clock,
  Flame,
  ListChecks,
  Menu,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import MenuModal from '@/components/layout/MenuModal';
import { ModalitySelectorDropdown } from '@/components/ModalitySelector';
import GradientIcon, { type GradientName } from '@/components/GradientIcon';

const STUDY_MODES: { href: string; title: string; subtitle: string; icon: LucideIcon; gradient: GradientName }[] = [
  { href: '/exam/quick-10', title: 'Quick 10', subtitle: '~5 minutes', icon: Zap, gradient: 'emerald' },
  { href: '/practice', title: 'Study Mode', subtitle: 'By category', icon: BookOpen, gradient: 'blue' },
  { href: '/exam/mock-exams', title: 'Mock Exams', subtitle: 'Full length', icon: Timer, gradient: 'violet' },
  { href: '/study-guide', title: 'Study Guide', subtitle: 'Flashcards', icon: BookMarked, gradient: 'amber' },
];

function greetingFor(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [greeting, setGreeting] = useState('Welcome back');
  const { currentModality } = useModality();

  useEffect(() => {
    setStats(getStats());
    setGreeting(greetingFor(new Date().getHours()));
  }, []);

  const modalityStats = stats ? getCurrentModalityStats(stats) : null;
  const accuracy = modalityStats && modalityStats.totalAnswered > 0
    ? Math.round((modalityStats.totalCorrect / modalityStats.totalAnswered) * 100)
    : 0;

  const statItems: { label: string; value: string; icon: LucideIcon; gradient: GradientName }[] = [
    { label: 'Day streak', value: String(stats?.streak ?? 0), icon: Flame, gradient: 'orange' },
    { label: 'Accuracy', value: `${accuracy}%`, icon: Target, gradient: 'emerald' },
    { label: 'Answered', value: String(modalityStats?.totalAnswered ?? 0), icon: ListChecks, gradient: 'indigo' },
  ];

  return (
    <AppLayout>
      <MenuModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <div className="min-h-screen" style={{ backgroundColor: '#F4F5F7' }}>

        {/* Header */}
        <div className="px-5 pt-14 pb-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-[17px] font-extrabold tracking-tight">
              <span className="text-ink">Sono</span>
              <span style={{ color: '#2ea873' }}>Pass</span>
            </p>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white surface active:scale-95 transition-transform"
              aria-label="Open menu"
            >
              <Menu size={18} className="text-ink" strokeWidth={2} />
            </button>
          </div>
          <h1 className="text-[30px] font-extrabold tracking-[-0.03em] text-ink leading-tight">{greeting}</h1>
          <p className="text-slate-500 text-[15px] mt-1">
            {currentModality ? `Let's get you ready for ${currentModality.shortName}.` : 'Your registry exam prep companion'}
          </p>
          <div className="mt-4">
            <ModalitySelectorDropdown />
          </div>
        </div>

        {/* Study modes — 2x2 tiles */}
        <div className="px-5 mb-7">
          <p className="eyebrow mb-3">Start studying</p>
          <div className="grid grid-cols-2 gap-3">
            {STUDY_MODES.map(({ href, title, subtitle, icon, gradient }) => (
              <button
                key={href}
                onClick={() => router.push(href)}
                className="surface rounded-[22px] p-4 text-left active:scale-[0.97] transition-transform"
              >
                <div className="flex items-start justify-between mb-5">
                  <GradientIcon icon={icon} gradient={gradient} size={44} />
                  <ArrowUpRight size={16} className="text-slate-300" />
                </div>
                <p className="text-[15px] font-bold text-ink leading-tight">{title}</p>
                <p className="text-[12px] text-slate-400 font-medium mt-0.5">{subtitle}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Stats — single card */}
        <div className="px-5 mb-7">
          <p className="eyebrow mb-3">Your progress</p>
          <div className="surface rounded-[22px] grid grid-cols-3 divide-x divide-slate-100 py-4">
            {statItems.map(({ label, value, icon, gradient }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <GradientIcon icon={icon} gradient={gradient} size={32} />
                <div className="text-center">
                  <div className="text-[20px] font-extrabold text-ink leading-none tracking-tight">{value}</div>
                  <div className="text-[11px] text-slate-400 font-medium mt-1">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exam tip */}
        <div className="px-5 mb-7">
          <div className="rounded-[22px] overflow-hidden" style={{ background: 'linear-gradient(135deg, #0E1726 0%, #1B2A44 100%)', boxShadow: '0 12px 28px -14px rgba(14,23,38,0.6)' }}>
            <div className="flex items-center justify-between px-5 pt-5 mb-3">
              <span className="eyebrow" style={{ color: '#4fd49a' }}>Exam tip</span>
              <Clock size={13} className="text-slate-500" />
            </div>
            <h2 className="px-5 text-[17px] font-extrabold text-white leading-snug tracking-tight mb-2">
              Focus on your weak areas first
            </h2>
            <p className="px-5 text-[14px] text-slate-300 leading-relaxed">
              Targeted practice on weak topics improves scores faster than re-studying what you already know.
            </p>
            <button
              onClick={() => router.push('/progress')}
              className="mx-5 mt-4 mb-5 flex items-center gap-1.5 text-[13px] font-semibold active:opacity-70 transition-opacity"
              style={{ color: '#4fd49a' }}
            >
              View my progress
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        <div className="px-5 pb-6 text-center">
          <p className="text-[11px] text-slate-400">SonoPass · Made for sonographers</p>
        </div>
      </div>
    </AppLayout>
  );
}
