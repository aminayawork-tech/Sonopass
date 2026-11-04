'use client';

import { Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PaidPlan = 'monthly' | 'lifetime';

export const PRO_FEATURES = [
  'All 9 registry exams, including SPI',
  '2,700+ practice questions with explanations and hints',
  'Timed full-length mock exams',
  'Flashcard decks for every registry',
  'Progress synced on your phone and the web',
];

export default function PlanCards({ selected, onSelect }: { selected: PaidPlan | null; onSelect: (plan: PaidPlan) => void }) {
  return (
    <div>
      <ul className="space-y-2 mb-5">
        {PRO_FEATURES.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[14px] text-slate-600 leading-snug">
            <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#e8f8f2' }}>
              <Check size={12} strokeWidth={3} style={{ color: '#2ea873' }} />
            </span>
            {f}
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => onSelect('lifetime')}
          className={cn(
            'relative text-left rounded-[22px] p-4 pt-5 overflow-hidden transition-all active:scale-[0.99]',
            selected === 'lifetime' ? 'ring-2 ring-[#2ea873]' : 'ring-1 ring-transparent',
          )}
          style={{ background: 'linear-gradient(135deg, #0E1726 0%, #1B2A44 100%)', boxShadow: '0 14px 30px -16px rgba(14,23,38,0.65)' }}
        >
          <span className="absolute top-0 right-4 -translate-y-px px-2.5 py-1 rounded-b-xl text-[11px] font-extrabold uppercase tracking-wider text-ink" style={{ backgroundColor: '#4fd49a' }}>
            Launch deal
          </span>
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="flex items-center gap-1.5 text-[16px] font-extrabold text-white">
                <Sparkles size={15} style={{ color: '#4fd49a' }} /> Lifetime
              </p>
              <p className="text-[12.5px] text-slate-400 mt-1">Pay once, keep Pro for every registry you take</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[24px] font-extrabold text-white leading-none tracking-tight">$49.99</p>
              <p className="text-[11px] text-slate-400 mt-1">one time</p>
            </div>
          </div>
          <p className="text-[12px] font-semibold mt-3" style={{ color: '#4fd49a' }}>Launch price · goes up after launch</p>
        </button>

        <button
          type="button"
          onClick={() => onSelect('monthly')}
          className={cn(
            'surface text-left rounded-[22px] p-4 transition-all active:scale-[0.99]',
            selected === 'monthly' && 'ring-2 ring-[#2ea873]',
          )}
        >
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[16px] font-extrabold text-ink">Pro Monthly</p>
              <p className="text-[12.5px] text-slate-400 mt-1">Cancel anytime</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[24px] font-extrabold text-ink leading-none tracking-tight">$9.99</p>
              <p className="text-[11px] text-slate-400 mt-1">per month</p>
            </div>
          </div>
        </button>
      </div>
      <p className="text-[12px] text-slate-400 text-center mt-3">Purchases aren&apos;t live yet, so you won&apos;t be charged.</p>
    </div>
  );
}
