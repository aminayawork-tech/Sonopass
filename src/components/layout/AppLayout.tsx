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
    const scroller = document.getElementById('app-scroll');
    const reset = () => {
      if (window.scrollY !== 0) window.scrollTo(0, 0);
      if (scroller && scroller.scrollTop !== 0) scroller.scrollTop = 0;
    };
    reset();
    window.addEventListener('scroll', reset, { passive: true });
    scroller?.addEventListener('scroll', reset, { passive: true });
    return () => {
      window.removeEventListener('scroll', reset);
      scroller?.removeEventListener('scroll', reset);
    };
  }, []);

  return (
    <div className="app-frame bg-[#F5F7FA] overflow-hidden">
      <div className="app-frame flex h-[100dvh]">
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
