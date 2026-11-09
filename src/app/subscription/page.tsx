'use client';

import { useEffect, useState } from 'react';
import { Crown, Sparkles } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import GradientIcon from '@/components/GradientIcon';
import OfferPanel from '@/components/OfferPanel';
import { useAuth } from '@/contexts/AuthContext';
import { manageSubscriptions, restore, storeAvailable } from '@/lib/store';

const PLAN_NAME = { free: 'Free', monthly: 'Pro Monthly', lifetime: 'Pro Lifetime' } as const;
const PLAN_SUB = {
  free: 'One free Quick 10 a day. Go Pro to unlock every question, mock exam and flashcard.',
  monthly: 'Renews monthly. Manage or cancel anytime in your App Store or Google Play settings.',
  lifetime: 'Paid once. Pro is yours for every registry you take.',
} as const;

export default function SubscriptionPage() {
  const { plan, notify, refreshPro, ready, user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState<'waiting' | 'slow' | null>(null);

  // Back from Stripe checkout (?purchase=success): wait for the payment to unlock the account
  useEffect(() => {
    if (!ready || typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('purchase') !== 'success') return;
    window.history.replaceState(null, '', window.location.pathname);
    if (!user) {
      notify('Payment received. Sign in with the email you paid with to unlock Pro.');
      return;
    }
    let cancelled = false;
    setConfirming('waiting');
    (async () => {
      for (let i = 0; i < 15 && !cancelled; i++) {
        if (await refreshPro()) {
          setConfirming(null);
          notify('Payment received. Welcome to SonoPass Pro! Everything is unlocked.');
          return;
        }
        await new Promise((r) => setTimeout(r, 2000));
      }
      if (!cancelled) setConfirming('slow');
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const handleRestore = async () => {
    setBusy(true);
    const owned = await restore();
    await refreshPro();
    setBusy(false);
    notify(owned ? 'Purchases restored.' : 'No previous purchases were found.');
  };

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

        {confirming && plan === 'free' && (
          <div className="surface rounded-[22px] p-4 mt-4 text-[14px] text-slate-600 leading-relaxed">
            {confirming === 'waiting'
              ? 'Payment received. Unlocking Pro on your account…'
              : `Your payment is still being confirmed. This usually takes under a minute; refresh this page shortly. If Pro isn't unlocked within an hour, email support@sonopass.com.`}
          </div>
        )}

        {plan === 'free' && !confirming && (
          <div className="mt-7">
            <p className="eyebrow mb-1">Launch offer</p>
            <p className="text-[22px] font-extrabold text-ink tracking-tight mb-4">Everything you need to pass.</p>
            <OfferPanel />
          </div>
        )}

        {plan !== 'free' && storeAvailable() && (
          <div className="flex flex-col gap-3 mt-6">
            {plan === 'monthly' && (
              <button onClick={() => manageSubscriptions()} className="btn-secondary h-12 rounded-2xl text-[15px] font-bold">
                Manage subscription
              </button>
            )}
            <button onClick={handleRestore} disabled={busy} className="text-[14px] font-semibold text-slate-500 py-2">
              {busy ? 'Restoring…' : 'Restore purchases'}
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
