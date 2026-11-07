'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Smartphone, Laptop, LogOut, CloudUpload, Crown } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import GradientIcon from '@/components/GradientIcon';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabase } from '@/lib/supabase/client';
import { getDeviceId } from '@/lib/device';

interface DeviceRow {
  device_id: string;
  label: string | null;
  last_seen_at: string;
}

const PLAN_LABEL = { free: 'Free', monthly: 'Pro · Monthly', lifetime: 'Pro · Lifetime' } as const;

function lastSeen(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 2) return 'Active now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  return `${Math.round(hours / 24)} days ago`;
}

export default function AccountPage() {
  const router = useRouter();
  const { configured, user, plan, isAdmin, signOut, deleteAccount, notify } = useAuth();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const supabase = getSupabase();
  const [devices, setDevices] = useState<DeviceRow[]>([]);
  const [busy, setBusy] = useState(false);
  const thisDevice = typeof window !== 'undefined' ? getDeviceId() : '';

  const loadDevices = useCallback(async () => {
    if (!supabase || !user) return;
    const { data } = await supabase.from('devices').select('device_id, label, last_seen_at').order('last_seen_at', { ascending: false });
    setDevices(data ?? []);
  }, [supabase, user]);

  useEffect(() => {
    loadDevices();
  }, [loadDevices]);

  const removeDevice = async (deviceId: string) => {
    if (!supabase) return;
    await supabase.from('devices').delete().eq('device_id', deviceId);
    notify('That device has been signed out. It will need to sign in again.');
    loadDevices();
  };

  const handleSignOut = async () => {
    setBusy(true);
    await signOut();
    router.replace('/dashboard');
  };

  const handleDelete = async () => {
    setBusy(true);
    setDeleteError(null);
    const err = await deleteAccount();
    if (err) {
      setDeleteError(err);
      setBusy(false);
      return;
    }
    notify('Your account and its data have been deleted.');
    router.replace('/dashboard');
  };

  return (
    <AppLayout>
      <div className="min-h-screen px-5 pt-14 pb-10" style={{ backgroundColor: '#F4F5F7' }}>
        <h1 className="text-[30px] font-extrabold tracking-[-0.03em] text-ink leading-tight">Account</h1>

        {!user ? (
          <div className="surface rounded-[24px] p-5 mt-6">
            <div className="flex gap-4">
              <GradientIcon icon={CloudUpload} gradient="emerald" size={44} />
              <div>
                <p className="text-[16px] font-bold text-ink">Save your progress</p>
                <p className="text-[14px] text-slate-500 mt-1 leading-relaxed">
                  You’re studying as a guest, so your progress lives only on this device. Create a free account to keep your stats, streak and flashcards on your phone and the web.
                </p>
              </div>
            </div>
            {configured ? (
              <div className="flex gap-3 mt-5">
                <Link href="/signup?next=/account" className="btn-primary flex-1 h-12 rounded-2xl flex items-center justify-center text-[15px] font-bold">Create account</Link>
                <Link href="/login?next=/account" className="btn-secondary flex-1 h-12 rounded-2xl flex items-center justify-center text-[15px] font-bold">Sign in</Link>
              </div>
            ) : (
              <p className="text-[13px] text-amber-700 bg-amber-50 rounded-2xl p-3 mt-4">Accounts aren’t switched on yet.</p>
            )}
          </div>
        ) : (
          <>
            <div className="surface rounded-[24px] p-5 mt-6">
              <p className="eyebrow">Signed in as</p>
              <p className="text-[16px] font-bold text-ink mt-1 break-all">{user.email}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <span className="flex items-center gap-2 text-[14px] font-semibold text-ink">
                  <Crown size={16} className={plan === 'free' ? 'text-slate-300' : 'text-amber-500'} />
                  {PLAN_LABEL[plan]}
                  {isAdmin && (
                    <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10.5px] font-extrabold tracking-wide">ADMIN</span>
                  )}
                </span>
                <Link href="/subscription" className="text-[13px] font-bold" style={{ color: '#2ea873' }}>
                  {plan === 'free' ? 'See plans' : 'Manage'}
                </Link>
              </div>
            </div>

            {isAdmin && (
              <Link href="/admin/answer-key" className="surface rounded-[22px] px-4 py-3.5 mt-4 flex items-center justify-between">
                <span className="text-[14.5px] font-bold text-ink">Admin: answer key</span>
                <span className="text-[13px] font-bold" style={{ color: '#2ea873' }}>Open</span>
              </Link>
            )}

            <div className="flex items-end justify-between mt-7 mb-3">
              <p className="eyebrow">Signed-in devices</p>
              <p className="text-[12px] font-semibold text-slate-400">{isAdmin ? `${devices.length} · no limit` : `${devices.length} of 2`}</p>
            </div>
            <div className="surface rounded-[22px] divide-y divide-slate-100">
              {devices.map((d) => {
                const mine = d.device_id === thisDevice;
                const Icon = /iPhone|Android|iPad/.test(d.label ?? '') ? Smartphone : Laptop;
                return (
                  <div key={d.device_id} className="px-4 py-3.5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-ink" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14.5px] font-bold text-ink truncate">{d.label ?? 'Device'}</p>
                      <p className="text-[12px] text-slate-400 font-medium">{mine ? 'This device' : lastSeen(d.last_seen_at)}</p>
                    </div>
                    {!mine && (
                      <button onClick={() => removeDevice(d.device_id)} className="text-[13px] font-bold text-red-500 px-2 py-1 rounded-lg active:bg-red-50">
                        Sign out
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-[12.5px] text-slate-400 mt-2.5 leading-relaxed">
              Each account can be used on 2 devices. Signing in on a third signs out the one used least recently.
            </p>

            <button
              onClick={handleSignOut}
              disabled={busy}
              className="btn-secondary w-full h-12 rounded-2xl flex items-center justify-center gap-2 text-[15px] font-bold mt-7 disabled:opacity-60 active:scale-[0.98] transition-transform"
              style={{ color: '#e11d48' }}
            >
              <LogOut size={17} /> {busy && !confirmDelete ? 'Signing out…' : 'Sign out'}
            </button>

            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)} className="block mx-auto mt-6 text-[13px] font-semibold text-slate-400">
                Delete account
              </button>
            ) : (
              <div className="surface rounded-[22px] p-5 mt-6">
                <p className="text-[15px] font-bold text-ink">Delete your account?</p>
                <p className="text-[13.5px] text-slate-500 mt-1 leading-relaxed">
                  This permanently deletes your account, your synced progress, streak and stats, and signs out all your devices. It can’t be undone.
                </p>
                {deleteError && <p className="text-[13px] text-red-600 bg-red-50 rounded-xl p-3 mt-3">{deleteError}</p>}
                <div className="flex gap-3 mt-4">
                  <button onClick={() => setConfirmDelete(false)} disabled={busy} className="btn-secondary flex-1 h-11 rounded-2xl text-[14px] font-bold">Cancel</button>
                  <button onClick={handleDelete} disabled={busy} className="flex-1 h-11 rounded-2xl text-[14px] font-bold text-white disabled:opacity-60" style={{ backgroundColor: '#e11d48' }}>
                    {busy ? 'Deleting…' : 'Delete forever'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
