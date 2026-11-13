'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layers, Timer, BookMarked, Target, Lightbulb, CloudUpload, Check, type LucideIcon } from 'lucide-react';
import GradientIcon, { type GradientName } from '@/components/GradientIcon';
import { useAuth } from '@/contexts/AuthContext';
import { buy, restore, getStorePrices, storeAvailable, FALLBACK_PRICES, type PaidPlan } from '@/lib/store';
import { cn } from '@/lib/utils';
import { storePlatform } from '@/lib/platform';
import { styleFor } from '@/components/ModalitySelector';
import modalitiesData from '@/data/modalities.json';

// Value stack: what each part of Pro would be worth on its own
const VALUE_STACK: { icon: LucideIcon; gradient: GradientName; label: string; value: number }[] = [
  { icon: Layers, gradient: 'blue', label: '3,200+ Practice Questions', value: 199 },
  { icon: Timer, gradient: 'violet', label: '20 Full-Length Mock Exams', value: 149 },
  { icon: BookMarked, gradient: 'amber', label: 'Flashcards for All 9 Registries', value: 79 },
  { icon: Target, gradient: 'emerald', label: 'Study Mode by Category', value: 59 },
  { icon: Lightbulb, gradient: 'orange', label: 'Hints & Explanations', value: 49 },
  { icon: CloudUpload, gradient: 'cyan', label: 'Progress Synced Everywhere', value: 29 },
];
const TOTAL_VALUE = VALUE_STACK.reduce((sum, v) => sum + v.value, 0);

// Every registry Pro unlocks (the big difference from prep that's sold one exam at a time)
const SHORT_LABEL: Record<string, string> = {
  vascular: 'Vascular', spi: 'SPI', abdomen: 'Abdomen', obgyn: 'OB/GYN', cardiac: 'Adult Echo',
  breast: 'Breast', pediatric: 'Pediatric', 'fetal-echo': 'Fetal Echo', msk: 'MSK',
};
type ModalityRow = { id: string; name: string; icon: string; enabled?: boolean };
const ALL_REGISTRIES = ((Array.isArray(modalitiesData) ? modalitiesData : (modalitiesData as { modalities: ModalityRow[] }).modalities) as ModalityRow[])
  .filter((m) => m.enabled !== false);

// Black Friday sale: shown until the end of Cyber Monday (local time), then hidden automatically.
// The price itself always comes from the App Store / Google Play, so set the sale price there.
const SALE_NAME = 'Black Friday';
const SALE_ENDS = new Date(2026, 11, 1); // midnight starting Dec 1 = end of Mon Nov 30
const SALE_ENDS_LABEL = 'Nov 30';
const REGULAR_LIFETIME_USD = 49.99;

function saleActive(): boolean {
  return Date.now() < SALE_ENDS.getTime();
}

// Cross out the regular price only when the store's price really is lower (US dollar prices)
function isDiscounted(price: string): boolean {
  if (!price.trim().startsWith('$')) return false;
  const n = parseFloat(price.replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) && n < REGULAR_LIFETIME_USD;
}

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
  const platform = storePlatform();
  const account = platform === 'ios' ? 'Apple ID' : platform === 'android' ? 'Google Play account' : 'Apple ID or Google Play account';
  const cancelHow = platform === 'ios'
    ? 'Cancel anytime in your App Store account settings at least 24 hours before the renewal date.'
    : platform === 'android'
      ? 'Cancel anytime in Google Play under Payments & subscriptions at least 24 hours before the renewal date.'
      : 'Cancel anytime in your account settings at least 24 hours before the renewal date.';
  const [selected, setSelected] = useState<PaidPlan>('lifetime');
  const [prices, setPrices] = useState<Record<PaidPlan, string>>(FALLBACK_PRICES);
  const onSale = saleActive();
  const lifetimeDiscounted = isDiscounted(prices.lifetime);
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
      {onSale && (
        <div className="mb-4 rounded-[20px] px-4 py-3 flex items-center justify-between gap-3" style={{ background: 'linear-gradient(135deg, #0E1726 0%, #1B2A44 100%)' }}>
          <div>
            <p className="text-[12px] font-extrabold uppercase tracking-widest" style={{ color: '#4fd49a' }}>{SALE_NAME} sale</p>
            <p className="text-[14px] font-bold text-white leading-snug mt-0.5">
              Pro Lifetime {lifetimeDiscounted ? <>for <span style={{ color: '#4fd49a' }}>{prices.lifetime}</span></> : 'deal'} · all 9 registries
            </p>
          </div>
          <span className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-ink bg-white">
            Ends {SALE_ENDS_LABEL}
          </span>
        </div>
      )}

      {/* All registries in one plan */}
      <div className="bg-white rounded-[24px] p-4 mb-4" style={{ boxShadow: '0 10px 30px -18px rgba(14,23,38,0.35)' }}>
        <div className="flex items-center justify-between gap-3">
          <p className="text-[17px] font-extrabold text-ink tracking-tight leading-tight">
            All {ALL_REGISTRIES.length} registries. One plan.
          </p>
          <span className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-ink" style={{ backgroundColor: '#4fd49a' }}>
            Included
          </span>
        </div>
        <p className="text-[13px] text-slate-500 mt-1 leading-snug">
          Most exam prep is sold one registry at a time. Pro unlocks every one, now and for your next credential.
        </p>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {ALL_REGISTRIES.map((m) => {
            const st = styleFor(m);
            return (
              <div key={m.id} className="flex flex-col items-center gap-1.5 rounded-2xl bg-slate-50 px-1 py-2.5">
                <GradientIcon icon={st.icon} gradient={st.gradient} size={30} />
                <span className="text-[11.5px] font-bold text-ink text-center leading-tight">{SHORT_LABEL[m.id] ?? m.name}</span>
              </div>
            );
          })}
        </div>
      </div>

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
            Today:{' '}
            {selected === 'lifetime' && lifetimeDiscounted && (
              <span className="text-[18px] font-bold text-slate-400 line-through mr-1">${REGULAR_LIFETIME_USD}</span>
            )}
            <span style={{ color: '#4fd49a' }}>{selected === 'lifetime' ? prices.lifetime : prices.monthly}</span>
          </p>
          <span className="shrink-0 px-3 py-1.5 rounded-full text-[12px] font-extrabold uppercase tracking-wider text-ink" style={{ backgroundColor: '#4fd49a' }}>
            {selected === 'lifetime' ? 'One-time' : 'Per month'}
          </span>
        </div>
        {selected === 'lifetime' && (
          <p className="text-[12.5px] font-semibold mt-2" style={{ color: '#4fd49a' }}>
            {onSale ? `${SALE_NAME} sale · ends ${SALE_ENDS_LABEL}` : 'Launch price · goes up after launch'}
          </p>
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
          ? `Pro Monthly is ${prices.monthly} per month and renews automatically until you cancel. Payment is charged to your ${account}. ${cancelHow}`
          : `Lifetime is a single ${prices.lifetime} payment charged to your ${account}. No subscription.`}
      </p>
      <div className="flex items-center justify-center gap-4 mt-2 text-[12px] font-semibold text-slate-400">
        <button onClick={handleRestore} disabled={busy !== null}>{busy === 'restore' ? 'Restoring…' : 'Restore purchases'}</button>
        <Link href="/terms">Terms</Link>
        <Link href="/privacy">Privacy</Link>
      </div>
    </div>
  );
}
