'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabase } from '@/lib/supabase/client';
import { markFreshSignIn, useAuth } from '@/contexts/AuthContext';
import { AuthShell, Divider, Field, FormError, OAuthButtons, safeNext } from '@/components/auth/AuthShell';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get('next'));
  const { user, syncing } = useAuth();
  const supabase = getSupabase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Leave once signed in and progress has synced
  useEffect(() => {
    if (user && !syncing) router.replace(next);
  }, [user, syncing, next, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setError(null);
    setLoading(true);
    markFreshSignIn();
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (err) {
      setError(err.message === 'Invalid login credentials' ? 'That email and password don’t match an account.' : err.message);
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to pick up where you left off on any device.">
      <OAuthButtons next={next} />
      <Divider label="or with email" />
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Field label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <Field label="Password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />
        <div className="flex justify-end -mt-1">
          <Link href="/forgot-password" className="text-[13px] font-semibold" style={{ color: '#2ea873' }}>Forgot password?</Link>
        </div>
        <FormError message={error} />
        <button type="submit" disabled={!supabase || loading} className="btn-primary h-12 rounded-2xl text-[15px] font-bold disabled:opacity-50 active:scale-[0.98] transition-transform">
          {loading || (user && syncing) ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="text-center text-[14px] text-slate-500 mt-6">
        New to SonoPass?{' '}
        <Link href={`/signup?next=${encodeURIComponent(next)}`} className="font-bold" style={{ color: '#2ea873' }}>Create an account</Link>
      </p>
      <p className="text-center mt-3">
        <Link href="/dashboard" className="text-[13px] font-semibold text-slate-400">Keep studying as a guest</Link>
      </p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
