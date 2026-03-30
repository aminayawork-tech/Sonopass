'use client';

import { useState, useEffect, ReactNode } from 'react';

interface AppInitializerProps {
  children: ReactNode;
}

export default function AppInitializer({ children }: AppInitializerProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate app initialization - you can add real init logic here
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500">
        <div className="text-center scale-in">
          <h1 className="text-5xl font-black mb-4">
            <span className="text-white">Sono</span>
            <span className="text-emerald-100">Pass</span>
          </h1>
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
