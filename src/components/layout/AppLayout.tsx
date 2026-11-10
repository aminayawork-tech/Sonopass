'use client';

import { ReactNode, useEffect } from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  // Only <main> scrolls on these screens. If the page itself ever gets nudged (an iOS swipe that
  // starts outside <main>), put it back so the header never gets stuck under the status bar.
  useEffect(() => {
    const reset = () => {
      if (window.scrollY !== 0) window.scrollTo(0, 0);
    };
    reset();
    window.addEventListener('scroll', reset, { passive: true });
    return () => window.removeEventListener('scroll', reset);
  }, []);

  return (
    <div className="bg-[#F5F7FA] overflow-hidden">
      <div className="flex h-[100dvh]">
        {/* Sidebar - Desktop only */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overscroll-contain pb-[calc(88px+env(safe-area-inset-bottom))] lg:pb-0">
          <div className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile only */}
      <BottomNav />
    </div>
  );
}
