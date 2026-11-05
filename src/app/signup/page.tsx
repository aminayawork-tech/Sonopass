'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabase } from '@/lib/supabase/client';
import { markFreshSignIn, useAuth } from '@/contexts/AuthContext';
import { AuthShell, Divider, Field, FormError, OAuthButtons, safeNext } from '@/components/auth/AuthShell';

function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get('next'));
  const { user, syncing } = useAuth();
  const supabase = getSupabase();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !syncing) router.replace(next);
  }, [user, syncing, next, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    if (password.length < 8) {
      setError('Use at least 8 characters for your password.');
      return;
    }
    setError(null);
    setLoading(true);
    markFreshSignIn();
    const { data, error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: name.trim() || undefined },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    // With email confirmation on, there is no session until the link is clicked
    if (!data.session) router.replace(`/verify-email?email=${encodeURIComponent(email.trim())}`);
  };

  return (
    <AuthShell title="Create your account" subtitle="Free. Your progress, streak and flashcards follow you to any device.">
      <OAuthButtons next={next} />
      <Divider label="or with email" />
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Field label="First name" type="text" autoComplete="given-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Optional" />
        <Field label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <Field label="Password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
        <FormError message={error} />
        <button type="submit" disabled={!supabase || loading} className="btn-primary h-12 rounded-2xl text-[15px] font-bold disabled:opacity-50 active:scale-[0.98] transition-transform">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="text-[12px] text-slate-400 text-center mt-4 leading-relaxed">
        By continuing you agree to the <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
        Each account can be signed in on 2 devices.
      </p>
      <p className="text-center text-[14px] text-slate-500 mt-6">
        Already have an account?{' '}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-bold" style={{ color: '#2ea873' }}>Sign in</Link>
      </p>
    </AuthShell>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
