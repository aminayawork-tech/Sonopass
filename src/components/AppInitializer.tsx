'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AppInitializerProps {
  children: ReactNode;
}

export default function AppInitializer({ children }: AppInitializerProps) {
  const { ready: authReady } = useAuth();
  const [minTimeDone, setMinTimeDone] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const minTimer = setTimeout(() => setMinTimeDone(true), 800);
    // Never hold the app on the splash screen for long if the network is slow
    const maxTimer = setTimeout(() => setTimedOut(true), 3500);
    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, []);

  const isReady = minTimeDone && (authReady || timedOut);

  if (!isReady) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center splash-in">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/sonopass-logo-clean.png"
            alt="SonoPass"
            width={240}
            height={56}
            className="w-[240px] h-auto select-none"
            draggable={false}
          />
          <div className="mt-8 w-28 h-1 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full splash-bar" style={{ backgroundColor: '#3abc83' }} />
          </div>
        </div>
        <style jsx>{`
          .splash-in {
            animation: splashIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
          }
          .splash-bar {
            animation: splashBar 0.8s ease-in-out both;
          }
          @keyframes splashIn {
            from { opacity: 0; transform: scale(0.96); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes splashBar {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}
