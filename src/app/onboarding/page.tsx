'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import localFont from 'next/font/local';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, CalendarDays, Timer, BookMarked, Layers, CloudUpload } from 'lucide-react';
import { useModality } from '@/contexts/ModalityContext';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabase } from '@/lib/supabase/client';
import { saveOnboarding } from '@/lib/onboarding';
import { styleFor } from '@/components/ModalitySelector';
import GradientIcon from '@/components/GradientIcon';
import OfferPanel from '@/components/OfferPanel';
import { OAuthButtons } from '@/components/auth/AuthShell';
import { cn } from '@/lib/utils';

const handwriting = localFont({ src: '../fonts/Kalam-latin.woff2', weight: '400', display: 'swap' });

// ✏️ Founder's note: replace with your own words
const FOUNDER_NOTE = [
  'When I was studying for my registry, prep was either expensive or scattered: a $300 review seminar, a stack of books, and apps charging hundreds for questions that didn’t feel like the real exam.',
  'I wanted one place to practice every day, take real timed mock exams, and see exactly where I was weak, without spending a fortune.',
  'So I built SonoPass, the prep app I wish I’d had. Every registry is included, every question explains the why, and it costs less than one review book.',
  'I hope it gets you to that pass.',
];
const FOUNDER_SIGNATURE = '— Founder of SonoPass';

type Step = 'fact' | 'welcome' | 'exam' | 'date' | 'founder' | 'offer' | 'account';

const GREEN = '#2ea873';

function Accent({ children }: { children: React.ReactNode }) {
  return <span style={{ color: GREEN }}>{children}</span>;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { allModalities, currentModality, switchModality } = useModality();
  const { configured, user, isPro } = useAuth();
  const registries = allModalities.filter((m) => m.enabled);
  const [step, setStep] = useState<Step>('fact');
  const [examFocus, setExamFocus] = useState<string | null>(currentModality?.id ?? null);
  const [examDate, setExamDate] = useState('');

  const steps: Step[] = useMemo(() => {
    const list: Step[] = ['fact', 'welcome', 'exam', 'date', 'founder'];
    if (!isPro) list.push('offer');
    if (configured && !user) list.push('account');
    return list;
  }, [configured, user, isPro]);
  const index = Math.max(0, steps.indexOf(step));
  const today = new Date().toISOString().slice(0, 10);

  const persist = async () => {
    const answers = { examFocus, examDate: examDate || null, completedAt: new Date().toISOString() };
    saveOnboarding(answers);
    if (examFocus) switchModality(examFocus);
    const supabase = getSupabase();
    if (supabase && user) {
      await supabase.from('profiles').update({
        exam_focus: answers.examFocus,
        exam_date: answers.examDate,
        onboarded_at: answers.completedAt,
        updated_at: answers.completedAt,
      }).eq('id', user.id);
    }
  };

  const goTo = async (target: Step | undefined) => {
    const offerIndex = steps.indexOf('offer');
    const targetIndex = target ? steps.indexOf(target) : steps.length;
    // Save answers once the user is past the questions (before the offer / account step, or at the end)
    if (!target || target === 'account' || (offerIndex >= 0 && targetIndex >= offerIndex)) await persist();
    if (target) setStep(target);
    else router.replace('/dashboard');
  };
  const next = () => goTo(steps[index + 1]);
  const back = () => index > 0 && setStep(steps[index - 1]);
  // Skip never skips the offer: it jumps straight to it (or finishes if already Pro)
  const skip = () => goTo(steps.includes('offer') ? 'offer' : steps[steps.length - 1] === 'account' ? 'account' : undefined);
  const beforeOffer = steps.includes('offer') ? index < steps.indexOf('offer') : step !== 'account';

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: 'linear-gradient(180deg, #DDF4E8 0%, #EEF7F2 260px, #F4F5F7 560px)' }}>
      {/* Header: back · wordmark · progress · counter */}
      <div className="px-5 pt-5 max-w-lg w-full mx-auto">
        <div className="flex items-center gap-3">
          {index > 0 && (
            <button onClick={back} aria-label="Back" className="w-9 h-9 -ml-1 shrink-0 rounded-full bg-white/80 surface flex items-center justify-center">
              <ArrowLeft size={17} className="text-ink" />
            </button>
          )}
          <p className="text-[20px] font-extrabold tracking-[-0.03em] leading-none shrink-0">
            <span className="text-ink">Sono</span><Accent>Pass</Accent>
          </p>
          <div className="flex-1 flex gap-1.5 min-w-0">
            {steps.map((s, i) => (
              <div key={s} className="h-1.5 flex-1 rounded-full transition-colors" style={{ backgroundColor: i <= index ? GREEN : 'rgba(14,23,38,0.10)' }} />
            ))}
          </div>
          <span className="text-[13px] font-bold text-slate-400 shrink-0 tabular-nums">
            {String(index + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="flex-1 px-5 pt-8 pb-6 max-w-lg w-full mx-auto">
        {step === 'fact' && (
          <div className="slide-up">
            <p className="eyebrow">Did you know</p>
            <h1 className="text-[34px] font-extrabold tracking-[-0.035em] text-ink leading-[1.08] mt-3">
              More than 1 in 4 first-time test takers <Accent>don’t pass the SPI.</Accent>
            </h1>
            <div className="grid grid-cols-2 gap-3 mt-7">
              <div className="bg-white rounded-[22px] p-4 surface">
                <p className="text-[34px] font-extrabold text-ink leading-none tracking-tight">72%</p>
                <p className="text-[13px] text-slate-500 mt-2 leading-snug">of first-time takers passed the SPI in 2023</p>
              </div>
              <div className="bg-white rounded-[22px] p-4 surface">
                <p className="text-[34px] font-extrabold text-ink leading-none tracking-tight">65%</p>
                <p className="text-[13px] text-slate-500 mt-2 leading-snug">passed across all attempts, including retakes</p>
              </div>
            </div>
            <p className="text-slate-600 text-[16px] mt-6 leading-relaxed">
              A retake means another exam fee and more weeks of studying. The students who pass practice under exam conditions and fix their weak spots early.
            </p>
            <p className="text-[11.5px] text-slate-400 mt-4">Source: Inteleos/ARDMS published SPI exam statistics, 2023.</p>
          </div>
        )}

        {step === 'welcome' && (
          <div className="slide-up">
            <p className="eyebrow">That’s where we come in</p>
            <h1 className="text-[34px] font-extrabold tracking-[-0.035em] text-ink leading-[1.08] mt-3">
              Pass your registry exam <Accent>with confidence.</Accent>
            </h1>
            <p className="text-slate-500 text-[16px] mt-3 leading-relaxed">Practice questions, timed mock exams and flashcards for every major ARDMS registry.</p>
            <div className="mt-6 flex flex-col gap-3">
              {[
                { icon: Layers, gradient: 'blue' as const, title: '2,700+ practice questions', sub: 'With explanations and hints for every one' },
                { icon: Timer, gradient: 'violet' as const, title: 'Timed mock exams', sub: 'Paced like the real registry' },
                { icon: BookMarked, gradient: 'amber' as const, title: 'Flashcards for every topic', sub: 'Study anywhere, swipe to review' },
              ].map((f) => (
                <div key={f.title} className="bg-white surface rounded-[20px] p-3.5 flex items-center gap-3.5">
                  <GradientIcon icon={f.icon} gradient={f.gradient} size={40} />
                  <div>
                    <p className="text-[15px] font-bold text-ink">{f.title}</p>
                    <p className="text-[12.5px] text-slate-400 font-medium">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'exam' && (
          <div className="slide-up">
            <p className="eyebrow">All {registries.length} registries in one app</p>
            <h1 className="text-[30px] font-extrabold tracking-[-0.03em] text-ink leading-[1.1] mt-3">
              Which exam are you <Accent>studying for?</Accent>
            </h1>
            <p className="text-slate-500 text-[15px] mt-1.5">You can switch anytime from Home.</p>
            <div className="mt-5 flex flex-col gap-2.5">
              {registries.map((m) => {
                const s = styleFor(m);
                const active = examFocus === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setExamFocus(m.id)}
                    className={cn('bg-white surface rounded-2xl p-3 flex items-center gap-3 text-left active:scale-[0.99] transition-transform', active && 'ring-2 ring-[#2ea873]')}
                  >
                    <GradientIcon icon={s.icon} gradient={s.gradient} size={40} />
                    <span className="flex-1 min-w-0">
                      <span className="block text-[14.5px] font-bold text-ink leading-tight">{m.name}</span>
                      <span className="block text-[12px] text-slate-400 font-medium mt-0.5">{m.questionCount} questions</span>
                    </span>
                    {active && (
                      <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: GREEN }}>
                        <Check size={14} strokeWidth={3} className="text-white" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 'date' && (
          <div className="slide-up">
            <GradientIcon icon={CalendarDays} gradient="violet" size={52} />
            <h1 className="text-[30px] font-extrabold tracking-[-0.03em] text-ink leading-[1.1] mt-6">
              When is <Accent>your exam?</Accent>
            </h1>
            <p className="text-slate-500 text-[15px] mt-1.5">We’ll count down the days on your Home screen.</p>
            <label className="block mt-6 min-w-0">
              <span className="text-[13px] font-semibold text-slate-600">Exam date</span>
              <div className="relative mt-1.5">
                <input
                  type="date"
                  min={today}
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  style={examDate ? undefined : { color: 'transparent' }}
                  className="date-input block w-full min-w-0 max-w-full h-12 px-4 rounded-2xl bg-white border border-slate-200 text-[16px] text-ink outline-none focus:border-[#2ea873] focus:ring-2 focus:ring-[#2ea873]/20"
                />
                {!examDate && (
                  <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[16px] text-slate-400">Tap to choose a date</span>
                )}
              </div>
            </label>
            <button onClick={() => { setExamDate(''); next(); }} className="mt-4 text-[14px] font-semibold text-slate-500">
              I haven’t scheduled it yet
            </button>
          </div>
        )}

        {step === 'founder' && (
          <div className="slide-up">
            <p className="eyebrow">From the founder</p>
            <h1 className="text-[34px] font-extrabold tracking-[-0.035em] text-ink leading-[1.08] mt-3">
              I built the app <Accent>I wish I’d had.</Accent>
            </h1>
            <div className="bg-white rounded-[24px] p-5 mt-6 surface">
              <div className={cn(handwriting.className, 'text-[19px] leading-[1.55] text-slate-700 space-y-4')}>
                {FOUNDER_NOTE.map((p) => <p key={p}>{p}</p>)}
                <p className="text-ink">{FOUNDER_SIGNATURE}</p>
              </div>
            </div>
          </div>
        )}

        {step === 'offer' && (
          <div className="slide-up">
            <p className="eyebrow">Launch offer</p>
            <h1 className="text-[32px] font-extrabold tracking-[-0.035em] text-ink leading-[1.08] mt-3 mb-5">
              Everything you need <Accent>to pass.</Accent>
            </h1>
            <OfferPanel onPurchased={next} onContinueFree={next} continueFreeLabel="Continue with free (1 Quick 10 a day)" />
          </div>
        )}

        {step === 'account' && (
          <div className="slide-up">
            <GradientIcon icon={CloudUpload} gradient="emerald" size={52} />
            <h1 className="text-[30px] font-extrabold tracking-[-0.03em] text-ink leading-[1.1] mt-6">
              Save your <Accent>progress.</Accent>
            </h1>
            <p className="text-slate-500 text-[15px] mt-1.5 leading-relaxed">
              Create a free account so your stats, streak and flashcards follow you to your phone and the web.
            </p>
            <div className="mt-6">
              <OAuthButtons next="/dashboard" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom action (the offer step has its own buttons) */}
      {step !== 'offer' && (
        <div className="px-5 pt-3 bg-white border-t border-slate-900/5" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
          <div className="max-w-lg mx-auto">
            {step === 'account' ? (
              <button onClick={() => goTo(undefined)} className="block w-full text-center text-[15px] font-semibold text-slate-500 py-3">Maybe later</button>
            ) : (
              <>
                <button
                  onClick={next}
                  disabled={(step === 'exam' && !examFocus) || (step === 'date' && !examDate)}
                  className="btn-primary w-full py-4 rounded-2xl text-[16px] font-bold disabled:opacity-40 active:scale-[0.98] transition-transform"
                >
                  {step === 'fact' ? 'Show me how' : step === 'welcome' ? 'Get started' : 'Continue'}
                </button>
                {step === 'fact' && configured && !user && (
                  <Link href="/login?next=/dashboard" className="block text-center text-[14px] font-semibold text-slate-500 mt-3">I already have an account</Link>
                )}
                {step !== 'fact' && beforeOffer && (
                  <button onClick={skip} className="block w-full text-center text-[14px] font-semibold text-slate-400 mt-3">Skip</button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
