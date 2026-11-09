'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { isNativeApp } from '@/lib/platform';
import { AuthShell, OAuthButtons, safeNext } from '@/components/auth/AuthShell';

// Accounts are created with Sign in with Apple or Google only
function SignupOptions() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get('next'));
  const { user, syncing } = useAuth();
  // Guest mode exists only in the phone apps; the website needs an Apple or Google account
  const [inApp, setInApp] = useState(false);
  useEffect(() => setInApp(isNativeApp()), []);

  useEffect(() => {
    if (user && !syncing) router.replace(next);
  }, [user, syncing, next, router]);

  return (
    <AuthShell back={inApp ? '/dashboard' : '/'} title="Create your free account" subtitle="Your progress, streak and flashcards follow you to any device.">
      <OAuthButtons next={next} />
      <p className="text-[12px] text-slate-400 text-center mt-4 leading-relaxed">
        By continuing you agree to the <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
        Each account can be signed in on 2 devices.
      </p>
      <p className="text-center text-[14px] text-slate-500 mt-6">
        Already have an account?{' '}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-bold" style={{ color: '#2ea873' }}>Sign in</Link>
      </p>
      {inApp && (
        <p className="text-center mt-3">
          <Link href="/dashboard" className="text-[13px] font-semibold text-slate-400">Keep studying as a guest</Link>
        </p>
      )}
    </AuthShell>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupOptions />
    </Suspense>
  );
}
