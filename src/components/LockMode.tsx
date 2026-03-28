'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { Lock, Unlock, Bell, BellOff, Timer, Maximize, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Context to share focus mode state across the app
interface FocusModeContextType {
  isFocusMode: boolean;
  focusTimer: number;
  setFocusMode: (enabled: boolean) => void;
}

const FocusModeContext = createContext<FocusModeContextType>({
  isFocusMode: false,
  focusTimer: 0,
  setFocusMode: () => {},
});

export const useFocusMode = () => useContext(FocusModeContext);

export function FocusModeProvider({ children }: { children: React.ReactNode }) {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [focusTimer, setFocusTimer] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('lockMode');
    if (saved === 'true') {
      setIsFocusMode(true);
    }
  }, []);

  useEffect(() => {
    if (isFocusMode) {
      const interval = setInterval(() => {
        setFocusTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setFocusTimer(0);
    }
  }, [isFocusMode]);

  const setFocusMode = (enabled: boolean) => {
    setIsFocusMode(enabled);
    localStorage.setItem('lockMode', enabled ? 'true' : 'false');
  };

  return (
    <FocusModeContext.Provider value={{ isFocusMode, focusTimer, setFocusMode }}>
      {children}
    </FocusModeContext.Provider>
  );
}

export default function LockMode() {
  const [isLocked, setIsLocked] = useState(false);
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [studyDuration, setStudyDuration] = useState(0); // in seconds
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Check if locked state is saved
    const saved = localStorage.getItem('lockMode');
    if (saved === 'true') {
      enableLockMode();
    }

    // Check fullscreen state
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Timer for study duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLocked) {
      interval = setInterval(() => {
        setStudyDuration(prev => prev + 1);
      }, 1000);
    } else {
      setStudyDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLocked]);

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

    // Hide navigation elements
    document.body.classList.add('focus-mode-active');

    // Prevent page navigation
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'You are in Focus Mode. Are you sure you want to leave?';
      return e.returnValue;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
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

    // Remove focus mode styles
    document.body.classList.remove('focus-mode-active');

    // Exit fullscreen if active
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const toggleLockMode = () => {
    if (isLocked) {
      // Confirm before disabling
      if (studyDuration > 60) {
        const minutes = Math.floor(studyDuration / 60);
        if (!confirm(`You've been focused for ${minutes} minute${minutes !== 1 ? 's' : ''}. Exit Focus Mode?`)) {
          return;
        }
      }
      disableLockMode();
    } else {
      enableLockMode();
    }
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
      } catch (err) {
        console.log('Fullscreen error:', err);
      }
    } else {
      await document.exitFullscreen();
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative">
      <Button
        variant={isLocked ? 'default' : 'outline'}
        size="sm"
        onClick={toggleLockMode}
        className={`
          flex items-center gap-2 font-semibold transition-all
          ${isLocked
            ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-200'
            : 'border-gray-200 text-gray-600 hover:text-gray-900'
          }
        `}
        title={isLocked ? 'Focus Mode: ON - Click to disable' : 'Enable Focus Mode'}
      >
        {isLocked ? (
          <>
            <Lock className="w-4 h-4" />
            <BellOff className="w-3 h-3" />
            <span className="hidden md:inline">Focus</span>
            {studyDuration > 0 && (
              <span className="hidden lg:inline text-xs opacity-90">
                {formatTime(studyDuration)}
              </span>
            )}
          </>
        ) : (
          <>
            <Unlock className="w-4 h-4" />
            <Bell className="w-3 h-3" />
            <span className="hidden md:inline">Focus Off</span>
          </>
        )}
      </Button>

      {/* Focus Mode Control Panel */}
      {isLocked && (
        <div className="fixed bottom-4 right-4 z-50">
          <Card className="bg-white/95 backdrop-blur-sm border-2 border-orange-500 shadow-2xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                <span className="text-sm font-bold text-gray-900">Focus Mode Active</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLockMode}
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Timer className="w-4 h-4 text-orange-500" />
              <span className="font-mono font-semibold">{formatTime(studyDuration)}</span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="flex-1 text-xs"
              >
                <Maximize className="w-3 h-3 mr-1" />
                {isFullscreen ? 'Exit' : 'Full'}
              </Button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              Navigation blocked
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
