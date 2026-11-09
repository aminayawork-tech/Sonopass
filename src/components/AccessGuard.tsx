'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Lock, Zap } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import OfferPanel from '@/components/OfferPanel';
import { useAuth } from '@/contexts/AuthContext';
import { useModality } from '@/contexts/ModalityContext';
import { quickTenAccess } from '@/lib/freeQuota';
import { isNativeApp } from '@/lib/platform';

// Everything except Quick 10 (and the free pages: home, progress, account, info pages) needs Pro
const PRO_PATHS = ['/practice', '/exam/study', '/exam/mock-exams', '/exam/mock-1', '/exam/mock-2', '/exam/mock-3', '/exam/mock-4', '/study-guide', '/learn', '/glossary', '/test'];

export function normalizePath(pathname: string | null): string {
  return (pathname ?? '/').replace(/\.html$/, '').replace(/\/$/, '') || '/';
}

export function isProPath(pathname: string | null): boolean {
  const p = normalizePath(pathname);
  return PRO_PATHS.some((g) => p === g || p.startsWith(`${g}/`));
}

export function ProPaywall({ title = 'Unlock SonoPass Pro', message }: { title?: string; message?: string }) {
  const router = useRouter();
  const { currentModality } = useModality();
  const free = currentModality ? quickTenAccess(currentModality.id) : null;

  return (
    <AppLayout>
      <div className="min-h-screen px-5 pt-14 pb-10" style={{ background: 'linear-gradient(180deg, #E3F6EC 0%, #F4F5F7 320px)' }}>
        <div className="w-12 h-12 rounded-2xl bg-white surface flex items-center justify-center">
          <Lock size={20} className="text-ink" />
        </div>
        <p className="eyebrow mt-5">SonoPass Pro</p>
        <h1 className="text-[30px] font-extrabold tracking-[-0.03em] text-ink leading-[1.1] mt-1">{title}</h1>
        <p className="text-slate-500 text-[15px] mt-2 leading-relaxed mb-5">
          {message ?? 'Mock exams, study mode, flashcards and every question are part of Pro. Free members get one Quick 10 a day.'}
        </p>
        <OfferPanel
          onContinueFree={free?.allowed ? () => router.push('/exam/quick-10') : () => router.push('/dashboard')}
          continueFreeLabel={free?.allowed ? 'Do today’s free Quick 10 instead' : 'Back to Home'}
        />
        {free?.allowed && (
          <div className="flex items-center justify-center gap-1.5 mt-5 text-[12.5px] text-slate-400">
            <Zap size={13} /> Your free Quick 10 resets every day
          </div>
        )}
      </div>
    </AppLayout>
  );
}

// Website pages anyone can open without an account. Everything else on the website needs sign-in
// (Apple or Google); the store apps keep guest mode.
const PUBLIC_WEB_PATHS = ['/', '/login', '/signup', '/auth/callback', '/forgot-password', '/reset-password', '/verify-email', '/privacy', '/terms', '/support', '/how-it-works'];

export default function AccessGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isPro, isAdmin, ready, proReady, user, configured } = useAuth();
  const path = normalizePath(pathname);
  const needsWebSignIn = configured && !isNativeApp() && !PUBLIC_WEB_PATHS.includes(path);

  useEffect(() => {
    if (needsWebSignIn && ready && !user) {
      const next = `${path}${typeof window !== 'undefined' ? window.location.search : ''}`;
      router.replace(`/login?next=${encodeURIComponent(next)}`);
    }
  }, [needsWebSignIn, ready, user, path, router]);

  if (needsWebSignIn && (!ready || !user)) return <div className="min-h-screen" style={{ backgroundColor: '#F4F5F7' }} />;

  // Admin pages (answer key etc.) are for admin accounts only
  if (normalizePath(pathname).startsWith('/admin')) {
    if (!ready) return <div className="min-h-screen" style={{ backgroundColor: '#F4F5F7' }} />;
    if (!isAdmin) {
      return (
        <AppLayout>
          <div className="min-h-screen px-5 pt-14" style={{ backgroundColor: '#F4F5F7' }}>
            <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-ink">Admins only</h1>
            <p className="text-slate-500 text-[15px] mt-2">Sign in with an admin account to open this page.</p>
          </div>
        </AppLayout>
      );
    }
    return <>{children}</>;
  }

  if (!isProPath(pathname) || isPro) return <>{children}</>;
  if (!ready || !proReady) return <div className="min-h-screen" style={{ backgroundColor: '#F4F5F7' }} />;
  return <ProPaywall />;
}
