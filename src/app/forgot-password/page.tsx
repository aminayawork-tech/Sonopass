'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase/client';
import { AuthShell, Field, FormError } from '@/components/auth/AuthShell';

export default function ForgotPasswordPage() {
  const supabase = getSupabase();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError(null);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (err) setError(err.message);
    else setSent(true);
  };

  return (
    <AuthShell title="Reset your password" subtitle="We’ll email you a link to choose a new one." back="/login">
      {sent ? (
        <div className="surface rounded-2xl p-5">
          <p className="text-[15px] font-bold text-ink">Check your inbox</p>
          <p className="text-[14px] text-slate-500 mt-1 leading-relaxed">
            If an account exists for <span className="font-semibold text-ink">{email}</span>, a reset link is on its way.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Field label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          <FormError message={error} />
          <button type="submit" disabled={!supabase || loading} className="btn-primary h-12 rounded-2xl text-[15px] font-bold disabled:opacity-50 active:scale-[0.98] transition-transform">
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}
      <p className="text-center mt-6">
        <Link href="/login" className="text-[14px] font-bold" style={{ color: '#2ea873' }}>Back to sign in</Link>
      </p>
    </AuthShell>
  );
}
