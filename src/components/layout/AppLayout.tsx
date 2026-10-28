'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
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
