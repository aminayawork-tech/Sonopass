'use client';

import { useEffect, useState } from 'react';
import { Heart, Flame, Share2, Clock, Check } from 'lucide-react';
import {
  MAX_HEARTS, STREAK_HEART_EVERY, SHARE_HEART_REWARD, canClaimShareReward, claimShareReward,
  getCurrentModalityStats, getHeartRefillAt, type UserStats,
} from '@/lib/userStats';
import GradientIcon from '@/components/GradientIcon';
import { webOrigin } from '@/lib/platform';
import { refillHeartsFromPurchase, getStats } from '@/lib/userStats';
import { storePlatform } from '@/lib/platform';
import { buyHearts, getHeartsPrice, storeAvailable, FALLBACK_HEARTS_PRICE } from '@/lib/store';

// Opens the installed app straight to the hearts screen (registered URL scheme)
const OPEN_APP_HEARTS = 'com.sonopass.app://open?path=/hearts';
import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/storeLinks';

function formatDuration(ms: number) {
  const totalMinutes = Math.max(1, Math.ceil(ms / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

export default function HeartsSheet({
  stats,
  onClose,
  onStatsChange,
}: {
  stats: UserStats;
  onClose: () => void;
  onStatsChange: (stats: UserStats) => void;
}) {
  const [notice, setNotice] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [price, setPrice] = useState(FALLBACK_HEARTS_PRICE);
  const [buying, setBuying] = useState(false);
  const [getApp, setGetApp] = useState(false);

  useEffect(() => {
    getHeartsPrice().then((p) => p && setPrice(p));
  }, []);

  const handleBuy = async () => {
    // Website: purchases happen in the app
    if (!storeAvailable()) {
      setGetApp(true);
      return;
    }
    setBuying(true);
    const result = await buyHearts();
    setBuying(false);
    if (result.ok) {
      onStatsChange(refillHeartsFromPurchase());
      setNotice('Hearts refilled. Keep going!');
    } else if (!result.cancelled) {
      setNotice(result.message);
    }
  };

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  // When the refill time passes while this is open, show the full hearts
  const due = getHeartRefillAt(stats);
  useEffect(() => {
    if (due !== null && now >= due) onStatsChange(getStats());
  }, [due, now, onStatsChange]);

  const platform = storePlatform();
  const topUpLine = platform === 'ios' ? 'Instant top-up through the App Store'
    : platform === 'android' ? 'Instant top-up through Google Play'
    : 'Instant top-up in the SonoPass app';
  const refillAt = getHeartRefillAt(stats);
  const streak = getCurrentModalityStats(stats).correctStreak % STREAK_HEART_EVERY;
  const shareAvailable = canClaimShareReward(stats);
  const isFull = stats.hearts >= MAX_HEARTS;

  const reward = (message: string) => {
    const { stats: updated, gained } = claimShareReward();
    onStatsChange(updated);
    setNotice(gained > 0 ? `${message} +${gained} heart${gained === 1 ? '' : 's'} added.` : message);
  };

  const handleShare = async () => {
    const url = webOrigin();
    const shareData = {
      title: 'SonoPass',
      text: "I'm prepping for my ultrasound registry exam with SonoPass. Check it out:",
      url,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        reward('Thanks for sharing!');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') setNotice('Sharing failed. Please try again.');
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(`${shareData.text} ${url}`);
      reward('Link copied. Send it to a friend!');
    } catch {
      setNotice('Could not copy the link on this device.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/40" />
      <div
        className="relative w-full max-w-lg bg-white rounded-t-[28px] px-5 pt-3 slide-up"
        style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto mb-5" />

        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5">
            {Array.from({ length: MAX_HEARTS }).map((_, i) => (
              <Heart
                key={i}
                className={i < stats.hearts ? 'w-7 h-7 text-red-500 fill-red-500' : 'w-7 h-7 text-slate-200 fill-slate-200'}
              />
            ))}
          </div>
          <p className="text-[20px] font-extrabold text-ink tracking-tight mt-3">
            {stats.hearts === 0 ? "You're out of hearts" : `${stats.hearts} of ${MAX_HEARTS} hearts`}
          </p>
          <p className="text-[13px] text-slate-500 mt-1">
            {isFull
              ? "You're full. Hints cost 1 heart, and so do wrong answers."
              : refillAt && `Full refill in ${formatDuration(refillAt - now)}`}
          </p>
        </div>

        <div
          className="mt-6 rounded-2xl p-4 flex items-center gap-3 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0E1726 0%, #1B2A44 100%)' }}
        >
          <div className="absolute -right-6 -top-8 w-28 h-28 rounded-full bg-white/5" />
          <GradientIcon icon={Heart} gradient="rose" size={42} />
          <div className="flex-1 min-w-0 relative">
            <p className="text-[15px] font-bold text-white">Refill to {MAX_HEARTS} hearts</p>
            <p className="text-[12px] text-slate-400 font-medium mt-0.5">{topUpLine}</p>
          </div>
          <button
            type="button"
            onClick={handleBuy}
            disabled={buying || isFull}
            className="relative shrink-0 h-10 px-4 rounded-full bg-white text-[14px] font-extrabold text-ink disabled:opacity-50 active:scale-95 transition-transform"
          >
            {buying ? '…' : isFull ? 'Full' : price}
          </button>
        </div>

        {getApp && (
          <div className="mt-3 surface rounded-2xl p-4">
            <p className="text-[14px] font-bold text-ink">Get hearts in the SonoPass app</p>
            <p className="text-[12.5px] text-slate-500 mt-1 leading-relaxed">
              Hearts are bought in the SonoPass iPhone or Android app. Sign in with the same account and your hearts sync here.
            </p>
            <div className="flex flex-col gap-2 mt-3">
              <a href={OPEN_APP_HEARTS} className="btn-primary h-11 rounded-xl flex items-center justify-center text-[14px] font-bold">Open SonoPass app</a>
              <div className="grid grid-cols-2 gap-2">
                {APP_STORE_URL ? (
                  <a href={APP_STORE_URL} className="btn-secondary h-10 rounded-xl flex items-center justify-center text-[13px] font-semibold">App Store</a>
                ) : (
                  <span className="btn-secondary h-10 rounded-xl flex items-center justify-center text-[13px] font-semibold opacity-60">App Store · soon</span>
                )}
                <a href={PLAY_STORE_URL} className="btn-secondary h-10 rounded-xl flex items-center justify-center text-[13px] font-semibold">Google Play</a>
              </div>
            </div>
          </div>
        )}

        <p className="eyebrow mt-6 mb-3">Or earn them free</p>
        <div className="flex flex-col gap-2.5">
          <div className="surface rounded-2xl p-3.5 flex items-center gap-3">
            <GradientIcon icon={Flame} gradient="orange" size={40} />
            <div className="flex-1 min-w-0">
              <p className="text-[14.5px] font-bold text-ink">Answer {STREAK_HEART_EVERY} in a row</p>
              <p className="text-[12px] text-slate-400 font-medium mt-0.5">Current run: {streak}/{STREAK_HEART_EVERY}</p>
            </div>
            <span className="text-[13px] font-extrabold text-red-500 shrink-0">+1</span>
          </div>

          <div className="surface rounded-2xl p-3.5 flex items-center gap-3">
            <GradientIcon icon={Share2} gradient="blue" size={40} />
            <div className="flex-1 min-w-0">
              <p className="text-[14.5px] font-bold text-ink">Share SonoPass</p>
              <p className="text-[12px] text-slate-400 font-medium mt-0.5">
                {isFull ? 'Available when you need hearts' : shareAvailable ? 'Once a day' : 'Claimed today'}
              </p>
            </div>
            {shareAvailable ? (
              <button
                onClick={handleShare}
                className="btn-primary shrink-0 h-9 px-4 rounded-full text-[13px] font-bold active:scale-95 transition-transform"
              >
                +{SHARE_HEART_REWARD} Share
              </button>
            ) : (
              <span className="shrink-0 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                <Check size={16} className="text-slate-400" />
              </span>
            )}
          </div>

          <div className="surface rounded-2xl p-3.5 flex items-center gap-3">
            <GradientIcon icon={Clock} gradient="indigo" size={40} />
            <div className="flex-1 min-w-0">
              <p className="text-[14.5px] font-bold text-ink">Wait for a refill</p>
              <p className="text-[12px] text-slate-400 font-medium mt-0.5">Back to full every 6 hours</p>
            </div>
          </div>
        </div>

        {notice && (
          <p className="text-center text-[13px] font-semibold mt-4" style={{ color: '#2ea873' }}>{notice}</p>
        )}

        <button
          onClick={onClose}
          className="btn-secondary w-full h-12 rounded-2xl text-[15px] font-bold mt-5 active:scale-[0.98] transition-transform"
        >
          Done
        </button>
      </div>
    </div>
  );
}
