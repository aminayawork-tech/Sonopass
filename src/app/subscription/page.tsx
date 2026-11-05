'use client';

import { useState } from 'react';
import { Crown, Sparkles } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import GradientIcon from '@/components/GradientIcon';
import PlanCards, { type PaidPlan } from '@/components/PlanCards';
import { useAuth } from '@/contexts/AuthContext';

const PLAN_NAME = { free: 'Free', monthly: 'Pro Monthly', lifetime: 'Pro Lifetime' } as const;
const PLAN_SUB = {
  free: 'Upgrade to unlock every registry and mock exam.',
  monthly: '$9.99 per month · cancel anytime from your app store.',
  lifetime: 'Paid once. Pro is yours for every registry you take.',
} as const;

export default function SubscriptionPage() {
  const { plan, notify } = useAuth();
  const [selected, setSelected] = useState<PaidPlan | null>('lifetime');

  // Purchases go through the App Store / Google Play later; for now the button is a placeholder.
  const purchase = () => notify('Purchases aren’t live yet. You haven’t been charged.');

  return (
    <AppLayout>
      <div className="min-h-screen px-5 pt-14 pb-10" style={{ backgroundColor: '#F4F5F7' }}>
        <h1 className="text-[30px] font-extrabold tracking-[-0.03em] text-ink leading-tight">Subscription</h1>

        <div className="surface rounded-[24px] p-5 mt-6 flex items-center gap-4">
          <GradientIcon icon={plan === 'free' ? Crown : Sparkles} gradient={plan === 'free' ? 'blue' : 'emerald'} size={44} />
          <div className="min-w-0">
            <p className="eyebrow">Current plan</p>
            <p className="text-[18px] font-extrabold text-ink mt-0.5">{PLAN_NAME[plan]}</p>
            <p className="text-[13px] text-slate-500 mt-0.5 leading-snug">{PLAN_SUB[plan]}</p>
          </div>
        </div>

        {plan !== 'lifetime' && (
          <div className="mt-7">
            <p className="eyebrow mb-1">{plan === 'monthly' ? 'Switch to lifetime' : 'Go Pro'}</p>
            <p className="text-[19px] font-extrabold text-ink tracking-tight mb-4">
              Lifetime launch deal: pay once, $49.99
            </p>
            <PlanCards selected={selected} onSelect={setSelected} />
            <button
              onClick={purchase}
              disabled={!selected || selected === plan}
              className="btn-primary w-full py-4 rounded-2xl text-[16px] font-bold mt-5 disabled:opacity-40 active:scale-[0.98] transition-transform"
            >
              {selected === 'monthly' ? 'Start Pro for $9.99/mo' : 'Get lifetime for $49.99'}
            </button>
            <button onClick={purchase} className="block w-full text-center text-[14px] font-semibold text-slate-500 mt-3">
              Restore purchases
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
