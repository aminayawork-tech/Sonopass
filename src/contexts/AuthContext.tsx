'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { X } from 'lucide-react';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { getDeviceId, getDeviceLabel } from '@/lib/device';
import {
  PROGRESS_CHANGED_EVENT, clearLocalProgress, decideReconcile, getLocalOwner, getLocalUpdatedAt,
  mergeProgress, readLocalProgress, setLocalOwner, setLocalUpdatedAt, writeLocalProgress, type ProgressData,
} from '@/lib/progressSync';
import { getOnboarding, saveOnboarding } from '@/lib/onboarding';
import { useModality } from '@/contexts/ModalityContext';
import { useRouter } from 'next/navigation';
import { isNativeApp, APP_AUTH_CALLBACK } from '@/lib/platform';
import { safeNext } from '@/lib/safeNext';
import { cachedStorePro, getStorePlan, storeAvailable, type PaidPlan } from '@/lib/store';

export type Plan = 'free' | 'monthly' | 'lifetime';

interface AuthValue {
  configured: boolean;
  ready: boolean;     // initial session + sync finished
  syncing: boolean;
  user: User | null;
  plan: Plan;
  isPro: boolean;
  isAdmin: boolean;        // owner/test account: everything unlocked, no device limit          // Pro from the account (Supabase) or from an App Store / Google Play purchase
  proReady: boolean;       // the store purchase check has finished (always true on the web)
  refreshPro: () => Promise<boolean>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<string | null>;
  notify: (message: string) => void;
}

const AuthContext = createContext<AuthValue | null>(null);

// Set right before a deliberate sign-in (password, OAuth redirect, email link) so this device gets
// registered; without it, an unknown device on app start means it was signed out elsewhere.
const FRESH_SIGNIN_KEY = 'sonopass_signin_pending';
export function markFreshSignIn() {
  try {
    localStorage.setItem(FRESH_SIGNIN_KEY, '1');
  } catch {
    // ignore
  }
}

const REVOKED_MESSAGE = 'You were signed out because your account was signed in on 2 other devices. Each SonoPass account can be used on 2 devices.';

// Arriving from an email link or OAuth redirect is a deliberate sign-in, even in another browser.
// Must run before the Supabase client is created, because it signs in from the URL straight away.
function noteAuthRedirect() {
  if (typeof window === 'undefined') return;
  const { pathname, search, hash } = window.location;
  if (/[?&]code=/.test(search) || /access_token=/.test(hash) || pathname === '/auth/callback' || pathname === '/reset-password') {
    markFreshSignIn();
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  noteAuthRedirect();
  const supabase = getSupabase();
  const { switchModality } = useModality();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(!supabase);
  const [syncing, setSyncing] = useState(false);
  const [plan, setPlan] = useState<Plan>('free');
  const [isAdmin, setIsAdmin] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [storePlan, setStorePlan] = useState<PaidPlan | null>(() =>
    typeof window !== 'undefined' && cachedStorePro() ? 'lifetime' : null,
  );
  const [proReady, setProReady] = useState(() => typeof window === 'undefined' || !storeAvailable());
  const syncedFor = useRef<string | null>(null);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userRef = useRef<User | null>(null);
  userRef.current = user;

  const handleRevoked = useCallback(async () => {
    if (!supabase) return;
    syncedFor.current = null;
    clearLocalProgress();
    await supabase.auth.signOut({ scope: 'local' });
    setUser(null);
    setPlan('free');
    setIsAdmin(false);
    setNotice(REVOKED_MESSAGE);
  }, [supabase]);

  const pushNow = useCallback(async (uid: string) => {
    if (!supabase) return;
    const { data, error } = await supabase.rpc('save_progress', { p_device_id: getDeviceId(), p_data: readLocalProgress() });
    if (error) {
      if (/device signed out/i.test(error.message) || error.hint === 'device_revoked') await handleRevoked();
      return;
    }
    if (typeof data === 'string') setLocalUpdatedAt(data);
    setLocalOwner(uid);
  }, [supabase, handleRevoked]);

  // Plan from the account (Supabase entitlements, e.g. a website purchase) and admin status
  const loadAccountPlan = useCallback(async (uid: string): Promise<Plan> => {
    if (!supabase) return 'free';
    const { data: ent } = await supabase.from('entitlements').select('plan, status, expires_at').eq('user_id', uid).maybeSingle();
    const active = ent && ent.status === 'active' && (!ent.expires_at || new Date(ent.expires_at) > new Date());
    const accountPlan: Plan = active ? (ent.plan as Plan) : 'free';
    setPlan(accountPlan);
    const { data: admin } = await supabase.from('admins').select('user_id').eq('user_id', uid).maybeSingle();
    setIsAdmin(Boolean(admin));
    return Boolean(admin) ? 'lifetime' : accountPlan;
  }, [supabase]);

  const syncForUser = useCallback(async (u: User) => {
    if (!supabase || syncedFor.current === u.id) return;
    syncedFor.current = u.id;
    setSyncing(true);
    try {
      const deviceId = getDeviceId();
      const fresh = localStorage.getItem(FRESH_SIGNIN_KEY) === '1';
      localStorage.removeItem(FRESH_SIGNIN_KEY);
      const { data: known, error: checkError } = await supabase.rpc('check_device', { p_device_id: deviceId });
      if (checkError) {
        // Offline or server hiccup: keep using local progress and try again on the next auth event
        syncedFor.current = null;
        return;
      }
      if (!known) {
        if (!fresh) {
          await handleRevoked();
          return;
        }
        const { data: reg } = await supabase.rpc('register_device', { p_device_id: deviceId, p_label: getDeviceLabel() });
        const signedOut: string[] = reg?.signed_out ?? [];
        if (signedOut.length) {
          setNotice(`Signed in. To stay within 2 devices, ${signedOut.join(' and ')} was signed out.`);
        }
      }

      const { data: row } = await supabase.from('user_progress').select('data, updated_at').eq('user_id', u.id).maybeSingle();
      const local = readLocalProgress();
      const server = row ? { data: row.data as ProgressData, updated_at: row.updated_at as string } : null;
      const action = decideReconcile({ userId: u.id, localOwner: getLocalOwner(), localUpdatedAt: getLocalUpdatedAt(), local, server });
      if (action === 'download' && server) {
        writeLocalProgress(server.data);
        setLocalUpdatedAt(server.updated_at);
      } else if (action === 'merge' && server) {
        writeLocalProgress(mergeProgress(server.data, local));
        await pushNow(u.id);
      } else if (action === 'upload') {
        await pushNow(u.id);
      } else if (action === 'reset') {
        clearLocalProgress();
      }
      if (syncedFor.current !== u.id) return; // revoked while pushing
      setLocalOwner(u.id);

      const { data: profile } = await supabase.from('profiles').select('exam_focus, exam_date, onboarded_at').eq('id', u.id).maybeSingle();
      const localOnboarding = getOnboarding();
      if (profile?.onboarded_at) {
        saveOnboarding({ examFocus: profile.exam_focus, examDate: profile.exam_date, completedAt: profile.onboarded_at });
        if (profile.exam_focus) switchModality(profile.exam_focus);
      } else if (localOnboarding.completedAt) {
        await supabase.from('profiles').update({
          exam_focus: localOnboarding.examFocus,
          exam_date: localOnboarding.examDate,
          onboarded_at: localOnboarding.completedAt,
          updated_at: new Date().toISOString(),
        }).eq('id', u.id);
      }

      await loadAccountPlan(u.id);
    } finally {
      setSyncing(false);
    }
    // switchModality is recreated each render by its provider; the sync runs once per user anyway
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, handleRevoked, pushNow, loadAccountPlan]);

  // Session bootstrap and auth events
  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user ?? null;
      if (cancelled) return;
      setUser(u);
      if (u) await syncForUser(u);
      if (!cancelled) setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user ?? null;
      if (event === 'SIGNED_IN' && u) {
        setUser(u);
        syncForUser(u);
      } else if (event === 'SIGNED_OUT') {
        syncedFor.current = null;
        setUser(null);
        setPlan('free');
    setIsAdmin(false);
      } else if (u) {
        setUser(u);
      }
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [supabase, syncForUser]);

  // Push local changes shortly after they happen, and right away when the app goes to the background
  useEffect(() => {
    if (!supabase) return;
    const flush = () => {
      if (pushTimer.current) clearTimeout(pushTimer.current);
      pushTimer.current = null;
      const u = userRef.current;
      if (u && syncedFor.current === u.id) pushNow(u.id);
    };
    const onChange = () => {
      if (!userRef.current || syncedFor.current !== userRef.current.id) return;
      if (pushTimer.current) clearTimeout(pushTimer.current);
      pushTimer.current = setTimeout(flush, 2000);
    };
    const onVisibility = async (hidden = document.visibilityState === 'hidden') => {
      if (hidden) {
        if (pushTimer.current) flush();
        return;
      }
      const u = userRef.current;
      if (!u || syncedFor.current !== u.id) return;
      const { data: known, error } = await supabase.rpc('check_device', { p_device_id: getDeviceId() });
      if (!error && known === false) {
        await handleRevoked();
        return;
      }
      // Pick up progress saved on another device meanwhile (e.g. hearts bought in the phone app),
      // unless this device has its own changes waiting to upload
      if (pushTimer.current) return;
      const { data: row } = await supabase.from('user_progress').select('data, updated_at').eq('user_id', u.id).maybeSingle();
      if (row && (getLocalUpdatedAt() ?? '') < (row.updated_at as string)) {
        writeLocalProgress(row.data as ProgressData);
        setLocalUpdatedAt(row.updated_at as string);
      }
    };
    const onVisibilityEvent = () => onVisibility();
    window.addEventListener(PROGRESS_CHANGED_EVENT, onChange);
    document.addEventListener('visibilitychange', onVisibilityEvent);
    // Store app: also react to the app going to the background / coming back
    let appState: { remove: () => Promise<void> } | null = null;
    let disposed = false;
    if (isNativeApp()) {
      import('@capacitor/app').then(async ({ App }) => {
        const h = await App.addListener('appStateChange', ({ isActive }) => onVisibility(!isActive));
        if (disposed) h.remove();
        else appState = h;
      });
    }
    return () => {
      disposed = true;
      appState?.remove();
      window.removeEventListener(PROGRESS_CHANGED_EVENT, onChange);
      document.removeEventListener('visibilitychange', onVisibilityEvent);
    };
  }, [supabase, pushNow, handleRevoked]);

  // Store app: Google / Apple sign-in finishes in the system browser and comes back through the app's URL scheme
  useEffect(() => {
    if (!supabase || !isNativeApp()) return;
    let removed = false;
    const handles: { remove: () => Promise<void> }[] = [];
    (async () => {
      const { App } = await import('@capacitor/app');
      const { Browser } = await import('@capacitor/browser');
      const onUrl = await App.addListener('appUrlOpen', async ({ url }) => {
        // Links from the website, e.g. com.sonopass.app://open?path=/hearts
        if (url.startsWith('com.sonopass.app://open')) {
          router.push(safeNext(new URL(url).searchParams.get('path')));
          return;
        }
        if (!url.startsWith(APP_AUTH_CALLBACK)) return;
        Browser.close().catch(() => {});
        const params = new URL(url).searchParams;
        const code = params.get('code');
        const failure = params.get('error_description') ?? params.get('error');
        if (failure || !code) {
          setNotice(failure ? `Sign-in didn't finish: ${failure}` : 'Sign-in didn’t finish. Please try again.');
          return;
        }
        markFreshSignIn();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setNotice(`Sign-in didn't finish: ${error.message}`);
          return;
        }
        router.replace(safeNext(params.get('next')));
      });
      handles.push(onUrl);
      if (removed) handles.forEach((h) => h.remove());
    })();
    return () => {
      removed = true;
      handles.forEach((h) => h.remove());
    };
  }, [supabase, router]);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    const u = userRef.current;
    if (pushTimer.current) clearTimeout(pushTimer.current);
    if (u && syncedFor.current === u.id) await pushNow(u.id);
    await supabase.from('devices').delete().eq('device_id', getDeviceId());
    await supabase.auth.signOut({ scope: 'local' });
    syncedFor.current = null;
    clearLocalProgress();
    setUser(null);
    setPlan('free');
    setIsAdmin(false);
  }, [supabase, pushNow]);

  // Re-check Pro: the account plan (website purchases) and, in the store app, what this Apple ID /
  // Google account has bought. Runs at start, whenever the app comes back, and after a purchase.
  const refreshPro = useCallback(async () => {
    const u = userRef.current;
    const accountPlan = u ? await loadAccountPlan(u.id) : 'free';
    if (!storeAvailable()) return accountPlan !== 'free';
    const owned = await getStorePlan();
    setStorePlan(owned);
    setProReady(true);
    return owned !== null || accountPlan !== 'free';
  }, [loadAccountPlan]);

  useEffect(() => {
    if (!storeAvailable()) return;
    refreshPro();
    const onVisible = () => {
      if (document.visibilityState === 'visible') refreshPro();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [refreshPro]);

  const effectivePlan: Plan = plan !== 'free' ? plan : storePlan ?? 'free';

  // Permanently deletes the account and everything stored with it (required by the App Store)
  const deleteAccount = useCallback(async (): Promise<string | null> => {
    if (!supabase) return 'Accounts aren’t switched on.';
    if (pushTimer.current) clearTimeout(pushTimer.current);
    const { error } = await supabase.rpc('delete_my_account');
    if (error) return error.message;
    syncedFor.current = null;
    await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
    clearLocalProgress();
    setUser(null);
    setPlan('free');
    setIsAdmin(false);
    return null;
  }, [supabase]);

  return (
    <AuthContext.Provider value={{
      configured: isSupabaseConfigured(), ready, syncing, user, plan: effectivePlan, isPro: isAdmin || effectivePlan !== 'free', isAdmin,
      proReady, refreshPro, signOut, deleteAccount, notify: setNotice,
    }}>
      {children}
      {notice && (
        <div className="fixed top-3 inset-x-3 z-[60] flex justify-center pointer-events-none" role="status">
          <div className="pointer-events-auto max-w-md w-full surface rounded-2xl p-4 flex items-start gap-3 slide-down">
            <p className="flex-1 text-[13.5px] text-ink leading-relaxed">{notice}</p>
            <button onClick={() => setNotice(null)} aria-label="Dismiss" className="shrink-0 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
              <X size={14} className="text-slate-500" />
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
