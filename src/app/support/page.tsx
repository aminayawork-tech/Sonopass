'use client';

import { Mail, ChevronDown } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import GradientIcon from '@/components/GradientIcon';

const SUPPORT_EMAIL = 'support@sonopass.com';

const FAQ = [
  { q: 'What do I get for free?', a: 'One Quick 10 a day on one registry. Pro unlocks every question, all mock exams, study mode and the flashcards for all 9 registries.' },
  { q: 'How do I restore my purchase?', a: 'Open Menu → Manage Subscription (or any Pro screen) and tap Restore purchases while signed in to the same Apple ID or Google account.' },
  { q: 'How do I cancel Pro Monthly?', a: 'Subscriptions are managed by Apple or Google: Settings → your name → Subscriptions on iPhone, or Play Store → Payments & subscriptions on Android.' },
  { q: 'How do I sign in?', a: 'Tap Sign in and choose Continue with Apple or Continue with Google. Your free account is created the first time, and you use the same option on every device.' },
  { q: 'Why was I signed out on another device?', a: 'Each account can be used on 2 devices. Signing in on a third signs out the one used least recently.' },
  { q: 'How do I delete my account?', a: 'Menu → Account → Delete account. This permanently removes your account and synced progress.' },
];

export default function SupportPage() {
  return (
    <AppLayout>
      <div className="min-h-screen px-5 pt-14 pb-10" style={{ backgroundColor: '#F4F5F7' }}>
        <h1 className="text-[30px] font-extrabold tracking-[-0.03em] text-ink leading-tight">Contact Support</h1>
        <p className="text-slate-500 text-[15px] mt-1">We’re here to help you pass.</p>

        <div className="surface rounded-[24px] p-5 mt-6">
          <div className="flex gap-4">
            <GradientIcon icon={Mail} gradient="emerald" size={44} />
            <div className="min-w-0">
              <p className="text-[16px] font-bold text-ink">Email support</p>
              <p className="text-[14px] text-slate-500 mt-1 leading-relaxed">
                {SUPPORT_EMAIL ? `Write to us at ${SUPPORT_EMAIL} and we’ll reply within 24 hours.` : 'Our support email is coming soon.'}
              </p>
            </div>
          </div>
          {SUPPORT_EMAIL && (
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('SonoPass support')}`}
              className="btn-primary h-12 rounded-2xl mt-4 flex items-center justify-center text-[15px] font-bold"
            >
              Send email
            </a>
          )}
        </div>

        <p className="eyebrow mt-8 mb-3">Common questions</p>
        <div className="surface rounded-[22px] divide-y divide-slate-100">
          {FAQ.map((f) => (
            <details key={f.q} className="group px-4 py-3.5">
              <summary className="flex items-center justify-between gap-3 cursor-pointer list-none text-[14.5px] font-bold text-ink">
                {f.q}
                <ChevronDown size={16} className="text-slate-400 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="text-[13.5px] text-slate-500 mt-2 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
