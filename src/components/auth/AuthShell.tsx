'use client';

import { useState, type ReactNode, type InputHTMLAttributes } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { markFreshSignIn } from '@/contexts/AuthContext';

// Only allow redirects within this app (blocks open redirects like //evil.com)
export function safeNext(next: string | null | undefined, fallback = '/dashboard'): string {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : fallback;
}

export function AuthShell({ title, subtitle, children, back = '/dashboard' }: { title: string; subtitle?: string; children: ReactNode; back?: string }) {
  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ backgroundColor: '#F4F5F7' }}>
      <div className="px-5 pt-6">
        <Link href={back} aria-label="Back" className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-white surface active:scale-95 transition-transform">
          <ArrowLeft size={18} className="text-ink" />
        </Link>
      </div>
      <div className="flex-1 px-5 pt-6 pb-10 w-full max-w-md mx-auto">
        <p className="text-[22px] font-extrabold tracking-[-0.03em]">
          <span className="text-ink">Sono</span>
          <span style={{ color: '#2ea873' }}>Pass</span>
        </p>
        <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-ink leading-tight mt-5">{title}</h1>
        {subtitle && <p className="text-slate-500 text-[15px] mt-1.5 leading-relaxed">{subtitle}</p>}
        {!isSupabaseConfigured() && (
          <p className="mt-5 rounded-2xl bg-amber-50 border border-amber-200 p-3.5 text-[13px] text-amber-800 leading-relaxed">
            Accounts aren&apos;t switched on yet. You can keep studying as a guest; your progress stays on this device.
          </p>
        )}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold text-slate-600">{label}</span>
      <input
        {...props}
        className="mt-1.5 w-full h-12 px-4 rounded-2xl bg-white border border-slate-200 text-[15px] text-ink placeholder:text-slate-300 outline-none focus:border-[#2ea873] focus:ring-2 focus:ring-[#2ea873]/20 transition"
      />
    </label>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return <p className="rounded-2xl bg-red-50 border border-red-100 p-3 text-[13px] text-red-700">{message}</p>;
}

export function Divider({ label = 'or' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="h-px flex-1 bg-slate-200" />
      <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

const GoogleMark = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C41 35.7 44 30.3 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

const AppleMark = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M16.37 12.65c-.02-2.3 1.88-3.4 1.97-3.46-1.07-1.57-2.74-1.78-3.33-1.8-1.42-.14-2.77.83-3.49.83-.72 0-1.83-.81-3.01-.79-1.55.02-2.98.9-3.78 2.29-1.61 2.8-.41 6.94 1.16 9.21.77 1.11 1.68 2.36 2.88 2.31 1.16-.05 1.59-.75 2.99-.75 1.4 0 1.79.75 3.01.72 1.24-.02 2.03-1.13 2.79-2.25.88-1.29 1.24-2.54 1.26-2.6-.03-.01-2.42-.93-2.45-3.71zM14.08 5.9c.64-.77 1.07-1.85.95-2.92-.92.04-2.03.61-2.69 1.38-.59.68-1.1 1.77-.97 2.82 1.03.08 2.07-.52 2.71-1.28z" />
  </svg>
);

export function OAuthButtons({ next }: { next: string }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = getSupabase();

  const go = async (provider: 'google' | 'apple') => {
    if (!supabase) return;
    setBusy(provider);
    setError(null);
    markFreshSignIn();
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (err) {
      setError(err.message);
      setBusy(null);
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      <button
        type="button"
        onClick={() => go('apple')}
        disabled={!supabase || busy !== null}
        className="h-12 rounded-2xl flex items-center justify-center gap-2.5 text-[15px] font-semibold text-white disabled:opacity-50 active:scale-[0.98] transition-transform"
        style={{ backgroundColor: '#0E1726' }}
      >
        <AppleMark /> {busy === 'apple' ? 'Opening Apple…' : 'Continue with Apple'}
      </button>
      <button
        type="button"
        onClick={() => go('google')}
        disabled={!supabase || busy !== null}
        className="btn-secondary h-12 rounded-2xl flex items-center justify-center gap-2.5 text-[15px] font-semibold disabled:opacity-50 active:scale-[0.98] transition-transform"
      >
        <GoogleMark /> {busy === 'google' ? 'Opening Google…' : 'Continue with Google'}
      </button>
      <FormError message={error} />
    </div>
  );
}
