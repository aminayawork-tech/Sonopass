'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MailCheck } from 'lucide-react';
import { getSupabase } from '@/lib/supabase/client';
import { AuthShell } from '@/components/auth/AuthShell';
import GradientIcon from '@/components/GradientIcon';
import { webOrigin } from '@/lib/platform';

function VerifyEmail() {
  const email = useSearchParams().get('email') ?? '';
  const supabase = getSupabase();
  const [resent, setResent] = useState(false);

  const resend = async () => {
    if (!supabase || !email) return;
    await supabase.auth.resend({ type: 'signup', email, options: { emailRedirectTo: `${webOrigin()}/auth/callback` } });
    setResent(true);
  };

  return (
    <AuthShell title="Confirm your email" back="/signup">
      <div className="surface rounded-[22px] p-5 flex gap-4">
        <GradientIcon icon={MailCheck} gradient="emerald" size={44} />
        <div>
          <p className="text-[15px] text-ink leading-relaxed">
            We sent a confirmation link to <span className="font-bold">{email || 'your email'}</span>. Tap it on this device to finish creating your account.
          </p>
          <p className="text-[13px] text-slate-400 mt-2">Can’t find it? Check your spam folder.</p>
        </div>
      </div>
      <button
        onClick={resend}
        disabled={!email || resent}
        className="btn-secondary w-full h-12 rounded-2xl text-[15px] font-bold mt-4 disabled:opacity-60 active:scale-[0.98] transition-transform"
      >
        {resent ? 'Link sent again' : 'Resend link'}
      </button>
      <p className="text-center mt-6">
        <Link href="/dashboard" className="text-[13px] font-semibold text-slate-400">Keep studying as a guest for now</Link>
      </p>
    </AuthShell>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmail />
    </Suspense>
  );
}
