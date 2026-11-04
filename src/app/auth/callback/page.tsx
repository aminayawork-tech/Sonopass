'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabase } from '@/lib/supabase/client';
import { safeNext } from '@/components/auth/AuthShell';

// Landing page for OAuth and email-confirmation links. The Supabase client finishes the
// sign-in from the URL; we wait for the progress sync, then continue.
function Callback() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get('next'));
  const linkError = params.get('error_description');
  const { user, syncing } = useAuth();
  const [failed, setFailed] = useState<string | null>(linkError);

  useEffect(() => {
    if (user && !syncing) router.replace(next);
  }, [user, syncing, next, router]);

  useEffect(() => {
    if (linkError) return;
    const timer = setTimeout(async () => {
      const { data } = (await getSupabase()?.auth.getSession()) ?? { data: { session: null } };
      if (!data.session) setFailed('This sign-in link has expired or was already used.');
    }, 6000);
    return () => clearTimeout(timer);
  }, [linkError]);

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-6" style={{ backgroundColor: '#F4F5F7' }}>
      <div className="surface rounded-[24px] p-6 max-w-sm w-full text-center">
        {failed ? (
          <>
            <p className="text-[17px] font-extrabold text-ink">We couldn’t sign you in</p>
            <p className="text-[14px] text-slate-500 mt-1.5">{failed}</p>
            <Link href="/login" className="btn-primary inline-flex items-center justify-center h-11 px-5 rounded-2xl text-[14px] font-bold mt-5">Back to sign in</Link>
          </>
        ) : (
          <>
            <div className="mx-auto w-8 h-8 rounded-full border-[3px] border-slate-200 border-t-[#2ea873] animate-spin" />
            <p className="text-[15px] font-bold text-ink mt-4">Signing you in…</p>
            <p className="text-[13px] text-slate-400 mt-1">Syncing your progress</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <Callback />
    </Suspense>
  );
}
