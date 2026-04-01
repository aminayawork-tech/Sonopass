'use client';

import { ReactNode } from 'react';
import GlobalHeader from './GlobalHeader';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F5F7FA] transition-colors duration-300">
      <GlobalHeader />

      <div className="flex h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)]">
        {/* Sidebar - Desktop Only */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto smooth-scroll page-transition lg:pb-0"
          style={{
            paddingBottom: 'calc(4.5rem + max(env(safe-area-inset-bottom), 0px))',
          }}
        >
          <div className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNav />
    </div>
  );
}
