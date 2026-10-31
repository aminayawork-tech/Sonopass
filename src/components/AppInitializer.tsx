'use client';

import { useState, useEffect, ReactNode } from 'react';

interface AppInitializerProps {
  children: ReactNode;
}

export default function AppInitializer({ children }: AppInitializerProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

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
