'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase/client';
import { markFreshSignIn } from '@/contexts/AuthContext';
import { AuthShell, Field, FormError } from '@/components/auth/AuthShell';

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = getSupabase();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // The emailed link signs the user in on this device; register it like any sign-in
  useEffect(() => {
    if (!supabase) return;
    markFreshSignIn();
    supabase.auth.getSession().then(({ data }) => setHasSession(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) setHasSession(true);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    if (password.length < 8) return setError('Use at least 8 characters for your password.');
    if (password !== confirm) return setError('The two passwords don’t match.');
    setLoading(true);
    setError(null);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) setError(err.message);
    else router.replace('/dashboard');
  };

  return (
    <AuthShell title="Choose a new password" back="/login">
      {hasSession === false ? (
        <FormError message="This reset link has expired or was already used. Request a new one from the sign-in screen." />
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Field label="New password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
          <Field label="Confirm password" type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          <FormError message={error} />
          <button type="submit" disabled={!supabase || loading || !hasSession} className="btn-primary h-12 rounded-2xl text-[15px] font-bold disabled:opacity-50 active:scale-[0.98] transition-transform">
            {loading ? 'Saving…' : 'Save new password'}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
