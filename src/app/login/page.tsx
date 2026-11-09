'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabase } from '@/lib/supabase/client';
import { markFreshSignIn, useAuth } from '@/contexts/AuthContext';
import { isNativeApp } from '@/lib/platform';
import { AuthShell, Divider, Field, FormError, OAuthButtons, safeNext } from '@/components/auth/AuthShell';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get('next'));
  const { user, syncing } = useAuth();
  // Guest mode exists only in the phone apps; the website needs an Apple or Google account
  const [inApp, setInApp] = useState(false);
  useEffect(() => setInApp(isNativeApp()), []);
  const supabase = getSupabase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Email + password is only for the admin / App Review demo account
  const [showAdmin, setShowAdmin] = useState(params.get('admin') === '1');

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
    <AuthShell back={inApp ? '/dashboard' : '/'} title="Welcome to SonoPass" subtitle="Sign in to keep your progress, streak and flashcards on every device.">
      <OAuthButtons next={next} />
      <p className="text-[12px] text-slate-400 text-center mt-4 leading-relaxed">
        New here? Continuing with Apple or Google creates your free account. By continuing you agree to the{' '}
        <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
        Each account can be signed in on 2 devices.
      </p>
      {inApp && (
        <p className="text-center mt-6">
          <Link href="/dashboard" className="text-[13px] font-semibold text-slate-400">Keep studying as a guest</Link>
        </p>
      )}

      {showAdmin ? (
        <div className="mt-8">
          <Divider label="Admin sign-in" />
          <form onSubmit={submit} className="flex flex-col gap-4">
            <Field label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            <Field label="Password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />
            <div className="flex justify-end -mt-1">
              <Link href="/forgot-password" className="text-[13px] font-semibold" style={{ color: '#2ea873' }}>Forgot password?</Link>
            </div>
            <FormError message={error} />
            <button type="submit" disabled={!supabase || loading} className="btn-secondary h-12 rounded-2xl text-[15px] font-bold disabled:opacity-50 active:scale-[0.98] transition-transform">
              {loading || (user && syncing) ? 'Signing in…' : 'Sign in with email'}
            </button>
          </form>
        </div>
      ) : (
        <p className="text-center mt-10">
          <button onClick={() => setShowAdmin(true)} className="text-[12px] font-semibold text-slate-300">Admin sign-in</button>
        </p>
      )}
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
