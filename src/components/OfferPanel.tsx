'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layers, Timer, BookMarked, Target, Lightbulb, CloudUpload, Check, type LucideIcon } from 'lucide-react';
import GradientIcon, { type GradientName } from '@/components/GradientIcon';
import { useAuth } from '@/contexts/AuthContext';
import { buy, restore, getStorePrices, storeAvailable, FALLBACK_PRICES, type PaidPlan } from '@/lib/store';
import { cn } from '@/lib/utils';

// Value stack: what each part of Pro would be worth on its own
const VALUE_STACK: { icon: LucideIcon; gradient: GradientName; label: string; value: number }[] = [
  { icon: Layers, gradient: 'blue', label: '2,700+ Practice Questions', value: 199 },
  { icon: Timer, gradient: 'violet', label: '20 Full-Length Mock Exams', value: 149 },
  { icon: BookMarked, gradient: 'amber', label: 'Flashcards for All 9 Registries', value: 79 },
  { icon: Target, gradient: 'emerald', label: 'Study Mode by Category', value: 59 },
  { icon: Lightbulb, gradient: 'orange', label: 'Hints & Explanations', value: 49 },
  { icon: CloudUpload, gradient: 'cyan', label: 'Progress Synced Everywhere', value: 29 },
];
const TOTAL_VALUE = VALUE_STACK.reduce((sum, v) => sum + v.value, 0);

// What students typically spend elsewhere (approximate, US)
const ALTERNATIVES = [
  { label: 'Registry review seminar', price: '$300+' },
  { label: 'Other question-bank apps', price: 'up to $399' },
  { label: 'Review book (one exam)', price: '$60–$100' },
];

export default function OfferPanel({
  onPurchased,
  onContinueFree,
  continueFreeLabel = 'Continue with free',
}: {
  onPurchased?: () => void;
  onContinueFree?: () => void;
  continueFreeLabel?: string;
}) {
  const { notify, refreshPro } = useAuth();
  const [selected, setSelected] = useState<PaidPlan>('lifetime');
  const [prices, setPrices] = useState<Record<PaidPlan, string>>(FALLBACK_PRICES);
  const [busy, setBusy] = useState<'buy' | 'restore' | null>(null);

  useEffect(() => {
    getStorePrices().then((p) => setPrices((cur) => ({ ...cur, ...p })));
  }, []);

  const handleBuy = async () => {
    setBusy('buy');
    const result = await buy(selected);
    setBusy(null);
    if (result.ok) {
      await refreshPro();
      notify('Welcome to SonoPass Pro! Everything is unlocked.');
      onPurchased?.();
    } else if (!result.cancelled) {
      notify(result.message);
    }
  };

  const handleRestore = async () => {
    if (!storeAvailable()) {
      notify('Purchases made in the SonoPass app are restored from the app on your phone.');
      return;
    }
    setBusy('restore');
    const plan = await restore();
    await refreshPro();
    setBusy(null);
    if (plan) {
      notify('Purchases restored. Pro is unlocked.');
      onPurchased?.();
    } else {
      notify('No previous purchases were found for this account.');
    }
  };

  return (
    <div>
      {/* Value stack */}
      <div className="bg-white rounded-[24px] divide-y divide-slate-100 overflow-hidden" style={{ boxShadow: '0 10px 30px -18px rgba(14,23,38,0.35)' }}>
        {VALUE_STACK.map((v) => (
          <div key={v.label} className="flex items-center gap-3 px-4 py-3">
            <GradientIcon icon={v.icon} gradient={v.gradient} size={36} />
            <span className="flex-1 text-[14.5px] font-bold text-ink leading-tight">{v.label}</span>
            <span className="text-[14px] font-semibold text-slate-400 line-through">${v.value}</span>
          </div>
        ))}
      </div>

      {/* What it costs elsewhere */}
      <div className="mt-4 rounded-[20px] border border-slate-200 bg-white/60 px-4 py-3">
        <p className="eyebrow mb-2">What students usually pay</p>
        {ALTERNATIVES.map((a) => (
          <div key={a.label} className="flex items-center justify-between py-1">
            <span className="text-[13.5px] text-slate-600">{a.label}</span>
            <span className="text-[13.5px] font-bold text-slate-500">{a.price}</span>
          </div>
        ))}
      </div>

      {/* Price */}
      <div className="mt-4 rounded-[24px] p-5" style={{ background: 'linear-gradient(135deg, #0E1726 0%, #1B2A44 100%)', boxShadow: '0 14px 30px -16px rgba(14,23,38,0.65)' }}>
        <p className="text-[14px] text-slate-400">
          Total value <span className="line-through">${TOTAL_VALUE}</span>
        </p>
        <div className="flex items-end justify-between gap-3 mt-1">
          <p className="text-[30px] font-extrabold text-white leading-none tracking-tight">
            Today: <span style={{ color: '#4fd49a' }}>{selected === 'lifetime' ? prices.lifetime : prices.monthly}</span>
          </p>
          <span className="shrink-0 px-3 py-1.5 rounded-full text-[12px] font-extrabold uppercase tracking-wider text-ink" style={{ backgroundColor: '#4fd49a' }}>
            {selected === 'lifetime' ? 'One-time' : 'Per month'}
          </span>
        </div>
        {selected === 'lifetime' && (
          <p className="text-[12.5px] font-semibold mt-2" style={{ color: '#4fd49a' }}>Launch price · goes up after launch</p>
        )}
      </div>

      {/* Plan choice */}
      <div className="grid grid-cols-2 gap-2.5 mt-4">
        {(['lifetime', 'monthly'] as PaidPlan[]).map((p) => {
          const active = selected === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => setSelected(p)}
              className={cn('relative text-left rounded-2xl p-3.5 bg-white transition-all', active ? 'ring-2 ring-[#2ea873]' : 'ring-1 ring-slate-200')}
            >
              {active && (
                <span className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2ea873' }}>
                  <Check size={12} strokeWidth={3} className="text-white" />
                </span>
              )}
              <p className="text-[14px] font-extrabold text-ink">{p === 'lifetime' ? 'Lifetime' : 'Monthly'}</p>
              <p className="text-[13px] text-slate-500 mt-0.5">
                {p === 'lifetime' ? `${prices.lifetime} once` : `${prices.monthly} / month`}
              </p>
              {p === 'lifetime' && <p className="text-[11px] font-bold mt-1" style={{ color: '#2ea873' }}>Best value</p>}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleBuy}
        disabled={busy !== null}
        className="btn-primary w-full py-4 rounded-2xl text-[16px] font-bold mt-4 disabled:opacity-60 active:scale-[0.98] transition-transform"
      >
        {busy === 'buy' ? 'Opening…' : selected === 'lifetime' ? 'Unlock Lifetime Access' : 'Start Pro Monthly'}
      </button>

      {onContinueFree && (
        <button onClick={onContinueFree} className="block w-full text-center text-[14px] font-semibold text-slate-500 mt-3">
          {continueFreeLabel}
        </button>
      )}

      <p className="text-[11.5px] text-slate-400 text-center mt-4 leading-relaxed">
        {selected === 'monthly'
          ? `Pro Monthly is ${prices.monthly} per month and renews automatically until you cancel. Payment is charged to your Apple ID or Google Play account. Cancel anytime in your account settings at least 24 hours before the renewal date.`
          : `Lifetime is a single ${prices.lifetime} payment charged to your Apple ID or Google Play account. No subscription.`}
      </p>
      <div className="flex items-center justify-center gap-4 mt-2 text-[12px] font-semibold text-slate-400">
        <button onClick={handleRestore} disabled={busy !== null}>{busy === 'restore' ? 'Restoring…' : 'Restore purchases'}</button>
        <Link href="/terms">Terms</Link>
        <Link href="/privacy">Privacy</Link>
      </div>
    </div>
  );
}
