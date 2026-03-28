'use client';

import { useState, useEffect } from 'react';
import { Lock, Unlock, Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LockMode() {
  const [isLocked, setIsLocked] = useState(false);
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  useEffect(() => {
    // Check if locked state is saved
    const saved = localStorage.getItem('lockMode');
    if (saved === 'true') {
      enableLockMode();
    }
  }, []);

  const enableLockMode = async () => {
    setIsLocked(true);
    localStorage.setItem('lockMode', 'true');

    // Request wake lock to keep screen on
    try {
      if ('wakeLock' in navigator) {
        const lock = await (navigator as any).wakeLock.request('screen');
        setWakeLock(lock);
      }
    } catch (err) {
      console.log('Wake lock error:', err);
    }

    // Request notification permission and suggest focus mode
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Send message to enable focus mode (platform-specific)
    try {
      // This is a suggestion - actual implementation depends on platform
      if ('setAppBadge' in navigator) {
        (navigator as any).setAppBadge(0);
      }
    } catch (err) {
      console.log('Focus mode not available:', err);
    }
  };

  const disableLockMode = () => {
    setIsLocked(false);
    localStorage.setItem('lockMode', 'false');

    // Release wake lock
    if (wakeLock) {
      wakeLock.release();
      setWakeLock(null);
    }
  };

  const toggleLockMode = () => {
    if (isLocked) {
      disableLockMode();
    } else {
      enableLockMode();
    }
  };

  return (
    <Button
      variant={isLocked ? 'default' : 'outline'}
      size="sm"
      onClick={toggleLockMode}
      className={`
        flex items-center gap-2 font-semibold
        ${isLocked
          ? 'bg-orange-500 hover:bg-orange-600 text-white'
          : 'border-gray-200 text-gray-600 hover:text-gray-900'
        }
      `}
      title={isLocked ? 'Focus Mode: ON (Screen stays on, notifications minimized)' : 'Enable Focus Mode'}
    >
      {isLocked ? (
        <>
          <Lock className="w-4 h-4" />
          <BellOff className="w-3 h-3" />
          <span className="hidden md:inline">Focus</span>
        </>
      ) : (
        <>
          <Unlock className="w-4 h-4" />
          <Bell className="w-3 h-3" />
          <span className="hidden md:inline">Focus Off</span>
        </>
      )}
    </Button>
  );
}
