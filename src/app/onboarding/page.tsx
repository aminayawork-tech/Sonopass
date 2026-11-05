'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, CalendarDays, Timer, BookMarked, Layers, CloudUpload } from 'lucide-react';
import { useModality } from '@/contexts/ModalityContext';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabase } from '@/lib/supabase/client';
import { saveOnboarding } from '@/lib/onboarding';
import { styleFor } from '@/components/ModalitySelector';
import GradientIcon from '@/components/GradientIcon';
import PlanCards, { type PaidPlan } from '@/components/PlanCards';
import { OAuthButtons, Divider } from '@/components/auth/AuthShell';
import { cn } from '@/lib/utils';
import { purchasesEnabled } from '@/lib/platform';

type Step = 'welcome' | 'exam' | 'date' | 'plan' | 'account';

export default function OnboardingPage() {
  const router = useRouter();
  const { allModalities, currentModality, switchModality } = useModality();
  const { configured, user } = useAuth();
  const registries = allModalities.filter((m) => m.enabled);
  const [step, setStep] = useState<Step>('welcome');
  const [examFocus, setExamFocus] = useState<string | null>(currentModality?.id ?? null);
  const [examDate, setExamDate] = useState('');
  const [plan, setPlan] = useState<PaidPlan | null>('lifetime');

  const steps: Step[] = useMemo(() => {
    const list: Step[] = ['welcome', 'exam', 'date'];
    if (purchasesEnabled()) list.push('plan');
    if (configured && !user) list.push('account');
    return list;
  }, [configured, user]);
  const index = steps.indexOf(step);
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

  const next = async () => {
    const following = steps[index + 1];
    if (following === 'account' || !following) await persist();
    if (following) setStep(following);
    else router.replace('/dashboard');
  };
  const back = () => index > 0 && setStep(steps[index - 1]);
  const finish = async () => {
    await persist();
    router.replace('/dashboard');
  };

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ backgroundColor: '#F4F5F7' }}>
      {/* Top bar: back + progress */}
      <div className="px-5 pt-5 flex items-center gap-4 max-w-lg w-full mx-auto">
        <button
          onClick={back}
          aria-label="Back"
          className={cn('w-10 h-10 shrink-0 rounded-full bg-white surface flex items-center justify-center transition-opacity', index === 0 && 'opacity-0 pointer-events-none')}
        >
          <ArrowLeft size={18} className="text-ink" />
        </button>
        <div className="flex-1 flex gap-1.5">
          {steps.map((s, i) => (
            <div key={s} className="h-1.5 flex-1 rounded-full transition-colors" style={{ backgroundColor: i <= index ? '#2ea873' : '#E4E7EC' }} />
          ))}
        </div>
        <button onClick={finish} className={cn('text-[13px] font-semibold text-slate-400 shrink-0', step === 'welcome' && 'invisible')}>Skip</button>
      </div>

      <div className="flex-1 px-5 pt-8 pb-6 max-w-lg w-full mx-auto">
        {step === 'welcome' && (
          <div className="slide-up">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/sonopass-logo-clean.png" alt="SonoPass" className="w-[200px] h-auto" />
            <h1 className="text-[32px] font-extrabold tracking-[-0.03em] text-ink leading-[1.1] mt-8">Pass your registry exam with confidence</h1>
            <p className="text-slate-500 text-[16px] mt-3 leading-relaxed">Practice questions, timed mock exams and flashcards for every major ARDMS registry.</p>
            <div className="mt-7 flex flex-col gap-3">
              {[
                { icon: Layers, gradient: 'blue' as const, title: '2,700+ practice questions', sub: 'With explanations and hints for every one' },
                { icon: Timer, gradient: 'violet' as const, title: 'Timed mock exams', sub: 'Paced like the real registry' },
                { icon: BookMarked, gradient: 'amber' as const, title: 'Flashcards for every topic', sub: 'Study anywhere, swipe to review' },
              ].map((f) => (
                <div key={f.title} className="surface rounded-[20px] p-3.5 flex items-center gap-3.5">
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
            <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-ink leading-tight">Which exam are you studying for?</h1>
            <p className="text-slate-500 text-[15px] mt-1.5">You can switch anytime from Home.</p>
            <div className="mt-6 flex flex-col gap-2.5">
              {registries.map((m) => {
                const s = styleFor(m);
                const active = examFocus === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setExamFocus(m.id)}
                    className={cn('surface rounded-2xl p-3 flex items-center gap-3 text-left active:scale-[0.99] transition-transform', active && 'ring-2 ring-[#2ea873]')}
                  >
                    <GradientIcon icon={s.icon} gradient={s.gradient} size={40} />
                    <span className="flex-1 text-[14.5px] font-bold text-ink">{m.name}</span>
                    {active && (
                      <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#2ea873' }}>
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
            <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-ink leading-tight mt-6">When is your exam?</h1>
            <p className="text-slate-500 text-[15px] mt-1.5">We’ll count down the days on your Home screen.</p>
            <label className="block mt-6">
              <span className="text-[13px] font-semibold text-slate-600">Exam date</span>
              <input
                type="date"
                min={today}
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="mt-1.5 w-full h-12 px-4 rounded-2xl bg-white border border-slate-200 text-[15px] text-ink outline-none focus:border-[#2ea873] focus:ring-2 focus:ring-[#2ea873]/20"
              />
            </label>
            <button onClick={() => { setExamDate(''); next(); }} className="mt-4 text-[14px] font-semibold text-slate-500">
              I haven’t scheduled it yet
            </button>
          </div>
        )}

        {step === 'plan' && (
          <div className="slide-up">
            <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-ink leading-tight">Unlock SonoPass Pro</h1>
            <p className="text-slate-500 text-[15px] mt-1.5 mb-5">Get everything for less than the cost of one review book.</p>
            <PlanCards selected={plan} onSelect={setPlan} />
          </div>
        )}

        {step === 'account' && (
          <div className="slide-up">
            <GradientIcon icon={CloudUpload} gradient="emerald" size={52} />
            <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-ink leading-tight mt-6">Save your progress</h1>
            <p className="text-slate-500 text-[15px] mt-1.5 leading-relaxed">
              Create a free account so your stats, streak and flashcards follow you to your phone and the web.
            </p>
            <div className="mt-6">
              <OAuthButtons next="/dashboard" />
              <Divider />
              <Link href="/signup?next=/dashboard" className="btn-secondary h-12 rounded-2xl flex items-center justify-center text-[15px] font-semibold">
                Sign up with email
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Bottom action */}
      <div className="px-5 pt-3 bg-white border-t border-slate-900/5" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
        <div className="max-w-lg mx-auto">
          {step === 'welcome' && (
            <>
              <button onClick={next} className="btn-primary w-full py-4 rounded-2xl text-[16px] font-bold active:scale-[0.98] transition-transform">Get started</button>
              {configured && !user && (
                <Link href="/login?next=/dashboard" className="block text-center text-[14px] font-semibold text-slate-500 mt-3">I already have an account</Link>
              )}
            </>
          )}
          {step === 'exam' && (
            <button onClick={next} disabled={!examFocus} className="btn-primary w-full py-4 rounded-2xl text-[16px] font-bold disabled:opacity-40 active:scale-[0.98] transition-transform">Continue</button>
          )}
          {step === 'date' && (
            <button onClick={next} disabled={!examDate} className="btn-primary w-full py-4 rounded-2xl text-[16px] font-bold disabled:opacity-40 active:scale-[0.98] transition-transform">Continue</button>
          )}
          {step === 'plan' && (
            <>
              <button onClick={next} className="btn-primary w-full py-4 rounded-2xl text-[16px] font-bold active:scale-[0.98] transition-transform">
                {plan === 'lifetime' ? 'Get lifetime for $49.99' : plan === 'monthly' ? 'Start Pro for $9.99/mo' : 'Continue'}
              </button>
              <button onClick={() => { setPlan(null); next(); }} className="block w-full text-center text-[14px] font-semibold text-slate-500 mt-3">Continue with free</button>
            </>
          )}
          {step === 'account' && (
            <button onClick={finish} className="block w-full text-center text-[15px] font-semibold text-slate-500 py-3">Maybe later</button>
          )}
        </div>
      </div>
    </div>
  );
}
