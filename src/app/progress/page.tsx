'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getStats, getCurrentModalityStats, getRegistryReadiness, BADGES, type UserStats,
} from '@/lib/userStats';
import { useModality } from '@/contexts/ModalityContext';
import {
  Flame, Target, ListChecks, Star, ChevronRight, ArrowUpRight, Brain, HeartPulse, GitBranch,
  AlertTriangle, ScanLine, Waves, Droplets, AudioWaveform, Stethoscope, Zap, Gem, Mountain,
  Award, ClipboardCheck, FileText, Trophy, Lock, type LucideIcon,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import GradientIcon, { gradientCss, type GradientName } from '@/components/GradientIcon';

const CATEGORY_STYLE: Record<string, { icon: LucideIcon; gradient: GradientName }> = {
  'Cerebrovascular': { icon: Brain, gradient: 'violet' },
  'Arterial Hemodynamics': { icon: HeartPulse, gradient: 'rose' },
  'Arterial Anatomy': { icon: GitBranch, gradient: 'orange' },
  'Arterial Disease': { icon: AlertTriangle, gradient: 'amber' },
  'Arterial Testing': { icon: ScanLine, gradient: 'rose' },
  'Venous Hemodynamics': { icon: Waves, gradient: 'blue' },
  'Venous Anatomy': { icon: Droplets, gradient: 'cyan' },
  'Venous Disease': { icon: AlertTriangle, gradient: 'blue' },
  'Venous Testing': { icon: ScanLine, gradient: 'indigo' },
  'Physics & Instrumentation': { icon: AudioWaveform, gradient: 'emerald' },
};

const BADGE_STYLE: Record<string, { icon: LucideIcon; gradient: GradientName }> = {
  first_answer: { icon: Target, gradient: 'emerald' },
  streak_3: { icon: Flame, gradient: 'orange' },
  streak_7: { icon: Zap, gradient: 'amber' },
  perfect_10: { icon: Gem, gradient: 'cyan' },
  halfway: { icon: Mountain, gradient: 'blue' },
  centurion: { icon: Award, gradient: 'indigo' },
  cerebrovascular_master: { icon: Brain, gradient: 'violet' },
  physics_master: { icon: AudioWaveform, gradient: 'emerald' },
  exam1_complete: { icon: ClipboardCheck, gradient: 'blue' },
  exam2_complete: { icon: FileText, gradient: 'indigo' },
  level_5: { icon: Star, gradient: 'amber' },
  level_10: { icon: Trophy, gradient: 'rose' },
};

function badgeStyle(id: string, modalityId?: string) {
  const key = modalityId && id.startsWith(`${modalityId}_`) ? id.slice(modalityId.length + 1) : id;
  return BADGE_STYLE[key] ?? { icon: Award, gradient: 'indigo' as GradientName };
}

function accuracyColor(pct: number) {
  if (pct >= 80) return '#2ea873';
  if (pct >= 65) return '#2563eb';
  if (pct >= 50) return '#d97706';
  return '#e11d48';
}

function readinessMessage(readiness: number, answered: number) {
  if (answered === 0) return 'Answer a few questions to see where you stand.';
  if (readiness >= 90) return "You're registry-ready. Keep it sharp.";
  if (readiness >= 75) return 'Almost there. Keep going.';
  if (readiness >= 60) return "You're making great progress.";
  if (readiness >= 40) return "Keep studying, you've got this.";
  return "You're just getting started.";
}

export default function ProgressPage() {
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const { currentModality } = useModality();

  useEffect(() => {
    setStats(getStats());
  }, []);

  const modalityStats = stats ? getCurrentModalityStats(stats) : null;
  const answered = modalityStats?.totalAnswered ?? 0;
  const accuracy = modalityStats && answered > 0
    ? Math.round((modalityStats.totalCorrect / answered) * 100)
    : 0;
  const readiness = stats ? getRegistryReadiness(stats) : 0;
  const bankTotal = currentModality?.questionCount ?? 0;
  const completionRate = bankTotal > 0 ? Math.min(100, Math.round((answered / bankTotal) * 100)) : 0;

  const categories = Object.entries(modalityStats?.categoryStats ?? {})
    .filter(([, c]) => c.answered > 0)
    .map(([name, c]) => ({ name, answered: c.answered, correct: c.correct, pct: Math.round((c.correct / c.answered) * 100) }))
    .sort((a, b) => a.pct - b.pct);

  const weakest = categories.find((c) => c.answered >= 5 && c.pct < 75);

  const availableBadges = BADGES.filter((b) => b.scope === 'global' || b.modality === currentModality?.id);
  const earned = new Set(stats?.badges ?? []);

  const ringSize = 128;
  const ringStroke = 11;
  const ringRadius = (ringSize - ringStroke) / 2;
  const ringCircumference = 2 * Math.PI * ringRadius;

  const statTiles: { label: string; value: string; icon: LucideIcon; gradient: GradientName }[] = [
    { label: 'Day streak', value: String(stats?.streak ?? 0), icon: Flame, gradient: 'orange' },
    { label: 'Accuracy', value: `${accuracy}%`, icon: Target, gradient: 'emerald' },
    { label: 'Answered', value: String(answered), icon: ListChecks, gradient: 'indigo' },
    { label: `${modalityStats?.xp ?? 0} XP`, value: `Level ${modalityStats?.level ?? 1}`, icon: Star, gradient: 'amber' },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen" style={{ backgroundColor: '#F4F5F7' }}>

        {/* Header */}
        <div className="px-5 pt-14 pb-5">
          <h1 className="text-[30px] font-extrabold tracking-[-0.03em] text-ink leading-tight">Progress</h1>
          <p className="text-slate-500 text-[15px] mt-1">Your road to the registry</p>
        </div>

        {/* Readiness hero */}
        <div className="px-5 mb-6">
          <div
            className="rounded-[26px] p-6 flex items-center gap-5"
            style={{ background: 'linear-gradient(135deg, #0E1726 0%, #1B2A44 100%)', boxShadow: '0 16px 32px -18px rgba(14,23,38,0.7)' }}
          >
            <div className="relative shrink-0" style={{ width: ringSize, height: ringSize }}>
              <svg width={ringSize} height={ringSize} className="-rotate-90">
                <defs>
                  <linearGradient id="readinessRing" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#6ee7b7" />
                  </linearGradient>
                </defs>
                <circle cx={ringSize / 2} cy={ringSize / 2} r={ringRadius} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth={ringStroke} />
                <circle
                  cx={ringSize / 2} cy={ringSize / 2} r={ringRadius} fill="none"
                  stroke="url(#readinessRing)" strokeWidth={ringStroke} strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringCircumference * (1 - readiness / 100)}
                  style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.2,.8,.2,1)' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[32px] font-extrabold text-white leading-none tracking-tight">{readiness}%</span>
                <span className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-[0.1em]">Ready</span>
              </div>
            </div>
            <div className="min-w-0">
              <p className="eyebrow mb-2" style={{ color: '#4fd49a' }}>Registry readiness</p>
              <p className="text-[16px] font-bold text-white leading-snug">{readinessMessage(readiness, answered)}</p>
              {answered > 0 && readiness < 75 && (
                <p className="text-[13px] text-slate-400 mt-1.5">{75 - readiness} points to registry-ready</p>
              )}
            </div>
          </div>
        </div>

        {/* Stat tiles */}
        <div className="px-5 mb-7">
          <div className="grid grid-cols-2 gap-3">
            {statTiles.map(({ label, value, icon, gradient }) => (
              <div key={label} className="surface rounded-[22px] p-4 flex items-center gap-3">
                <GradientIcon icon={icon} gradient={gradient} size={40} />
                <div className="min-w-0">
                  <div className="text-[19px] font-extrabold text-ink leading-none tracking-tight truncate">{value}</div>
                  <div className="text-[11.5px] text-slate-400 font-medium mt-1 truncate">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question bank */}
        <div className="px-5 mb-7">
          <p className="eyebrow mb-3">Question bank</p>
          <div className="surface rounded-[22px] p-5">
            <div className="flex items-end justify-between mb-3">
              <div>
                <span className="text-[26px] font-extrabold text-ink leading-none tracking-tight">{answered}</span>
                <span className="text-[14px] font-semibold text-slate-400"> / {bankTotal}</span>
              </div>
              <span className="text-[13px] font-bold" style={{ color: '#2ea873' }}>{completionRate}% covered</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${completionRate}%`, background: gradientCss('emerald') }} />
            </div>
          </div>
        </div>

        {/* Focus area */}
        {weakest && (
          <div className="px-5 mb-7">
            <button
              onClick={() => router.push('/practice')}
              className="w-full text-left rounded-[22px] p-5 relative overflow-hidden active:scale-[0.98] transition-transform"
              style={{ background: gradientCss((CATEGORY_STYLE[weakest.name]?.gradient) ?? 'rose') }}
            >
              <div className="absolute -right-8 -top-10 w-36 h-36 rounded-full bg-white/10" />
              <p className="eyebrow relative" style={{ color: 'rgba(255,255,255,0.8)' }}>Focus area</p>
              <p className="relative text-[18px] font-extrabold text-white leading-snug mt-2">{weakest.name}</p>
              <p className="relative text-[13.5px] text-white/85 leading-relaxed mt-1">
                {weakest.pct}% correct so far. This is your biggest opportunity to raise your readiness.
              </p>
              <span className="relative inline-flex items-center gap-1.5 mt-4 px-3.5 py-2 rounded-full bg-white text-[13px] font-bold text-ink">
                Practice now <ArrowUpRight size={14} />
              </span>
            </button>
          </div>
        )}

        {/* By category */}
        <div className="px-5 mb-7">
          <p className="eyebrow mb-3">By category</p>
          {categories.length === 0 ? (
            <div className="surface rounded-[22px] p-6 text-center">
              <p className="text-[15px] font-bold text-ink">No category data yet</p>
              <p className="text-[13px] text-slate-500 mt-1">Your strengths and weak spots will show up here as you answer questions.</p>
              <button
                onClick={() => router.push('/practice')}
                className="btn-primary mt-4 h-11 px-5 rounded-2xl text-[14px] font-bold active:scale-[0.98] transition-transform"
              >
                Start studying
              </button>
            </div>
          ) : (
            <div className="surface rounded-[22px] divide-y divide-slate-100">
              {categories.map((cat) => {
                const style = CATEGORY_STYLE[cat.name] ?? { icon: Stethoscope, gradient: 'indigo' as GradientName };
                const color = accuracyColor(cat.pct);
                return (
                  <button
                    key={cat.name}
                    onClick={() => router.push(`/exam/study?category=${encodeURIComponent(cat.name)}&direct=1`)}
                    className="w-full px-4 py-3.5 flex items-center gap-3.5 text-left active:bg-slate-50 transition-colors first:rounded-t-[22px] last:rounded-b-[22px]"
                  >
                    <GradientIcon icon={style.icon} gradient={style.gradient} size={38} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[14.5px] font-bold text-ink truncate">{cat.name}</p>
                        <p className="text-[14px] font-extrabold shrink-0" style={{ color }}>{cat.pct}%</p>
                      </div>
                      <div className="flex items-center gap-2.5 mt-1.5">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${cat.pct}%`, backgroundColor: color }} />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400 shrink-0">{cat.correct}/{cat.answered}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="px-5 mb-7">
          <div className="flex items-center justify-between mb-3">
            <p className="eyebrow">Achievements</p>
            <p className="text-[12px] font-semibold text-slate-400">
              {availableBadges.filter((b) => earned.has(b.id)).length}/{availableBadges.length}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {availableBadges.map((badge) => {
              const isEarned = earned.has(badge.id);
              const style = badgeStyle(badge.id, currentModality?.id);
              return (
                <div key={badge.id} className="surface rounded-[20px] px-2 py-4 flex flex-col items-center text-center">
                  {isEarned ? (
                    <GradientIcon icon={style.icon} gradient={style.gradient} size={42} />
                  ) : (
                    <div className="w-[42px] h-[42px] rounded-[13px] bg-slate-100 flex items-center justify-center">
                      <Lock size={16} className="text-slate-300" />
                    </div>
                  )}
                  <p className={`text-[12px] font-bold leading-tight mt-2.5 ${isEarned ? 'text-ink' : 'text-slate-400'}`}>{badge.name}</p>
                  <p className="text-[10.5px] text-slate-400 leading-snug mt-1">{badge.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-5 pb-6 text-center">
          <p className="text-[11px] text-slate-400">SonoPass · Made for sonographers</p>
        </div>
      </div>
    </AppLayout>
  );
}
